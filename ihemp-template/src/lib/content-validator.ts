/**
 * iHemp Frontmatter Validator
 * Enforces CONTENT_SCHEMA.md rules at read time and submission time.
 * Invalid posts are logged and skipped — the build never crashes on bad content.
 */

import fs from "fs";
import path from "path";
import yaml from "js-yaml";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

type TagCategory = { [category: string]: string[] };

// ─── MDX component whitelist (mirrors src/lib/mdx-components.tsx) ───────────
// These are the HTML overrides and approved custom components.
// Keep this in sync with mdx-components.tsx — both lists must match.
// Lowercase HTML overrides are safe; only uppercase custom components need whitelisting.
const ALLOWED_UPPERCASE_COMPONENTS = new Set<string>([
  // Phase 1.5.2: DraftBanner is injected by the post page, not authored in MDX bodies.
  // It is listed here to satisfy the validator if ever referenced in a test fixture.
  // Future: "HempBanExplainer", "CallToAction", etc.
  "DraftBanner",
]);

// Unconditionally unsafe HTML tags in MDX bodies
const UNSAFE_HTML_TAGS = ["script", "iframe", "style"];

// ─── Tag cache ───────────────────────────────────────────────────────────────

let _tagCache: Set<string> | null = null;
let _educationalTags: Set<string> | null = null;
let _productTypeTags: Set<string> | null = null;
let _advocacyLegalTags: Set<string> | null = null;

function loadTagCache(): void {
  if (_tagCache !== null) return;

  const tagsPath = path.join(process.cwd(), "content", "TAGS.yml");

  if (!fs.existsSync(tagsPath)) {
    console.warn("[content-validator] TAGS.yml not found at", tagsPath, "— tag validation disabled");
    _tagCache = new Set();
    _educationalTags = new Set();
    _productTypeTags = new Set();
    _advocacyLegalTags = new Set();
    return;
  }

  const raw = fs.readFileSync(tagsPath, "utf8");
  const parsed = yaml.load(raw) as TagCategory;

  _tagCache = new Set();
  _educationalTags = new Set(parsed["educational"] ?? []);
  _productTypeTags = new Set(parsed["product_types"] ?? []);
  _advocacyLegalTags = new Set([
    ...(parsed["legal_regulatory"] ?? []),
    ...(parsed["advocacy"] ?? []),
  ]);

  for (const tags of Object.values(parsed)) {
    for (const tag of tags) {
      _tagCache.add(tag);
    }
  }
}

// ─── Constants ───────────────────────────────────────────────────────────────

