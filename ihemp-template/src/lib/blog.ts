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

export function getAllPosts(stateSlug?: string) {
  if (!fs.existsSync(postsDirectory)) return [];

  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    // Handle both "state" (single) and "states" (array) fields
    const stateField = data.state || data.states;
    let states: string[] = [];
    
    if (typeof stateField === 'string') {
      states = [stateField.toLowerCase()];
    } else if (Array.isArray(stateField)) {
      states = stateField.map(s => s.toLowerCase());
    } else if (stateField) {
      // Handle unexpected format
      states = [String(stateField).toLowerCase()];
    }

    return {
      slug,
      title: data.title || slug,
      date: data.date || "",
      excerpt: data.excerpt || "",
      tags: data.tags || [],
      states, // Add states array to post object
    };
  });

  // Filter by state if provided
  if (stateSlug) {
    const targetSlug = stateSlug.toLowerCase();
    return posts
      .filter(post => {
        // Show posts marked for "all" or specific state
        const hasAll = post.states.includes('all') || post.states.length === 0;
        const hasState = post.states.includes(targetSlug);
        return hasAll || hasState;
      })
      .sort((a, b) => (a.date > b.date ? -1 : 1));
  }

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
