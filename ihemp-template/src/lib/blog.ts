import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { validateFrontmatter } from "@/lib/content-validator";

const postsDirectory = path.join(process.cwd(), "content/blog");

// Supported extensions — .md during transition, .mdx going forward
const SUPPORTED_EXTENSIONS = [".md", ".mdx"];

// ─── Environment-aware visibility ─────────────────────────────────────────────
//
// Reads VERCEL_ENV first (set by Vercel on all deployments), falls back to
// NODE_ENV for local dev.
//
// production  → only status: "published" posts are visible
// preview     → all statuses visible (non-published get DraftBanner + noindex)
// development → all statuses visible (non-published get DraftBanner + noindex)
//
// ─────────────────────────────────────────────────────────────────────────────

export type Environment = "production" | "preview" | "development";

export function getEnvironment(): Environment {
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv === "production") return "production";
  if (vercelEnv === "preview") return "preview";
  // Local dev: NODE_ENV === "development"; also catches test environments
  return "development";
}

export function isPublicEnv(): boolean {
  return getEnvironment() === "production";
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type PostStatus = "draft" | "review" | "published";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  // Frontmatter excerpt (preferred) or empty string; see contentExcerpt for the
  // body-derived fallback that is always non-empty for published posts.
  excerpt: string;
  // Safe display excerpt: frontmatter excerpt → frontmatter description → body-derived
  // Always a non-empty string when content is present. Use this for card display.
  contentExcerpt: string;
  tags: string[];
  states: string[];
  status: PostStatus;
  // Optional featured image path or URL (relative to /public or absolute)
  featuredImage?: string;
  // Review workflow fields (Phase 1.5.2) — field names match CONTENT_SCHEMA.md spec
  reviewer?: string;       // who reviewed; required on published + review
  reviewedAt?: string;     // ISO 8601; required on published
  review_notes?: string;   // optional reviewer notes
  suggested_edits?: string; // optional suggested changes
};

export type Post = PostMeta & {
  // Raw MDX/Markdown source — rendered at the page level via <MDXRemote source={post.content} />
  content: string;
};

// ─── Excerpt helpers ─────────────────────────────────────────────────────────

/**
 * Derive a plain-text excerpt from MDX/Markdown body content.
 * Strips frontmatter fences, headings, markdown syntax, HTML tags,
 * MDX component tags, and whitespace, then trims to maxLength chars.
 * Never throws — returns empty string on any error.
 */
