#!/usr/bin/env tsx
/**
 * iHemp Content Validator — Standalone Script
 *
 * Two validation layers per post:
 *   1. Frontmatter — validateFrontmatter() (sync): required fields, types, tags, status rules
 *   2. MDX compilation — validateMdxCompile() (async): full @mdx-js/mdx compile
 *      Catches HTML comments, bad JSX, invalid syntax — anything that would fail
 *      a Next.js build but pass a frontmatter-only check.
 *
 * A green checkmark from this script means: "this will build."
 *
 * Usage:
 *   npm run validate
 *
 * Exit codes:
 *   0 — all posts valid
 *   1 — one or more posts failed validation
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { validateFrontmatter, validateMdxCompile } from "../src/lib/content-validator";

// ─── Config ──────────────────────────────────────────────────────────────────

const CONTENT_DIRS = [
  path.resolve(process.cwd(), "content/blog"),
];

const SUPPORTED_EXTENSIONS = [".md", ".mdx"];

// ─── Runner ──────────────────────────────────────────────────────────────────

type ValidationFailure = {
  file: string;
  errors: string[];
};

async function scanDir(dir: string): Promise<ValidationFailure[]> {
  if (!fs.existsSync(dir)) {
    console.warn(`[validate] Directory not found — skipping: ${dir}`);
    return [];
  }

  const files = fs.readdirSync(dir).filter((f) =>
    SUPPORTED_EXTENSIONS.some((ext) => f.endsWith(ext))
  );

  const failures: ValidationFailure[] = [];

  for (const filename of files) {
    const filePath = path.join(dir, filename);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content: body } = matter(raw);
    const fileErrors: string[] = [];

    // Layer 1: frontmatter + static body checks (sync)
    const fmResult = validateFrontmatter(data, filePath, body);
    fileErrors.push(...fmResult.errors);

    // Layer 2: MDX compilation (async) — only run if frontmatter passed
    // Rationale: no point compiling MDX when the frontmatter is already broken;
    // fix frontmatter first so compile errors are unambiguous.
    if (fmResult.valid) {
      const mdxResult = await validateMdxCompile(body, filePath);
      fileErrors.push(...mdxResult.errors);
    }

    if (fileErrors.length > 0) {
      failures.push({ file: filePath, errors: fileErrors });
    }
  }

  return failures;
}

async function run(): Promise<void> {
  console.log("🌿 iHemp Content Validator\n");

  let totalFiles = 0;
  let totalFailures = 0;
  const allFailures: ValidationFailure[] = [];

  for (const dir of CONTENT_DIRS) {
    const dirFiles = fs.existsSync(dir)
      ? fs.readdirSync(dir).filter((f) =>
          SUPPORTED_EXTENSIONS.some((ext) => f.endsWith(ext))
        ).length
      : 0;

    totalFiles += dirFiles;
    const failures = await scanDir(dir);
    allFailures.push(...failures);
    totalFailures += failures.length;
  }

  if (allFailures.length === 0) {
    console.log(`✅ All ${totalFiles} post(s) passed validation (frontmatter + MDX compilation).\n`);
    process.exit(0);
  }

  console.error(`❌ Validation failed — ${totalFailures} of ${totalFiles} post(s) have errors:\n`);

  for (const failure of allFailures) {
    const relPath = path.relative(process.cwd(), failure.file);
    console.error(`  📄 ${relPath}`);
    for (const err of failure.errors) {
      console.error(`     • ${err}`);
    }
    console.error("");
  }

  console.error(
    "Fix the errors above before merging. Run `npm run validate` locally to re-check.\n"
  );

  process.exit(1);
}

run();
