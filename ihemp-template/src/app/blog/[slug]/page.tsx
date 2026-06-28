import { getPostBySlug, getAllPosts, getEnvironment } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/lib/mdx-components";
import type { Metadata } from "next";
import DraftBanner from "@/components/DraftBanner";
import { stateConfig } from "@/config/state";

// ─── Static params ─────────────────────────────────────────────────────────────
// In production: only published posts that are visible on THIS state site
// get pre-rendered. Posts targeting other states are excluded, so their
// routes are never built into this site's static output.
// In preview/dev: all posts visible on this state are pre-rendered.

export function generateStaticParams() {
  const posts = getAllPosts({
    stateSlug: stateConfig.slug,
    includeUnpublished: true,
  });
  return posts.map((post) => ({ slug: post.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const env = getEnvironment();
  // Pass stateSlug so metadata for wrong-state articles is suppressed entirely.
  // A Michigan-only article requested on Alabama returns empty metadata (no
  // title/description leak in <head>) and the page component returns notFound().
  const post = getPostBySlug(slug, {
    includeUnpublished: env !== "production",
    stateSlug: stateConfig.slug,
  });

  if (!post) return {};

  const isUnpublished = post.status !== "published";

  return {
    title: post.title,
    description: post.excerpt,
    // Non-published posts in preview/dev get noindex so search engines never
    // index a draft that accidentally gets a shareable preview URL.
    ...(isUnpublished
      ? { robots: { index: false, follow: false } }
      : {}),
  };
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const env = getEnvironment();
  // State gate: pass stateSlug so articles targeting other states return null.
  // getPostBySlug returns null when the post's states field does not include
  // this site's state slug, triggering notFound() below.
  const post = getPostBySlug(slug, {
    includeUnpublished: env !== "production",
    stateSlug: stateConfig.slug,
  });

  // Production: non-published → 404. Wrong-state article → 404. Preview/dev: show with banner.
  if (!post) notFound();

  const isUnpublished = post.status !== "published";

  // Format reviewedAt for display — same locale format as post.date
  const reviewedAtFormatted = post.reviewedAt
    ? new Date(post.reviewedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      {/* Draft/review banner — only rendered when post is not published */}
      {isUnpublished && post.status !== "published" && (
        <DraftBanner status={post.status} />
      )}

      <main className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/blog" className="text-hemp-green hover:underline mb-8 inline-flex items-center gap-1 font-medium">
          ← Back to Blog
        </Link>

        <article className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 shadow-sm mt-4">
          {/* Featured image */}
          {post.featuredImage && (
            <div className="mb-8 -mx-8 md:-mx-12 -mt-8 rounded-t-2xl overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                width={900}
                height={500}
                className="w-full object-cover"
                priority
                unoptimized
              />
            </div>
          )}

          <header className="mb-8 border-b border-gray-100 pb-8">
            <h1 className="text-4xl font-bold text-hemp-green mb-4">{post.title}</h1>

            <div className="flex items-center gap-3 flex-wrap">
              <time className="text-gray-400 text-sm font-medium">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>

              {post.tags.length > 0 && (
                <>
                  <span className="text-gray-300">•</span>
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-hemp-green/10 text-hemp-green text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </>
              )}
            </div>
          </header>

          {/* Post body */}
          <div className="blog-content">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>

          {/* Reviewer attribution — shown on published posts only */}
          {post.status === "published" && post.reviewer && reviewedAtFormatted && (
            <footer className="mt-10 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Reviewed by{" "}
                <span className="font-medium text-gray-500">{post.reviewer}</span>
                {" "}on{" "}
                <time dateTime={post.reviewedAt}>{reviewedAtFormatted}</time>
              </p>
            </footer>
          )}
        </article>
      </main>
    </>
  );
}
