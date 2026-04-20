import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { validateFrontmatter } from "@/lib/content-validator";

const postsDirectory = path.join(process.cwd(), "content/blog");

// Supported extensions — .md during transition, .mdx going forward (Chunk C renames existing posts)
const SUPPORTED_EXTENSIONS = [".md", ".mdx"];

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  states: string[];
};

export type Post = PostMeta & {
  // Raw MDX/Markdown source — rendered at the page level via <MDXRemote source={post.content} />
  content: string;
};

function findPostFile(slug: string): string | null {
  for (const ext of SUPPORTED_EXTENSIONS) {
    const filePath = path.join(postsDirectory, `${slug}${ext}`);
    if (fs.existsSync(filePath)) return filePath;
  }
  return null;
}

export function getAllPosts(stateSlug?: string): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const files = fs.readdirSync(postsDirectory).filter((f) =>
    SUPPORTED_EXTENSIONS.some((ext) => f.endsWith(ext))
  );

  // Deduplicate slugs — if both .md and .mdx exist for the same slug, prefer .mdx
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
    const { data } = matter(fileContents);

    // Handle both "state" (string) and "states" (array) frontmatter fields
    const stateField = data.state || data.states;
    let states: string[] = [];
    if (typeof stateField === "string") {
      states = [stateField.toLowerCase()];
    } else if (Array.isArray(stateField)) {
      states = stateField.map((s) => String(s).toLowerCase());
    } else if (stateField) {
      states = [String(stateField).toLowerCase()];
    }

    const meta: PostMeta = {
      slug,
      title: data.title || slug,
      date: data.date || "",
      excerpt: data.excerpt || data.description || "",
      tags: data.tags || [],
      states,
    };

    // Validate frontmatter — log and skip invalid posts (build never crashes)
    const validation = validateFrontmatter(data, filePath);
    if (!validation.valid) {
      console.warn(
        `[blog] Skipping invalid post '${filePath}':\n` +
          validation.errors.map((e) => `  - ${e}`).join("\n")
      );
      return null;
    }

    return meta;
  });

  // Filter nulls (invalid posts skipped)
  const validPosts = posts.filter((p): p is PostMeta => p !== null);

  return validPosts
    .filter((post) => {
      if (!stateSlug) return true;
      const target = stateSlug.toLowerCase();
      const hasAll = post.states.includes("all") || post.states.length === 0;
      return hasAll || post.states.includes(target);
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = findPostFile(slug);
  if (!filePath) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const stateField = data.state || data.states;
  let states: string[] = [];
  if (typeof stateField === "string") {
    states = [stateField.toLowerCase()];
  } else if (Array.isArray(stateField)) {
    states = stateField.map((s) => String(s).toLowerCase());
  } else if (stateField) {
    states = [String(stateField).toLowerCase()];
  }

  return {
    slug,
    title: data.title || slug,
    date: data.date || "",
    excerpt: data.excerpt || data.description || "",
    tags: data.tags || [],
    states,
    // Return raw source — page renders via <MDXRemote source={post.content} />
    content,
  };
}
