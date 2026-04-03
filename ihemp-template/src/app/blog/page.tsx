import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { stateConfig } from "@/config/state";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">
        {stateConfig.pages.blog.title}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-gray-700">
        {stateConfig.pages.blog.description}
      </p>
      <div className="mt-10 space-y-8">
        {posts.length === 0 && (
          <p className="text-gray-500">No posts published yet. Check back soon.</p>
        )}
        {posts.map((post) => (
          <article key={post.slug} className="rounded-lg border p-6 hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-500">{post.date}</p>
            <h2 className="mt-1 text-2xl font-semibold">
              <Link href={`/blog/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-gray-700">{post.description}</p>
            <Link href={`/blog/${post.slug}`} className="mt-4 inline-block text-sm font-medium underline">
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
