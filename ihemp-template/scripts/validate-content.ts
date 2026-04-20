/**
 * iHemp Content Validator Script
 * Validates all posts in content/blog/ and writes MIGRATION_REPORT.md
 * Run: npm run validate:content
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { validateFrontmatter } from "../src/lib/content-validator";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const REPORT_PATH = path.join(process.cwd(), "..", "..", "..", "MIGRATION_REPORT.md");
// Write to workspace root (3 levels up from ihemp-template/)
const WORKSPACE_REPORT = path.resolve(process.cwd(), "../../../.openclaw/workspace/MIGRATION_REPORT.md");

const SUPPORTED_EXTENSIONS = [".md", ".mdx"];

function formatFrontmatter(data: Record<string, unknown>): string {
  const lines = Object.entries(data).map(([k, v]) => {
    if (Array.isArray(v)) return `${k}: ${JSON.stringify(v)}`;
    if (typeof v === "string") return `${k}: "${v}"`;
    return `${k}: ${v}`;
  });
  return lines.join("\n");
}

function migrationChecklist(errors: string[]): string[] {
  const items: string[] = [];
  for (const err of errors) {
    if (err.includes("Missing required field: 'slug'")) {
      items.push("Add `slug` field matching the filename (without extension)");
    } else if (err.includes("Missing required field: 'status'")) {
      items.push("Add `status: draft` (or the appropriate lifecycle status)");
    } else if (err.includes("Missing required field: 'type'")) {
      items.push("Add `type: blog` (or law-update / advocacy)");
    } else if (err.includes("Missing required field: 'states'")) {
      items.push("Rename `state` → `states` and wrap in an array (e.g. `states: [\"colorado\"]`)");
    } else if (err.includes("Deprecated field 'state'")) {
      items.push("Rename `state` → `states` as an array (e.g. `states: [\"colorado\"]`)");
    } else if (err.includes("Missing required field: 'agent'")) {
      items.push("Add `agent: legacy` (pre-Phase-1.5 posts use 'legacy')");
    } else if (err.includes("Missing required field: 'created'")) {
      items.push("Add `created` — ISO 8601 datetime (use post `date` as approximation)");
    } else if (err.includes("Missing required field: 'updated'")) {
      items.push("Add `updated` — ISO 8601 datetime (use post `date` as approximation)");
    } else if (err.includes("Missing required field: 'excerpt'")) {
      items.push("Add `excerpt` — 1–2 sentence summary of the post");
    } else if (err.includes("Tag count out of range")) {
      items.push("Update `tags` — must have 2–6 tags from TAGS.yml");
    } else if (err.includes("Unknown tag")) {
      const match = err.match(/Unknown tag '([^']+)'/);
      if (match) {
        items.push(
          `Replace unknown tag '${match[1]}' with an approved tag from TAGS.yml`
        );
      }
    } else if (err.includes("educational")) {
      items.push(
        "Add exactly one educational tier tag: beginner | intermediate | deep-dive | myths | history"
      );
    } else if (err.includes("legal_regulatory") || err.includes("advocacy")) {
      items.push(
        "Add at least one tag from legal_regulatory or advocacy category"
      );
    } else if (err.includes(".mdx")) {
      items.push("Rename file from .md to .mdx");
    } else {
      items.push(`Fix: ${err}`);
    }
  }

  // Always add extension migration note for .md files
  items.push("Rename file from `.md` to `.mdx` (Chunk C migration)");

  return [...new Set(items)]; // dedupe
}

async function main() {
  console.log("🌿 iHemp Content Validator\n");

  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`Blog directory not found: ${BLOG_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) =>
    SUPPORTED_EXTENSIONS.some((ext) => f.endsWith(ext))
  );

  console.log(`Found ${files.length} post(s) in content/blog/\n`);

  const report: string[] = [];
  report.push("# iHemp Content Migration Report");
  report.push(`Generated: ${new Date().toISOString()}`);
  report.push(`Branch: phase-1.5-content-foundation`);
  report.push(`Posts scanned: ${files.length}`);
  report.push("");
  report.push("---");
  report.push("");
  report.push("> This report identifies all schema violations in existing posts.");
  report.push("> It is the migration checklist for Phase 1.5 Chunk C.");
  report.push("> All violations are expected — existing posts predate CONTENT_SCHEMA.md.");
  report.push("");

  let passCount = 0;
  let failCount = 0;

  for (const filename of files.sort()) {
    const filePath = path.join(BLOG_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw);
    const result = validateFrontmatter(data, filePath);

    report.push(`## \`${filename}\``);
    report.push("");
    report.push("**Current frontmatter:**");
    report.push("```yaml");
    report.push(formatFrontmatter(data));
    report.push("```");
    report.push("");

    if (result.valid) {
      report.push("✅ **PASSES validation** — no action required.");
      passCount++;
    } else {
      failCount++;
      report.push(`❌ **FAILS validation** — ${result.errors.length} error(s)`);
      report.push("");
      report.push("**Validation errors:**");
      for (const err of result.errors) {
        report.push(`- ${err}`);
      }
      report.push("");
      report.push("**Migration checklist:**");
      const checklist = migrationChecklist(result.errors);
      for (const item of checklist) {
        report.push(`- [ ] ${item}`);
      }

      // Print to console too
      console.log(`❌ ${filename} — ${result.errors.length} error(s)`);
      for (const err of result.errors) {
        console.log(`   - ${err}`);
      }
    }

    report.push("");
    report.push("---");
    report.push("");
  }

  // Summary
  report.push("## Summary");
  report.push("");
  report.push(`| Result | Count |`);
  report.push(`|--------|-------|`);
  report.push(`| ✅ Pass | ${passCount} |`);
  report.push(`| ❌ Fail | ${failCount} |`);
  report.push(`| Total | ${files.length} |`);
  report.push("");
  report.push("All failures are expected — existing posts were created before CONTENT_SCHEMA.md.");
  report.push("Chunk C will migrate each post to the new schema.");

  const reportText = report.join("\n");

  // Write to workspace root
  const outPath = path.resolve(process.cwd(), "MIGRATION_REPORT.md");
  fs.writeFileSync(outPath, reportText, "utf8");
  console.log(`\n✅ Report written to: ${outPath}`);
  console.log(`\nSummary: ${passCount} pass / ${failCount} fail / ${files.length} total`);
}

main().catch((err) => {
  console.error("Validator failed:", err);
  process.exit(1);
});
