import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { stateConfig } from "@/config/state";

export default function Blog() {
  const posts = getAllPosts();

  return (
     <main className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-hemp-green mb-3">
          {stateConfig.name} Hemp News & Updates
        </h1>
        <p className="text-gray-600 text-lg">
          Latest news, compliance updates, and industry insights for {stateConfig.name} hemp businesses.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-400 text-xl">No posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <article className="bg-white border border-gray-200 rounded-2xl p-8 transition-all duration-300 group-hover:shadow-lg group-hover:border-hemp-green/30 group-hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3">
                 <time className="text-sm text-gray-400 font-medium">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                  {post.tags.length > 0 && (
                    <>
                      <span className="text-gray-300">•</span>
                      <div className="flex gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-hemp-green/10 text-hemp-green font-semibold px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-hemp-green group-hover:text-hemp-green/80 transition-colors mb-3">
                  {post.title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">{post.excerpt}</p>
                <span className="inline-flex items-center text-hemp-green font-semibold text-sm group-hover:gap-2 gap-1 transition-all">
                  Read more →
                </span>
              </article>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
