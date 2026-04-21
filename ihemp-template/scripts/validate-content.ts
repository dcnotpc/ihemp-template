#!/usr/bin/env tsx
/**
 * iHemp Content Validator — Standalone Script
 *
 * Usage:
 *   npm run validate              — validate all content/blog posts
 *   npm run validate -- --strict  — same; alias for clarity
 *
 * Exit codes:
 *   0 — all posts valid
 *   1 — one or more posts failed validation
 *
 * Called by:
 *   - next.config.ts build hook (production builds → throws on failure)
 *   - .github/workflows/content-validate.yml (CI — blocks merge on failure)
 *   - Developer pre-push: `npm run validate`
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { validateFrontmatter } from "../src/lib/content-validator";

// ─── Config ──────────────────────────────────────────────────────────────────

const CONTENT_DIRS = [
  path.resolve(process.cwd(), "content/blog"),
  // Extend here when law-updates/ and advocacy/ folders are created
];

const SUPPORTED_EXTENSIONS = [".md", ".mdx"];

// ─── Runner ──────────────────────────────────────────────────────────────────

type ValidationFailure = {
  file: string;
  errors: string[];
};

function scanDir(dir: string): ValidationFailure[] {
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

    const result = validateFrontmatter(data, filePath, body);

    if (!result.valid) {
      failures.push({ file: filePath, errors: result.errors });
    }
  }

  return failures;
}

function run(): void {
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
    const failures = scanDir(dir);
    allFailures.push(...failures);
    totalFailures += failures.length;
  }

  if (allFailures.length === 0) {
    console.log(`✅ All ${totalFiles} post(s) passed validation.\n`);
    process.exit(0);
  }

  // ── Print failures ──────────────────────────────────────────────────────
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
