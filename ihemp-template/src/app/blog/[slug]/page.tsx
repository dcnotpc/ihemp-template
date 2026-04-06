import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <Link href="/blog" className="text-hemp-green hover:underline mb-8 inline-flex items-center gap-1 font-medium">
        ← Back to Blog
      </Link>
      <article className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 shadow-sm mt-4">
        <header className="mb-8 border-b border-gray-100 pb-8">
          <h1 className="text-4xl font-bold text-hemp-green mb-4">{post.title}</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <time className="text-gray-400 text-sm font-medium">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            {post.tags.length > 0 && (
              <>
                <span className="text-gray-300">•</span>
                {post.tags.map((tag: string) => (
                  <span key={tag} className="bg-hemp-green/10 text-hemp-green text-xs font-semibold px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </>
            )}
          </div>
        </header>
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  );
}
