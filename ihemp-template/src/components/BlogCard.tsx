import Link from "next/link";
import Image from "next/image";
import type { PostMeta } from "@/lib/blog";

interface BlogCardProps {
  post: PostMeta;
}

/**
 * BlogCard — individual post card for /blog listing.
 *
 * Layout:
 *   - 16:9 featured image (or mint placeholder)
 *   - Tags
 *   - Title
 *   - Date
 *   - Excerpt (frontmatter or body-derived via contentExcerpt)
 *   - "Read more →" link
 *
 * Design matches the site's hemp-green / stone palette.
 * Cards have equal visual weight regardless of missing fields.
 */
export default function BlogCard({ post }: BlogCardProps) {
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      })
    : null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Featured image — 16:9 aspect ratio */}
      <div className="relative w-full aspect-video overflow-hidden bg-green-100">
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Subtle hemp leaf silhouette placeholder */}
            <span className="text-green-400 text-sm font-medium select-none">
              Featured Image
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-6">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold bg-hemp-green/10 text-hemp-green px-2.5 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900 group-hover:text-hemp-green transition-colors leading-snug mb-2 line-clamp-2">
          {post.title}
        </h2>

        {/* Date */}
        {formattedDate && (
          <time
            dateTime={post.date}
            className="text-sm text-gray-400 font-medium mb-3 block"
          >
            {formattedDate}
          </time>
        )}

        {/* Excerpt */}
        {post.contentExcerpt && (
          <p className="text-sm text-gray-600 leading-relaxed flex-1 line-clamp-3 mb-4">
            {post.contentExcerpt}
          </p>
        )}

        {/* Read more */}
        <span className="inline-flex items-center gap-1 text-hemp-green font-semibold text-sm mt-auto group-hover:gap-2 transition-all">
          Read more
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
