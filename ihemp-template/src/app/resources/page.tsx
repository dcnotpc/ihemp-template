import { stateConfig } from '@/config/state'
import { getStateBySlug } from '@/data/states'
import Link from 'next/link'

export const metadata = {
  title: `${stateConfig.pages.resources.title} | ${stateConfig.siteName}`,
  description: stateConfig.pages.resources.description,
}

export default function Resources() {
  const stateData = getStateBySlug(stateConfig.slug)

  if (!stateData) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-3">State Data Not Found</h2>
          <p className="text-red-600">Unable to load state data for &quot;{stateConfig.slug}&quot;. Please check your configuration.</p>
        </div>
      </div>
    )
  }

  const salveIngredients = [
    { title: 'Our Earths Secrets Shea Butter', description: 'Raw, unrefined African shea butter. A primary base ingredient that gives CBD salve its smooth, moisturizing consistency.', url: 'https://amzn.to/4snzP6D', image: 'https://m.media-amazon.com/images/I/71WO4IN0qBL._SL1500_.jpg' },
    { title: 'Natural Farms Shea Butter', description: 'Another excellent shea butter option with great texture that blends well into CBD salve recipes.', url: 'https://amzn.to/4vpasnN', image: 'https://m.media-amazon.com/images/I/51B1r3EjOlL._SL1080_.jpg' },
    { title: 'Unrefined Coconut Oil', description: 'Organic virgin coconut oil. An essential carrier oil for CBD salve that aids absorption and adds soothing properties.', url: 'https://amzn.to/3PShRvz', image: 'https://m.media-amazon.com/images/I/718fXnLCTdL._SL1500_.jpg' },
    { title: 'Menthol Crystals', description: 'Pure menthol crystals that add powerful cooling relief to CBD salve. A little goes a long way.', url: 'https://amzn.to/4sYi3rA', image: 'https://m.media-amazon.com/images/I/81P+F5H6dlL._AC_SL1500_.jpg' },
    { title: 'Cayenne Pepper Oil', description: 'Natural warming extract for CBD salve. Adds heat therapy benefits for muscle and joint relief.', url: 'https://amzn.to/4mifGxb', image: 'https://m.media-amazon.com/images/I/81wPg-5NDML._AC_SL1500_.jpg' },
    { title: 'Peppermint Essential Oil', description: 'Essential oil that adds a refreshing cooling sensation and pleasant scent to CBD salve blends.', url: 'https://amzn.to/4tFc9f7', image: 'https://m.media-amazon.com/images/I/61aKJDSAUGL._AC_SL1500_.jpg' },
  ]

  const salveContainers = [
    { title: 'CBD Salve Stick Containers', description: 'Push-up stick containers perfect for on-the-go CBD salve application.', url: 'https://amzn.to/4t96X39', image: 'https://m.media-amazon.com/images/I/51ojFaCbVJS._AC_SL1400_.jpg' },
    { title: 'Red Top Sample Containers', description: 'Small sample-size containers with red tops. Great for sharing samples.', url: 'https://amzn.to/4spL922', image: 'https://m.media-amazon.com/images/I/617FOHzsGOL._SL1152_.jpg' },
    { title: 'Blue Top Sample Containers', description: 'Sample containers with blue tops. Perfect for giveaway samples.', url: 'https://amzn.to/4cvOw2C', image: 'https://m.media-amazon.com/images/I/81AJOa5RaEL._AC_SL1500_.jpg' },
    { title: 'Black 2oz CBD Salve Tins', description: 'Sleek black metal tins for storing 2oz portions of finished CBD salve.', url: 'https://amzn.to/4dBiX8Q', image: 'https://m.media-amazon.com/images/I/81ODyslgjGL._AC_SL1500_.jpg' },
  ]

  const ihempMerch = [
    { title: 'iHemp International Tee', description: 'Rep the hemp movement. Premium organic cotton.', url: 'https://ihempinternational.com' },
    { title: 'Hemp Advocate Cap', description: 'Show your support for industrial hemp.', url: 'https://ihempinternational.com' },
  ]

  const ihempHarvestProducts = [
    { title: 'Premium Hemp Flower', description: 'Farm-fresh, lab-tested hemp flower grown with care.', url: 'https://ihempharvest.com' },
    { title: 'Hemp Seed Oil', description: 'Cold-pressed, nutrient-rich hemp seed oil.', url: 'https://ihempharvest.com' },
    { title: 'Bulk Hemp Biomass', description: 'Wholesale hemp biomass for processors and manufacturers.', url: 'https://ihempharvest.com' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-hemp-green mb-2" style={{ fontFamily: 'var(--font-fredoka)' }}>{stateData.name} Hemp Resources</h1>
        <p className="text-sm text-hemp-brown/70">Tools, products, and links to support your hemp journey.</p>
      </div>
      <div className="bg-hemp-gold/10 border border-hemp-gold/30 rounded-lg p-4 mb-10 text-sm text-hemp-brown/70">
        <strong className="text-hemp-brown">Disclosure:</strong> Some links on this page are affiliate links. We may earn a small commission at no extra cost to you.
      </div>
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-hemp-green mb-2" style={{ fontFamily: 'var(--font-fredoka)' }}>From Our Farm</h2>
        <p className="text-hemp-brown/70 mb-5">Premium hemp products grown and crafted with care.</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {ihempHarvestProducts.map((product, i) => (
            <a key={i} href={product.url} target="_blank" rel="noopener noreferrer" className="bg-hemp-leaf/10 border-2 border-hemp-leaf/30 rounded-lg p-5 hover:border-hemp-leaf hover:shadow-md transition group">
              <div className="w-full h-32 bg-hemp-cream rounded mb-3 flex items-center justify-center text-hemp-brown/30 text-sm">Image</div>
              <p className="font-bold text-hemp-green group-hover:text-hemp-leaf transition">{product.title}</p>
              <p className="text-sm text-hemp-brown/70 mt-1">{product.description}</p>
              <p className="text-sm font-medium text-hemp-leaf mt-3">Shop Now</p>
            </a>
          ))}
        </div>
      </section>
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-hemp-green mb-2" style={{ fontFamily: 'var(--font-fredoka)' }}>Hemp Merch</h2>
        <p className="text-hemp-brown/70 mb-5">Wear the movement. Support industrial hemp.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {ihempMerch.map((item, i) => (
            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="bg-hemp-cream border border-hemp-gold/30 rounded-lg p-5 hover:border-hemp-gold hover:shadow-md transition group">
              <div className="w-full h-32 bg-white rounded mb-3 flex items-center justify-center text-hemp-brown/30 text-sm">Image</div>
              <p className="font-bold text-hemp-brown group-hover:text-hemp-green transition">{item.title}</p>
              <p className="text-sm text-hemp-brown/70 mt-1">{item.description}</p>
              <p className="text-sm font-medium text-hemp-green mt-3">Shop Now</p>
            </a>
          ))}
        </div>
      </section>
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-hemp-green mb-2" style={{ fontFamily: 'var(--font-fredoka)' }}>CBD Salve Ingredients</h2>
        <p className="text-hemp-brown/70 mb-5">The exact ingredients I use to craft my CBD balm. Tested and trusted through countless batches.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {salveIngredients.map((product, i) => (
            <a key={i} href={product.url} target="_blank" rel="noopener noreferrer" className="bg-white border border-hemp-gold/20 rounded-lg p-4 hover:border-hemp-leaf hover:shadow-sm transition group">
              <img src={product.image} alt={product.title} className="w-full h-40 object-contain rounded mb-3" />
              <p className="font-semibold text-hemp-brown group-hover:text-hemp-green transition text-sm">{product.title}</p>
              <p className="text-xs text-hemp-brown/60 mt-1">{product.description}</p>
              <p className="text-xs font-medium text-hemp-leaf mt-2">Shop on Amazon</p>
            </a>
          ))}
        </div>
      </section>
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-hemp-green mb-2" style={{ fontFamily: 'var(--font-fredoka)' }}>CBD Salve Containers</h2>
        <p className="text-hemp-brown/70 mb-5">From sample sizes to full 2oz tins and portable sticks.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {salveContainers.map((product, i) => (
            <a key={i} href={product.url} target="_blank" rel="noopener noreferrer" className="bg-white border border-hemp-gold/20 rounded-lg p-4 hover:border-hemp-leaf hover:shadow-sm transition group">
              <img src={product.image} alt={product.title} className="w-full h-40 object-contain rounded mb-3" />
              <p className="font-semibold text-hemp-brown group-hover:text-hemp-green transition text-sm">{product.title}</p>
              <p className="text-xs text-hemp-brown/60 mt-1">{product.description}</p>
              <p className="text-xs font-medium text-hemp-leaf mt-2">Shop on Amazon</p>
            </a>
          ))}
        </div>
      </section>
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-hemp-green mb-2" style={{ fontFamily: 'var(--font-fredoka)' }}>Official and Educational Links</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {(stateData.resources ?? []).filter((r: any) => r.url).map((resource: any, i: number) => (
            <a key={i} href={resource.url} target="_blank" rel="noopener noreferrer" className="bg-hemp-cream border border-hemp-gold/30 rounded-lg p-4 hover:border-hemp-leaf hover:shadow-sm transition group">
              <p className="font-semibold text-hemp-green group-hover:text-hemp-leaf transition">{resource.label}</p>
              <p className="text-sm text-hemp-brown/60 mt-1">Visit</p>
            </a>
          ))}
        </div>
      </section>
      <div className="text-center pt-4">
        <Link href="/" className="text-hemp-green hover:text-hemp-leaf font-medium">Back to Home</Link>
      </div>
    </div>
  )
}
