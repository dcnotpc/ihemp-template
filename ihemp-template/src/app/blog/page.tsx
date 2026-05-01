import { getAllPosts } from "@/lib/blog";
import { stateConfig } from "@/config/state";
import BlogCard from "@/components/BlogCard";

export default function Blog() {
  // Always filter to published-only on the blog index, regardless of environment.
  // Draft/review posts are accessible at their canonical URL (/blog/[slug]) in
  // preview with a DraftBanner, but must never appear in the public listing —
  // the listing has no visual status indicator and would mislead reviewers.
  const posts = getAllPosts({ stateSlug: stateConfig.slug, includeUnpublished: false });

  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      {/* Page header */}
      <div className="mb-12 max-w-2xl">
        <h1 className="text-4xl font-bold text-hemp-green mb-3">
          {stateConfig.name} Hemp News &amp; Updates
        </h1>
        <p className="text-gray-600 text-lg">
          Latest news, compliance updates, and industry insights for{" "}
          {stateConfig.name} hemp businesses.
        </p>
      </div>

      {/* Post grid */}
      {posts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-400 text-xl">No posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
