import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const POSTS_DIR = path.join(process.cwd(), "content/blog");
const API_SECRET = process.env.OPENCLAW_API_SECRET;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!API_SECRET || authHeader !== `Bearer ${API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { slug, title, description, date, published = true, content } = body;

  if (!slug || !title || !content) {
    return NextResponse.json(
      { error: "Missing required fields: slug, title, content" },
      { status: 400 }
    );
  }

  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
description: "${(description ?? "").replace(/"/g, '\\"')}"
date: "${date ?? new Date().toISOString().split("T")[0]}"
published: ${published}
---

`;

  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }

  const filepath = path.join(POSTS_DIR, `${slug}.mdx`);
  fs.writeFileSync(filepath, frontmatter + "\n\n" + content, "utf-8");

  return NextResponse.json({ success: true, slug }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!API_SECRET || authHeader !== `Bearer ${API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await req.json();
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const filepath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filepath)) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  fs.unlinkSync(filepath);
  return NextResponse.json({ success: true, slug }, { status: 200 });
}
