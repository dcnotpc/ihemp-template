import type { NextConfig } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { validateFrontmatter } from "./src/lib/content-validator";

// ─── Build-time content validation ───────────────────────────────────────────
//
// Production builds (NODE_ENV === "production", i.e. Vercel main-branch deploys):
//   Any invalid post FAILS the build. The site stays on the last good deployment.
//
// Preview / local builds (NODE_ENV !== "production"):
//   Invalid posts are logged and skipped — build continues.
//   Developers see the errors in their terminal without a hard stop.
//
// ─────────────────────────────────────────────────────────────────────────────

const CONTENT_DIR = path.join(process.cwd(), "content/blog");
const SUPPORTED_EXTENSIONS = [".md", ".mdx"];
const IS_PRODUCTION = process.env.NODE_ENV === "production";

function runBuildTimeValidation(): void {
  if (!fs.existsSync(CONTENT_DIR)) return;

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => SUPPORTED_EXTENSIONS.some((ext) => f.endsWith(ext)));

  const failures: { file: string; errors: string[] }[] = [];

  for (const filename of files) {
    const filePath = path.join(CONTENT_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content: body } = matter(raw);
    const result = validateFrontmatter(data, filePath, body);
    if (!result.valid) {
      failures.push({ file: filePath, errors: result.errors });
    }
  }

  if (failures.length === 0) return;

  const lines: string[] = [
    "",
    "╔══════════════════════════════════════════════════════════════╗",
    "║          iHemp Content Validation — BUILD FAILED            ║",
    "╚══════════════════════════════════════════════════════════════╝",
    "",
    `  ${failures.length} post(s) failed validation:`,
    "",
  ];

  for (const { file, errors } of failures) {
    const rel = path.relative(process.cwd(), file);
    lines.push(`  📄 ${rel}`);
    for (const err of errors) {
      lines.push(`     • ${err}`);
    }
    lines.push("");
  }

  lines.push(
    "  Fix the errors above, then re-run the build.",
    "  Run `npm run validate` locally to check without building.",
    ""
  );

  const message = lines.join("\n");

  if (IS_PRODUCTION) {
    // Hard fail — block the Vercel production deploy
    throw new Error(message);
  } else {
    // Soft fail — log prominently, skip invalid posts, continue build
    console.warn(message);
  }
}

// Run immediately at config load time (executes during `next build`)
runBuildTimeValidation();

// ─── Next.js config ───────────────────────────────────────────────────────────

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_STATE: process.env.NEXT_PUBLIC_STATE || "colorado",
  },
  images: {
    // Allow Vercel Blob-hosted images (media assets from iHemp Ops dashboard)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
