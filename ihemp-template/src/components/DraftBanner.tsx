/**
 * DraftBanner — Phase 1.5.2
 *
 * Rendered at the top of non-published posts in preview/dev environments.
 * Never shown in production (post page returns 404 for non-published slugs).
 *
 * Props:
 *   status: "draft" | "review"
 */

import type { PostStatus } from "@/lib/blog";

type DraftBannerProps = {
  status: Exclude<PostStatus, "published">;
};

export default function DraftBanner({ status }: DraftBannerProps) {
  const isDraft = status === "draft";

  return (
    <div
      className={[
        "sticky top-0 z-50 w-full px-4 py-3",
        "flex items-center justify-center gap-3",
        "font-semibold text-sm tracking-wide uppercase",
        "border-b-2",
        isDraft
          ? "bg-amber-50 text-amber-800 border-amber-400"
          : "bg-orange-50 text-orange-800 border-orange-400",
      ].join(" ")}
      role="alert"
      aria-label={isDraft ? "Draft post — not for public distribution" : "Post under review — not for public distribution"}
    >
      {/* Icon */}
      <span className="text-base" aria-hidden="true">
        {isDraft ? "🚧" : "🔍"}
      </span>

      {/* Message */}
      <span>
        {isDraft
          ? "DRAFT — not for public distribution"
          : "IN REVIEW — not for public distribution"}
      </span>

      {/* Status pill */}
      <span
        className={[
          "ml-2 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider",
          isDraft
            ? "bg-amber-200 text-amber-900"
            : "bg-orange-200 text-orange-900",
        ].join(" ")}
      >
        {status}
      </span>
    </div>
  );
}
