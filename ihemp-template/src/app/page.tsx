import Link from 'next/link'
import Image from 'next/image'
import HeroTitle from '@/components/HeroTitle'
import Countdown from '@/components/Countdown'
import HempBanExplainer from '@/components/HempBanExplainer'
import { stateConfig } from '@/config/state'
import { getAllPosts } from '@/lib/blog'

export default function Home() {
  // Latest 3 published posts for this state, sorted date desc (getAllPosts already sorts)
  const recentPosts = getAllPosts({ stateSlug: stateConfig.slug, includeUnpublished: false }).slice(0, 3);
  return (
    <div>
      <section className="relative w-full h-[40vh] sm:h-[45vh] md:h-[50vh] flex items-center justify-center">
        <img src="/images/hemp-field.webp" alt="Hemp fiber field" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center px-4">
          <HeroTitle />
        </div>
      </section>
      <section className="bg-gradient-to-r from-green-800 via-green-700 to-green-800 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
         <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-100 italic">&ldquo;Growing the Future from<br />Seeds of the Past&rdquo;</h2>
          <div className="mt-4 w-24 h-1 bg-amber-200 mx-auto rounded-full" />
        </div>
      </section>
      <section className="bg-stone-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6">The Industrial Hemp Revolution</h3>
          <p className="text-lg text-stone-700 leading-relaxed mb-6">For thousands of years, hemp has been one of humanity's most versatile crops used for fiber, food, fuel, and building materials. Today, a new generation is bringing hemp back.</p>
          <p className="text-lg text-stone-700 leading-relaxed mb-8">Whether you're a grower, a business owner, or someone who believes in a sustainable future, your support for industrial hemp helps build stronger communities.</p>
          <Link href="/laws" className="inline-block bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-full transition text-lg">Explore State Laws</Link>
        </div>
      </section>
      <HempBanExplainer />
      <Countdown />
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-green-800 text-center mb-10">From the Blog</h3>

          {recentPosts.length === 0 ? (
            // Zero-state: no published posts yet — preserve grid shape with a single placeholder
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-stone-50 rounded-lg overflow-hidden shadow col-span-full text-center py-12">
                <p className="text-stone-500 text-sm">No posts published yet. Check back soon!</p>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-stone-50 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow block"
                >
                  {/* Featured image or mint placeholder */}
                  <div className="relative h-48 overflow-hidden">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="h-full bg-green-200 flex items-center justify-center">
                        <span className="text-green-700 text-sm">Featured Image</span>
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-5">
                    <p className="text-sm text-green-600 mb-1">
                      {post.date
                        ? new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric',
                            timeZone: 'UTC', // treat date string as UTC to avoid timezone shift
                          })
                        : ''}
                    </p>
                    <h4 className="text-lg font-bold text-stone-800 group-hover:text-green-800 transition-colors line-clamp-3">
                      {post.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/blog" className="inline-block border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white font-bold py-3 px-8 rounded-full transition text-lg">View All Posts</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
