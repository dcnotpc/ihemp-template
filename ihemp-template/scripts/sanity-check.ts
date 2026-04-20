/**
 * Sanity check: FakeComponent + script tag must produce exactly 2 body errors
 * Run: npx tsx scripts/sanity-check.ts
 */
import { validateBody } from "../src/lib/content-validator";

const testBody = `
## Test Section

<FakeComponent prop="value" />

Some text here.

<script>alert(1)</script>

More text.
`;

const errors = validateBody(testBody, "test-sanity-check.mdx");
console.log("Body errors found:", errors.length);
errors.forEach((e) => console.log(" -", e));

if (errors.length === 2) {
  console.log("\n✅ SANITY CHECK PASSED — exactly 2 errors produced");
} else {
  console.error("\n❌ SANITY CHECK FAILED — expected 2 errors, got", errors.length);
  process.exit(1);
}
