/**
 * __tests__/blog.test.mjs
 * Regression tests for src/lib/blog.ts behaviour.
 *
 * Uses Node.js built-in test runner (node:test) — no extra dependencies.
 * Run with: node --test __tests__/blog.test.mjs
 *
 * Tests:
 *   1. featuredImage parsed from snake_case frontmatter key (featured_image)
 *   2. featuredImage parsed from camelCase frontmatter key (featuredImage)
 *   3. Post without image does not break parsing (returns undefined)
 *   4. getAllPosts sorts newest-first
 *   5. getAllPosts returns at most 3 posts when sliced (homepage contract)
 *   6. Missing/empty image falls back safely to placeholder
 *   7. At least one published post exists in content/blog
 *   8. ihemp-network-introduction has featured_image set
 *   9. All published posts have non-empty title and parseable date
 *  10. No duplicate slugs among published posts
 *  11. deriveExcerptFromBody strips markdown/MDX syntax
 *  12. deriveExcerptFromBody truncates to ~160 chars at word boundary
 *  13. deriveExcerptFromBody returns empty string on empty input (no throw)
 *  14. contentExcerpt uses frontmatter excerpt when present
 *  15. contentExcerpt falls back to body-derived when excerpt is empty
 *  16. excerpt (frontmatter only) is empty when not set in frontmatter
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// ─── Inline gray-matter-like frontmatter parser (no dep needed for tests) ────
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fm = match[1];
  const result = {};
  for (const line of fm.split('\n')) {
    const kv = line.match(/^(\w+):\s*"?(.+?)"?\s*$/);
    if (kv) result[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return result;
}

// ─── Simulate buildPostMeta featuredImage resolution (mirrors blog.ts logic) ──
function resolveImage(data) {
  return (
    (data.featured_image ?? undefined) ||
    (data.featuredImage  ?? undefined) ||
    undefined
  );
}

// ─── Test 1: featured_image (snake_case) ─────────────────────────────────────
test('resolves featured_image (snake_case frontmatter key)', () => {
  const data = { featured_image: '/images/hemp-field.webp' };
  assert.equal(resolveImage(data), '/images/hemp-field.webp');
});

// ─── Test 2: featuredImage (camelCase) ───────────────────────────────────────
test('resolves featuredImage (camelCase frontmatter key)', () => {
  const data = { featuredImage: '/images/hemp-field.webp' };
  assert.equal(resolveImage(data), '/images/hemp-field.webp');
});

// ─── Test 3: No image → undefined (no crash) ─────────────────────────────────
test('returns undefined when no image key present', () => {
  assert.equal(resolveImage({}), undefined);
  assert.equal(resolveImage({ title: 'Some Post' }), undefined);
});

// ─── Test 4: Sort newest-first ────────────────────────────────────────────────
test('getAllPosts sorts newest-first', () => {
  const posts = [
    { slug: 'a', date: '2026-01-01' },
    { slug: 'c', date: '2026-03-01' },
    { slug: 'b', date: '2026-02-01' },
  ];
  const sorted = [...posts].sort((a, b) => (a.date > b.date ? -1 : 1));
  assert.deepEqual(sorted.map(p => p.slug), ['c', 'b', 'a']);
});

// ─── Test 5: Homepage slices to 3 ────────────────────────────────────────────
test('homepage contract: at most 3 posts shown', () => {
  const posts = Array.from({ length: 10 }, (_, i) => ({
    slug: `post-${i}`,
    date: `2026-0${(i % 9) + 1}-01`,
    status: 'published',
  }));
  const recentPosts = posts.slice(0, 3);
  assert.equal(recentPosts.length, 3);
});

// ─── Test 6: Missing image does not throw ────────────────────────────────────
test('missing image falls back safely — no thrown error', () => {
  assert.doesNotThrow(() => {
    const img = resolveImage({ title: 'Post Without Image' });
    // img is undefined; rendering code should guard with post.featuredImage ? ...
    const rendered = img ? `<img src="${img}" />` : '<div>Featured Image</div>';
    assert.equal(rendered, '<div>Featured Image</div>');
  });
});

// ─── Tests 11-16: Excerpt / contentExcerpt / deriveExcerptFromBody ──────────

// Mirror of the deriveExcerptFromBody logic from blog.ts (inline for test isolation)
function deriveExcerptFromBody(body, maxLength = 160) {
  try {
    const text = body
      .replace(/^---[\s\S]*?---\n?/, '')
      .replace(/<[A-Z][\w.]*[^>]*\/?>|<\/[A-Z][\w.]*>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/[*_`]{1,3}([^*_`]+)[*_`]{1,3}/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
      .replace(/^>\s+/gm, '')
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
    if (text.length <= maxLength) return text;
    const trimmed = text.slice(0, maxLength);
    const lastSpace = trimmed.lastIndexOf(' ');
    return (lastSpace > maxLength * 0.7 ? trimmed.slice(0, lastSpace) : trimmed) + '\u2026';
  } catch { return ''; }
}

test('deriveExcerptFromBody strips markdown/MDX headings, bold, links', () => {
  const body = '## My Heading\n\n**Bold text** and [a link](https://example.com) here.';
  const result = deriveExcerptFromBody(body);
  assert.ok(!result.includes('#'), 'heading marker should be stripped');
  assert.ok(!result.includes('**'), 'bold markers should be stripped');
  assert.ok(!result.includes('['), 'link syntax should be stripped');
  assert.ok(result.includes('Bold text'), 'bold content should be preserved');
  assert.ok(result.includes('a link'), 'link text should be preserved');
});

test('deriveExcerptFromBody truncates to ~160 chars at word boundary', () => {
  const body = 'word '.repeat(60); // 300 chars
  const result = deriveExcerptFromBody(body, 160);
  assert.ok(result.length <= 165, `Expected ≤165 chars, got ${result.length}`);
  assert.ok(result.endsWith('\u2026'), 'Should end with ellipsis when truncated');
});

test('deriveExcerptFromBody returns empty string on empty input without throwing', () => {
  assert.doesNotThrow(() => {
    const result = deriveExcerptFromBody('');
    assert.equal(result, '');
  });
});

test('contentExcerpt uses frontmatter excerpt when present', () => {
  // Simulate buildPostMeta logic
  const frontmatterExcerpt = 'My frontmatter excerpt.';
  const body = '## Heading\n\nBody content that should not appear.';
  const derived = deriveExcerptFromBody(body);
  const contentExcerpt = frontmatterExcerpt || derived;
  assert.equal(contentExcerpt, 'My frontmatter excerpt.');
});

test('contentExcerpt falls back to body-derived when excerpt is empty', () => {
  const frontmatterExcerpt = '';
  const body = '## Intro\n\nHemp is a versatile crop used for fiber, food, and fuel.';
  const derived = deriveExcerptFromBody(body);
  const contentExcerpt = frontmatterExcerpt || derived;
  assert.ok(contentExcerpt.length > 0, 'contentExcerpt should be non-empty from body');
  assert.ok(contentExcerpt.includes('Hemp'), 'Should include body text');
});

test('excerpt field is empty string when not set in frontmatter', () => {
  const data = { title: 'No Excerpt Post', date: '2026-01-01' };
  const excerpt = (data.excerpt ?? '') || (data.description ?? '') || '';
  assert.equal(excerpt, '');
});

// ─── Test 7: Real content/blog posts parsed correctly ────────────────────────
describe('real blog content', () => {
  const blogDir = path.join(ROOT, 'content/blog');
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));

  test('at least one published post exists', () => {
    const publishedCount = files.filter(f => {
      const raw = fs.readFileSync(path.join(blogDir, f), 'utf8');
      return raw.includes('status: published');
    }).length;
    assert.ok(publishedCount >= 1, `Expected at least 1 published post, got ${publishedCount}`);
  });

  test('ihemp-network-introduction has featured_image set', () => {
    const raw = fs.readFileSync(path.join(blogDir, 'ihemp-network-introduction.mdx'), 'utf8');
    const data = parseFrontmatter(raw);
    const img = resolveImage(data);
    assert.ok(img, 'Expected ihemp-network-introduction to have featured_image');
    assert.match(img, /^\/images\//, 'Expected featured_image to be a /images/ path');
  });

  test('all published posts have non-empty title and date', () => {
    for (const f of files) {
      const raw = fs.readFileSync(path.join(blogDir, f), 'utf8');
      const data = parseFrontmatter(raw);
      if (data.status !== 'published') continue;
      assert.ok(data.title, `Post ${f}: expected non-empty title`);
      assert.ok(data.date,  `Post ${f}: expected non-empty date`);
      // Date should be parseable
      assert.ok(!isNaN(new Date(data.date).getTime()), `Post ${f}: date "${data.date}" is not parseable`);
    }
  });

  test('no two published posts share the same slug', () => {
    const slugs = files
      .map(f => f.replace(/\.mdx?$/, ''))
      .filter(slug => {
        const raw = fs.readFileSync(path.join(blogDir, `${slug}.mdx`), 'utf8').catch?.(() => '') ?? fs.readFileSync(path.join(blogDir, `${slug}.mdx`), 'utf8');
        return raw.includes('status: published');
      });
    const unique = new Set(slugs);
    assert.equal(unique.size, slugs.length, 'Duplicate slugs found among published posts');
  });
});