export function deriveExcerptFromBody(body: string, maxLength = 160): string {
  try {
    const text = body
      // Remove frontmatter block if somehow present
      .replace(/^---[\s\S]*?---\n?/, "")
      // Remove MDX/JSX component tags
      .replace(/<[A-Z][\w.]*[^>]*\/?>|<\/[A-Z][\w.]*>/g, " ")
      // Remove HTML tags
      .replace(/<[^>]+>/g, " ")
      // Remove markdown headings (##, ###, etc.)
      .replace(/^#{1,6}\s+/gm, "")
      // Remove markdown bold/italic/code
      .replace(/[*_`]{1,3}([^*_`]+)[*_`]{1,3}/g, "$1")
      // Remove markdown links, keep text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // Remove image syntax
      .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
      // Remove blockquote markers
      .replace(/^>\s+/gm, "")
      // Collapse whitespace and newlines
      .replace(/[\r\n\t]+/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();

    if (text.length <= maxLength) return text;
    // Trim to maxLength at a word boundary
    const trimmed = text.slice(0, maxLength);
    const lastSpace = trimmed.lastIndexOf(" ");
    return (lastSpace > maxLength * 0.7 ? trimmed.slice(0, lastSpace) : trimmed) + "…";
  } catch {
    return "";
  }
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function findPostFile(slug: string): string | null {
  for (const ext of SUPPORTED_EXTENSIONS) {
    const filePath = path.join(postsDirectory, `${slug}${ext}`);
    if (fs.existsSync(filePath)) return filePath;
  }
  return null;
}

function normaliseStates(data: Record<string, unknown>): string[] {
  const stateField = data.state || data.states;
  if (typeof stateField === "string") return [stateField.toLowerCase()];
  if (Array.isArray(stateField)) return stateField.map((s) => String(s).toLowerCase());
  if (stateField) return [String(stateField).toLowerCase()];
  return [];
}

function buildPostMeta(
  slug: string,
  data: Record<string, unknown>,
  body = ""
): PostMeta {
  // featured_image accepts snake_case (frontmatter convention) or camelCase
  const featuredImage =
    (data.featured_image as string | undefined) ??
    (data.featuredImage  as string | undefined) ??
    undefined;

  const frontmatterExcerpt = (data.excerpt as string) || (data.description as string) || "";
  // contentExcerpt: frontmatter excerpt takes priority; fall back to body-derived
  const contentExcerpt = frontmatterExcerpt || deriveExcerptFromBody(body);

  return {
    slug,
    title: (data.title as string) || slug,
    date: (data.date as string) || "",
    excerpt: frontmatterExcerpt,
    contentExcerpt,
    tags: (data.tags as string[]) || [],
    states: normaliseStates(data),
    status: (data.status as PostStatus) || "draft",
    ...(featuredImage ? { featuredImage } : {}),
    ...(data.reviewer ? { reviewer: data.reviewer as string } : {}),
    ...(data.reviewedAt ? { reviewedAt: data.reviewedAt as string } : {}),
    ...(data.review_notes ? { review_notes: data.review_notes as string } : {}),
    ...(data.suggested_edits ? { suggested_edits: data.suggested_edits as string } : {}),
  };
}

// ─── getAllPosts ───────────────────────────────────────────────────────────────
//
// Design choice: getAllPosts accepts an options bag rather than being renamed.
// Reason: existing call sites (blog/page.tsx, generateStaticParams) already
// use getAllPosts() and pass a stateSlug. Adding an options bag is backward-
// compatible — all existing callers get production behaviour by default.
//
// Options:
//   stateSlug          — filter to posts targeting this state (or "all")
//   includeUnpublished — override env-aware filtering; true = return all statuses
//                        Used by: preview banner logic, ihemp-ops review surface (future)
//
// ─────────────────────────────────────────────────────────────────────────────

export type GetAllPostsOptions = {
  stateSlug?: string;
  includeUnpublished?: boolean;
};

export function getAllPosts(
  stateSlugOrOptions?: string | GetAllPostsOptions,
  _deprecated?: never
): PostMeta[] {
  // Backward-compat shim: accept bare string (old call sites) or options object
  const opts: GetAllPostsOptions =
    typeof stateSlugOrOptions === "string"
      ? { stateSlug: stateSlugOrOptions }
      : stateSlugOrOptions ?? {};

  const { stateSlug, includeUnpublished = false } = opts;

  if (!fs.existsSync(postsDirectory)) return [];

  const files = fs.readdirSync(postsDirectory).filter((f) =>
    SUPPORTED_EXTENSIONS.some((ext) => f.endsWith(ext))
  );

  // Deduplicate slugs — if both .md and .mdx exist, prefer .mdx
  const slugMap = new Map<string, string>();
  for (const filename of files) {
    const ext = SUPPORTED_EXTENSIONS.find((e) => filename.endsWith(e))!;
    const slug = filename.slice(0, -ext.length);
    const existing = slugMap.get(slug);
    if (!existing || (existing.endsWith(".md") && ext === ".mdx")) {
      slugMap.set(slug, filename);
    }
  }

  const posts: (PostMeta | null)[] = Array.from(slugMap.entries()).map(([slug, filename]) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content: body } = matter(fileContents);

    // Validate frontmatter — log and skip invalid posts (build never crashes)
    const validation = validateFrontmatter(data, filePath, body);
    if (!validation.valid) {
      console.warn(
        `[blog] Skipping invalid post '${filePath}':\n` +
          validation.errors.map((e) => `  - ${e}`).join("\n")
      );
      return null;
    }

    return buildPostMeta(slug, data, body);
  });

  const validPosts = posts.filter((p): p is PostMeta => p !== null);

  // ── Visibility filter ──────────────────────────────────────────────────────
  // In production: only published posts are visible.
  // In preview/dev or when explicitly overridden: all statuses visible.
  const showAll = includeUnpublished || !isPublicEnv();
  const visiblePosts = showAll
    ? validPosts
    : validPosts.filter((p) => p.status === "published");

  // ── State filter ───────────────────────────────────────────────────────────
  return visiblePosts
    .filter((post) => {
      if (!stateSlug) return true;
      const target = stateSlug.toLowerCase();
      const hasAll = post.states.includes("all") || post.states.length === 0;
      return hasAll || post.states.includes(target);
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

// ─── getPostBySlug ────────────────────────────────────────────────────────────
//
// includeUnpublished: when true (preview/dev), returns draft/review posts.
// When false (production default), non-published slugs return null → 404.

export function getPostBySlug(
  slug: string,
  { includeUnpublished = false }: { includeUnpublished?: boolean } = {}
): Post | null {
  const filePath = findPostFile(slug);
  if (!filePath) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const status = (data.status as PostStatus) || "draft";

  // Production: non-published posts are invisible
  const allowUnpublished = includeUnpublished || !isPublicEnv();
  if (!allowUnpublished && status !== "published") return null;

  return {
    ...buildPostMeta(slug, data, content),
    content,
  };
}
