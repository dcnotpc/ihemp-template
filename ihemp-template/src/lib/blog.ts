import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/blog");

function simpleMarkdown(md: string): string {
  const lines = md.split("\n");
  let html = "";
  let inList = false;

  for (let line of lines) {
    // Close list if we're in one and hit a non-list line
    if (inList && !line.startsWith("- ")) {
      html += "</ul>";
      inList = false;
    }

    if (line.startsWith("### ")) {
      html += `<h3>${line.slice(4)}</h3>`;
    } else if (line.startsWith("## ")) {
      html += `<h2>${line.slice(3)}</h2>`;
    } else if (line.startsWith("# ")) {
      html += `<h1>${line.slice(2)}</h1>`;
    } else if (line.startsWith("- ")) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${line.slice(2)}</li>`;
    } else if (line.trim() === "") {
      html += "";
    } else {
      html += `<p>${line}</p>`;
    }
  }

  if (inList) html += "</ul>";

  // Inline formatting
  html = html
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");

  return html;
}

export function getAllPosts() {
  if (!fs.existsSync(postsDirectory)) return [];

  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title || slug,
      date: data.date || "",
      excerpt: data.excerpt || "",
      tags: data.tags || [],
    };
  });

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string) {
  const filePath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const htmlContent = simpleMarkdown(content);

  return {
    slug,
    title: data.title || slug,
    date: data.date || "",
    excerpt: data.excerpt || "",
    tags: data.tags || [],
    content: htmlContent,
  };
}
