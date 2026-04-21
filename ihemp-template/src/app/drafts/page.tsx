/**
 * /drafts — Content Review Index
 * Phase 1.5.2
 *
 * Shows all non-published posts (draft + review) for internal review.
 * PRODUCTION: returns 404 — this page does not exist publicly.
 * PREVIEW/DEV: renders full list grouped by status (review first, then draft).
 *
 * Assumptions (flagged for CEO confirmation):
 * - No auth wall in Phase 1.5.2 — env-gating is the only protection
 * - Not state-filtered — shows all posts across all states
 * - Groups: "In Review" before "Draft"
 * - Published posts are excluded (they belong on /blog)
 */

import { getAllPosts, getEnvironment } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Review — iHemp",
  robots: { index: false, follow: false },
};

export default function DraftsPage() {
  // Hard 404 in production — this page must never be publicly accessible
  if (getEnvironment() === "production") notFound();

  const allPosts = getAllPosts({ includeUnpublished: true });
  const unpublished = allPosts.filter((p) => p.status !== "published");

  const inReview = unpublished.filter((p) => p.status === "review");
  const drafts = unpublished.filter((p) => p.status === "draft");

  const statusPillClass = (status: string) =>
    status === "review"
      ? "bg-orange-100 text-orange-800 border border-orange-300"
      : "bg-amber-100 text-amber-800 border border-amber-300";

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl" aria-hidden="true">🔍</span>
          <h1 className="text-3xl font-bold text-hemp-green">Content Review</h1>
        </div>
        <p className="text-gray-500 text-sm">
          Internal view — not publicly accessible. Showing {unpublished.length} unpublished post{unpublished.length !== 1 ? "s" : ""}.
        </p>
      </div>

      {unpublished.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-400 text-xl">No drafts or posts in review.</p>
          <p className="text-gray-400 text-sm mt-2">All content is published or the drafts folder is empty.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* In Review section */}
          {inReview.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-orange-800 mb-4 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-orange-400" aria-hidden="true" />
                In Review ({inReview.length})
              </h2>
              <PostList posts={inReview} statusPillClass={statusPillClass} />
            </section>
          )}

          {/* Draft section */}
          {drafts.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400" aria-hidden="true" />
                Drafts ({drafts.length})
              </h2>
              <PostList posts={drafts} statusPillClass={statusPillClass} />
            </section>
          )}
        </div>
      )}
    </main>
  );
}

// ─── Sub-component ─────────────────────────────────────────────────────────────

type PostListProps = {
  posts: ReturnType<typeof getAllPosts>;
  statusPillClass: (status: string) => string;
};

function PostList({ posts, statusPillClass }: PostListProps) {
  return (
    <div className="grid gap-4">
      {posts.map((post) => (
        <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
          <article className="bg-white border border-gray-200 rounded-xl p-6 transition-all duration-200 group-hover:shadow-md group-hover:border-hemp-green/30">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-lg font-semibold text-hemp-green group-hover:text-hemp-green/80 transition-colors leading-snug">
                {post.title}
              </h3>
              <span
                className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${statusPillClass(post.status)}`}
              >
                {post.status}
              </span>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>

            <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
              {post.date && (
                <time>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              )}
              {post.reviewer && (
                <span>Reviewer: <span className="text-gray-500 font-medium">{post.reviewer}</span></span>
              )}
              {post.states.length > 0 && (
                <span>
                  States:{" "}
                  <span className="text-gray-500 font-medium">
                    {post.states.join(", ")}
                  </span>
                </span>
              )}
              {post.tags.length > 0 && (
                <span className="flex gap-1 flex-wrap">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="bg-hemp-green/10 text-hemp-green font-semibold px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              )}
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