const VALID_STATUSES = ["draft", "review", "approved", "published", "archived"] as const;
const VALID_TYPES = ["blog", "law-update", "advocacy"] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isISODate(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return /^\d{4}-\d{2}-\d{2}(T[\d:.+-Z]+)?$/.test(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

// ─── Body scanner ─────────────────────────────────────────────────────────────

/**
 * Scans an MDX body string for:
 * 1. Unknown uppercase JSX components not in the whitelist
 * 2. Unconditionally unsafe HTML tags: <script>, <iframe>, <style>
 *
 * Returns an array of error strings (empty = clean).
 */
export function validateBody(body: string, filePath: string): string[] {
  const errors: string[] = [];
  const lines = body.split("\n");

  // ── Unsafe HTML tags (unconditional) ──────────────────────────────────────
  for (const tag of UNSAFE_HTML_TAGS) {
    for (let i = 0; i < lines.length; i++) {
      const unsafePattern = new RegExp(`<${tag}[\\s>/]`, "i");
      if (unsafePattern.test(lines[i])) {
        errors.push(
          `Unsafe HTML tag <${tag}> found at line ${i + 1} in '${filePath}' — unconditionally rejected`
        );
      }
    }
  }

  // ── Unknown uppercase JSX components ──────────────────────────────────────
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const linePattern = /<([A-Z][A-Za-z0-9.]*)/g;
    let match: RegExpExecArray | null;
    while ((match = linePattern.exec(line)) !== null) {
      const componentName = match[1];
      if (!ALLOWED_UPPERCASE_COMPONENTS.has(componentName)) {
        errors.push(
          `Unknown component <${componentName}> at line ${i + 1} in '${filePath}' — not in mdx-components whitelist`
        );
      }
    }
  }

  return errors;
}

// ─── Main validator ───────────────────────────────────────────────────────────

export function validateFrontmatter(
  fm: Record<string, unknown>,
  filePath: string,
  body?: string
): ValidationResult {
  loadTagCache();

  const errors: string[] = [];

  // ── Required fields ────────────────────────────────────────────────────────

  // title
  if (!fm.title || typeof fm.title !== "string" || fm.title.trim() === "") {
    errors.push("Missing required field: 'title'");
  }

  // slug
  if (!fm.slug || typeof fm.slug !== "string" || fm.slug.trim() === "") {
    errors.push("Missing required field: 'slug'");
  } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.slug as string)) {
    errors.push(`Invalid 'slug': must be kebab-case (got '${fm.slug}')`);
  }

  // date
  if (!fm.date) {
    errors.push("Missing required field: 'date'");
  } else if (!isISODate(fm.date)) {
    errors.push(`Invalid 'date': must be ISO 8601 format (got '${fm.date}')`);
  }

  // status — required, no default (Phase 1.5.2: explicit value enforced)
  if (!fm.status) {
    errors.push("Missing required field: 'status' (must be one of: draft, review, published — no default)");
  } else if (!VALID_STATUSES.includes(fm.status as typeof VALID_STATUSES[number])) {
    errors.push(
      `Invalid 'status': '${fm.status}' — must be one of: ${VALID_STATUSES.join(", ")}`
    );
  }

  // type
  if (!fm.type) {
    errors.push("Missing required field: 'type'");
  } else if (!VALID_TYPES.includes(fm.type as typeof VALID_TYPES[number])) {
    errors.push(
      `Invalid 'type': '${fm.type}' — must be one of: ${VALID_TYPES.join(", ")}`
    );
  }

  // states
  if (!fm.states) {
    errors.push("Missing required field: 'states' (must be an array, e.g. [\"all\"] or [\"colorado\"])");
  } else if (!isStringArray(fm.states) || (fm.states as string[]).length === 0) {
    errors.push("Invalid 'states': must be a non-empty array of strings");
  }

  // excerpt
  if (!fm.excerpt || typeof fm.excerpt !== "string" || fm.excerpt.trim() === "") {
    errors.push("Missing required field: 'excerpt'");
  }

  // agent
  if (!fm.agent || typeof fm.agent !== "string" || fm.agent.trim() === "") {
    errors.push("Missing required field: 'agent' (use 'human' for manual authorship, 'legacy' for pre-Phase-1.5 posts)");
  }

  // created
  if (!fm.created) {
    errors.push("Missing required field: 'created'");
  } else if (!isISODate(fm.created)) {
    errors.push(`Invalid 'created': must be ISO 8601 datetime (got '${fm.created}')`);
  }

  // updated
  if (!fm.updated) {
    errors.push("Missing required field: 'updated'");
  } else if (!isISODate(fm.updated)) {
    errors.push(`Invalid 'updated': must be ISO 8601 datetime (got '${fm.updated}')`);
  }

  // ── Tags validation ────────────────────────────────────────────────────────

  if (!fm.tags) {
    errors.push("Missing required field: 'tags'");
  } else if (!isStringArray(fm.tags)) {
    errors.push("Invalid 'tags': must be an array of strings");
  } else {
    const tags = fm.tags as string[];

    // Count
    if (tags.length < 2 || tags.length > 6) {
      errors.push(
        `Tag count out of range: found ${tags.length}, expected 2–6`
      );
    }

    // Unknown tags
    for (const tag of tags) {
      if (_tagCache!.size > 0 && !_tagCache!.has(tag)) {
        errors.push(
          `Unknown tag '${tag}' — not found in TAGS.yml`
        );
      }
    }

    // At least 1 from legal_regulatory, advocacy, OR educational
    // (educational is already required exactly once, so purely educational posts pass automatically)
    const hasAdvocacyLegalOrEducational =
      tags.some((t) => _advocacyLegalTags!.has(t)) ||
      tags.some((t) => _educationalTags!.has(t));
    if (
      (_advocacyLegalTags!.size > 0 || _educationalTags!.size > 0) &&
      !hasAdvocacyLegalOrEducational
    ) {
      errors.push(
        "Tags must include at least 1 tag from 'legal_regulatory', 'advocacy', or 'educational'"
      );
    }

    // Exactly 1 from educational
    const educationalCount = tags.filter((t) => _educationalTags!.has(t)).length;
    if (_educationalTags!.size > 0) {
      if (educationalCount === 0) {
        errors.push(
          "Missing required 'educational' tier tag (must include exactly one of: beginner, intermediate, deep-dive, myths, history)"
        );
      } else if (educationalCount > 1) {
        errors.push(
          `Too many 'educational' tier tags: found ${educationalCount}, expected exactly 1`
        );
      }
    }
  }

  // ── Published-only fields ──────────────────────────────────────────────────

  if (fm.status === "published") {
    if (!fm.seo_title || typeof fm.seo_title !== "string" || fm.seo_title.trim() === "") {
      errors.push("Missing required field: 'seo_title' (required when status is 'published')");
    } else if ((fm.seo_title as string).length > 60) {
      errors.push(
        `'seo_title' exceeds 60 characters (${(fm.seo_title as string).length} chars) — recommended ≤60`
      );
    }

    if (!fm.seo_description || typeof fm.seo_description !== "string" || fm.seo_description.trim() === "") {
      errors.push("Missing required field: 'seo_description' (required when status is 'published')");
    } else if ((fm.seo_description as string).length > 160) {
      errors.push(
        `'seo_description' exceeds 160 characters (${(fm.seo_description as string).length} chars) — recommended ≤160`
      );
    }

    if (fm.affiliate_disclosure === undefined || fm.affiliate_disclosure === null) {
      errors.push("Missing required field: 'affiliate_disclosure' (required when status is 'published')");
    } else if (typeof fm.affiliate_disclosure !== "boolean") {
      errors.push("Invalid 'affiliate_disclosure': must be a boolean (true or false)");
    }

    if (fm.health_claims_reviewed === undefined || fm.health_claims_reviewed === null) {
      errors.push("Missing required field: 'health_claims_reviewed' (required when status is 'published')");
    } else if (typeof fm.health_claims_reviewed !== "boolean") {
      errors.push("Invalid 'health_claims_reviewed': must be a boolean (true or false)");
    }
  }

  // ── Review workflow fields (Phase 1.5.2) ────────────────────────────────
  //
  // Field names match CONTENT_SCHEMA.md spec:
  //   reviewer   (string)          — camelCase-free, matches spec
  //   reviewedAt (ISO 8601 string) — camelCase, matches spec
  //
  // Rules by status:
  //   published  → reviewer required, reviewedAt required
  //   review     → reviewer required, reviewedAt optional
  //   draft      → reviewer optional, reviewedAt optional
  //
  // When present, all fields are type-validated regardless of status.

  // reviewer — string
  if (fm.reviewer !== undefined && fm.reviewer !== null) {
    if (typeof fm.reviewer !== "string" || (fm.reviewer as string).trim() === "") {
      errors.push(`Invalid 'reviewer' in '${filePath}': must be a non-empty string`);
    }
  } else if (fm.status === "published") {
    errors.push(`Missing required field: 'reviewer' in '${filePath}' (required when status is 'published')`);
  } else if (fm.status === "review") {
    errors.push(`Missing required field: 'reviewer' in '${filePath}' (required when status is 'review')`);
  }

  // reviewedAt — ISO 8601 datetime
  if (fm.reviewedAt !== undefined && fm.reviewedAt !== null) {
    if (!isISODate(fm.reviewedAt)) {
      errors.push(`Invalid 'reviewedAt' in '${filePath}': must be ISO 8601 datetime (got '${fm.reviewedAt}')`);
    }
  } else if (fm.status === "published") {
    errors.push(`Missing required field: 'reviewedAt' in '${filePath}' (required when status is 'published')`);
  }

  // review_notes — optional string
  if (fm.review_notes !== undefined && fm.review_notes !== null) {
    if (typeof fm.review_notes !== "string") {
      errors.push(`Invalid 'review_notes' in '${filePath}': must be a string`);
    }
  }

  // suggested_edits — optional string
  if (fm.suggested_edits !== undefined && fm.suggested_edits !== null) {
    if (typeof fm.suggested_edits !== "string") {
      errors.push(`Invalid 'suggested_edits' in '${filePath}': must be a string`);
    }
  }

  // ── Legacy field warning ───────────────────────────────────────────────────

  if ("state" in fm && fm.state) {
    errors.push(
      "Deprecated field 'state' (singular) found — migrate to 'states' (array) per Phase 1.5 schema"
    );
  }

  // ── MDX body scan ────────────────────────────────────────────────────────

  if (body !== undefined && body.trim().length > 0) {
    const bodyErrors = validateBody(body, filePath);
    errors.push(...bodyErrors);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
