import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/blog" className="text-sm text-gray-500 hover:underline">
        ← Back to Blog
      </Link>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">{post.title}</h1>
      <p className="mt-2 text-sm text-gray-500">{post.date}</p>
      <article className="prose prose-gray mt-10 max-w-none">
        <MDXRemote source={post.content} />
      </article>
    </main>
  );
}
