import Link from 'next/link'
import HeroTitle from '@/components/HeroTitle'
import Countdown from '@/components/Countdown'
export default function Home() {
  return (
    <div>
      <section className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] flex items-center justify-center">
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
          <p className="text-lg text-stone-700 leading-relaxed mb-6">For thousands of years, hemp has been one of humanitys most versatile crops used for fiber, food, fuel, and building materials. Today, a new generation is bringing hemp back.</p>
          <p className="text-lg text-stone-700 leading-relaxed mb-8">Whether youre a grower, a business owner, or someone who believes in a sustainable future, your support for industrial hemp helps build stronger communities.</p>
          <Link href="/laws" className="inline-block bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-full transition text-lg">Explore State Laws</Link>
        </div>
      </section>
               <Countdown />
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-green-800 text-center mb-10">From the Blog</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-stone-50 rounded-lg overflow-hidden shadow">
              <div className="h-48 bg-green-200 flex items-center justify-center"><span className="text-green-700 text-sm">Featured Image</span></div>
              <div className="p-5">
                <p className="text-sm text-green-600 mb-1">April 2, 2026</p>
                <h4 className="text-lg font-bold text-stone-800">Understanding the 2025 Hemp Farm Bill Updates</h4>
              </div>
            </div>
            <div className="bg-stone-50 rounded-lg overflow-hidden shadow">
              <div className="h-48 bg-green-200 flex items-center justify-center"><span className="text-green-700 text-sm">Featured Image</span></div>
              <div className="p-5">
                <p className="text-sm text-green-600 mb-1">March 28, 2026</p>
                <h4 className="text-lg font-bold text-stone-800">Hemp Fiber vs. Cotton: The Sustainability Case</h4>
              </div>
            </div>
            <div className="bg-stone-50 rounded-lg overflow-hidden shadow">
              <div className="h-48 bg-green-200 flex items-center justify-center"><span className="text-green-700 text-sm">Featured Image</span></div>
              <div className="p-5">
                <p className="text-sm text-green-600 mb-1">March 20, 2026</p>
                <h4 className="text-lg font-bold text-stone-800">Colorados Hemp Program: A Model for the Nation</h4>
              </div>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link href="/blog" className="inline-block border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white font-bold py-3 px-8 rounded-full transition text-lg">View All Posts</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
