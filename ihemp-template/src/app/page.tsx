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
  const theme = stateConfig.theme;

  return (
    <div>
      <section className="relative w-full h-[40vh] sm:h-[45vh] md:h-[50vh] flex items-center justify-center">
        <img src={theme.hero.image} alt={theme.hero.alt} className="absolute inset-0 w-full h-full object-cover" />
        <div className={`absolute inset-0 ${theme.hero.overlayClass}`} />
        <div className="relative z-10 text-center px-4">
          <HeroTitle />
        </div>
      </section>
      <section
        className="py-16 px-4"
        style={{
          background: 'linear-gradient(90deg, var(--ihemp-color-primary-dark), var(--color-hemp-green), var(--ihemp-color-primary-dark))',
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          {theme.motif.accentLabel && (
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-hemp-cream/70 mb-4">
              {theme.motif.accentLabel}
            </p>
          )}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-hemp-cream italic">&ldquo;{theme.homepage.quote}&rdquo;</h2>
          <div className="mt-4 w-24 h-1 bg-hemp-gold mx-auto rounded-full" />
        </div>
      </section>
      <section className="bg-stone-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-hemp-green mb-6">The Industrial Hemp Revolution</h3>
          <p className="text-base text-hemp-brown/70 leading-relaxed mb-5">{theme.homepage.positioning}</p>
          <p className="text-lg text-stone-700 leading-relaxed mb-6">For thousands of years, hemp has been one of humanity&apos;s most versatile crops used for fiber, food, fuel, and building materials. Today, a new generation is bringing hemp back.</p>
          <p className="text-lg text-stone-700 leading-relaxed mb-8">Whether you&apos;re a grower, a business owner, or someone who believes in a sustainable future, your support for industrial hemp helps build stronger communities.</p>
          <Link href={stateConfig.hero.primaryCtaHref} className="inline-block bg-hemp-green hover:bg-hemp-leaf text-white font-bold py-3 px-8 rounded-full transition text-lg">{stateConfig.hero.primaryCtaLabel}</Link>
        </div>
      </section>
      <HempBanExplainer />
      <Countdown />
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-hemp-green text-center mb-10">From the Blog</h3>

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
                      <div className="h-full bg-hemp-sage/30 flex items-center justify-center">
                        <span className="text-hemp-green text-sm">Featured Image</span>
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-5">
                    <p className="text-sm text-hemp-leaf mb-1">
                      {post.date
                        ? new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric',
                            timeZone: 'UTC', // treat date string as UTC to avoid timezone shift
                          })
                        : ''}
                    </p>
                    <h4 className="text-lg font-bold text-stone-800 group-hover:text-hemp-green transition-colors line-clamp-3">
                      {post.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/blog" className="inline-block border-2 border-hemp-green text-hemp-green hover:bg-hemp-green hover:text-white font-bold py-3 px-8 rounded-full transition text-lg">View All Posts</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
