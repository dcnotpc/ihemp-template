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
  
  const amazonProducts = [
    { title: 'CBD Salve Stick Containers', description: 'High-quality stick containers for CBD salve application.', url: 'https://amzn.to/4t96X39' },
    { title: 'CBD Salve Sample Containers', description: 'Small sample containers for testing and travel-sized products.', url: 'https://amzn.to/4spL922' },
    { title: 'Shea Butter for CBD Salve', description: 'Premium-grade shea butter base for CBD salve formulations.', url: 'https://amzn.to/4snzP6D' },
    { title: 'Unrefined Coconut Oil', description: 'High-quality coconut oil for CBD base ingredients.', url: 'https://amzn.to/3PShRvz' },
    { title: 'CBD Salve Tins', description: 'Professional tins for storing and selling finished CBD products.', url: 'https://amzn.to/4dBiX8Q' },
    { title: 'Menthol Crystals', description: 'Pure menthol for adding cooling sensation to topical CBD.', url: 'https://amzn.to/4sYi3rA' },
    { title: 'Cayenne Pepper Extract', description: 'Natural warming extract for topical CBD formulations.', url: 'https://amzn.to/4mifGxb' },
    { title: 'Peppermint Essential Oil', description: 'Organic peppermint oil for scent and cooling effect.', url: 'https://amzn.to/4tFc9f7' },
    { title: 'CBD Sample Products', description: 'Small CBD quantities for recipe development and testing.', url: 'https://amzn.to/4cvOw2C' },
    { title: 'Foil for Chocolate CBD Balls', description: 'Wrapping foil for homemade CBD edibles and treats.', url: 'https://amzn.to/48meLWR' },
    { title: 'CBD Recipe Essentials', description: 'Additional supplies for advanced CBD product creation.', url: 'https://amzn.to/4vpasnN' },
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

  const hempGrowingEquipment = [
    { title: 'Organic Potting Soil', description: 'Nutrient-rich soil optimized for hemp cultivation.', url: 'https://amzn.to/4ea3J5N' },
    { title: 'Fabric Grow Bags', description: 'Breathable fabric pots for healthy root development.', url: 'https://amzn.to/4a2YG0X' },
    { title: 'Grow Lights (LED)', description: 'Full-spectrum LED lights for indoor hemp growing.', url: 'https://amzn.to/4d8t6xt' },
    { title: 'Soil pH Tester', description: 'Digital meter to monitor soil acidity for optimal growth.', url: 'https://amzn.to/4a2Z2a7' },
    { title: 'Garden Irrigation Kit', description: 'Drip irrigation system for efficient watering.', url: 'https://amzn.to/4a2Ze0b' },
  ]

  const testingAndMeasurementKits = [
    { title: 'THC Test Strips', description: 'Quick-test strips for verifying THC content (<0.3%).', url: 'https://amzn.to/4d8u3Ll' },
    { title: 'Digital Moisture Meter', description: 'Accurate soil moisture reader for hemp plants.', url: 'https://amzn.to/4d8ub8m' },
    { title: 'TDS/PPM Water Tester', description: 'Measures water quality and nutrient concentration.', url: 'https://amzn.to/4a2Zg0R' },
    { title: 'Magnifying Loupe (60x)', description: 'Jewelers loupe for inspecting trichomes and pests.', url: 'https://amzn.to/4d8uf8Q' },
    { title: 'Digital Scale (0.01g)', description: 'Precision scale for weighing harvest and products.', url: 'https://amzn.to/4a2Zk0S' },
    { title: 'Temperature/Humidity Gauge', description: 'Monitor grow environment conditions.', url: 'https://amzn.to/4d8uj8U' },
  ]
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-hemp-green mb-2" style={{ fontFamily: 'var(--font-fredoka)' }}>{stateData.name} Hemp Resources</h1>
        <p className="text-sm text-hemp-brown/70">Tools, products, and links to support your hemp journey.</p>
      </div>
      <div className="bg-hemp-gold/10 border border-hemp-gold/30 rounded-lg p-4 mb-10 text-sm text-hemp-brown/70">
        <strong className="text-hemp-brown">Disclosure:</strong> Some links on this page are affiliate links. We may earn a small commission at no extra cost to you. This helps support our mission to provide free hemp information.
      </div>
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-hemp-green mb-2" style={{ fontFamily: 'var(--font-fredoka)' }}>From Our Farm — iHemp Harvest</h2>
        <p className="text-hemp-brown/70 mb-5">Premium hemp products grown and crafted with care.</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {ihempHarvestProducts.map((product, i) => (
            <a key={i} href={product.url} target="_blank" rel="noopener noreferrer" className="bg-hemp-leaf/10 border-2 border-hemp-leaf/30 rounded-lg p-5 hover:border-hemp-leaf hover:shadow-md transition group">
              <div className="w-full h-32 bg-hemp-cream rounded mb-3 flex items-center justify-center text-hemp-brown/30 text-sm">Image</div>
              <p className="font-bold text-hemp-green group-hover:text-hemp-leaf transition">{product.title}</p>
              <p className="text-sm text-hemp-brown/70 mt-1">{product.description}</p>
              <p className="text-sm font-medium text-hemp-leaf mt-3">Shop Now →</p>
            </a>
          ))}
        </div>
      </section>
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-hemp-green mb-2" style={{ fontFamily: 'var(--font-fredoka)' }}>Hemp Merch — iHemp International</h2>
        <p className="text-hemp-brown/70 mb-5">Wear the movement. Support industrial hemp.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {ihempMerch.map((item, i) => (
            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="bg-hemp-cream border border-hemp-gold/30 rounded-lg p-5 hover:border-hemp-gold hover:shadow-md transition group">
              <div className="w-full h-32 bg-white rounded mb-3 flex items-center justify-center text-hemp-brown/30 text-sm">Image</div>
              <p className="font-bold text-hemp-brown group-hover:text-hemp-green transition">{item.title}</p>
              <p className="text-sm text-hemp-brown/70 mt-1">{item.description}</p>
              <p className="text-sm font-medium text-hemp-green mt-3">Shop Now →</p>
            </a>
          ))}
        </div>
      </section>
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-hemp-green mb-2" style={{ fontFamily: 'var(--font-fredoka)' }}>Recommended Hemp Products</h2>
        <p className="text-hemp-brown/70 mb-5">Our top picks for hemp growing, testing, and learning.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {amazonProducts.map((product, i) => (
            <a key={i} href={product.url} target="_blank" rel="noopener noreferrer" className="bg-white border border-hemp-gold/20 rounded-lg p-4 hover:border-hemp-leaf hover:shadow-sm transition group">
              <div className="w-full h-28 bg-hemp-cream rounded mb-3 flex items-center justify-center text-hemp-brown/30 text-sm">Image</div>
              <p className="font-semibold text-hemp-brown group-hover:text-hemp-green transition text-sm">{product.title}</p>
              <p className="text-xs text-hemp-brown/60 mt-1">{product.description}</p>
              <p className="text-xs font-medium text-hemp-leaf mt-2">Shop on Amazon →</p>
            </a>
          ))}
        </div>
      </section>
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-hemp-green mb-2" style={{ fontFamily: 'var(--font-fredoka)' }}>Hemp Growing Equipment</h2>
        <p className="text-hemp-brown/70 mb-5">Essential tools and supplies for cultivating hemp.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {hempGrowingEquipment.map((product, i) => (
            <a key={i} href={product.url} target="_blank" rel="noopener noreferrer" className="bg-white border border-hemp-gold/20 rounded-lg p-4 hover:border-hemp-leaf hover:shadow-sm transition group">
              <div className="w-full h-28 bg-hemp-cream rounded mb-3 flex items-center justify-center text-hemp-brown/30 text-sm">Image</div>
              <p className="font-semibold text-hemp-brown group-hover:text-hemp-green transition text-sm">{product.title}</p>
              <p className="text-xs text-hemp-brown/60 mt-1">{product.description}</p>
              <p className="text-xs font-medium text-hemp-leaf mt-2">Shop on Amazon →</p>
            </a>
          ))}
        </div>
      </section>
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-hemp-green mb-2" style={{ fontFamily: 'var(--font-fredoka)' }}>Testing & Measurement Kits</h2>
        <p className="text-hemp-brown/70 mb-5">Tools for quality control and compliance testing.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {testingAndMeasurementKits.map((product, i) => (
            <a key={i} href={product.url} target="_blank" rel="noopener noreferrer" className="bg-white border border-hemp-gold/20 rounded-lg p-4 hover:border-hemp-leaf hover:shadow-sm transition group">
              <div className="w-full h-28 bg-hemp-cream rounded mb-3 flex items-center justify-center text-hemp-brown/30 text-sm">Image</div>
              <p className="font-semibold text-hemp-brown group-hover:text-hemp-green transition text-sm">{product.title}</p>
              <p className="text-xs text-hemp-brown/60 mt-1">{product.description}</p>
              <p className="text-xs font-medium text-hemp-leaf mt-2">Shop on Amazon →</p>
            </a>
          ))}
        </div>
      </section>
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-hemp-green mb-4" style={{ fontFamily: 'var(--font-fredoka)' }}>Official and Educational Links</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {(stateData.resources ?? []).filter((r: any) => r.url).map((resource: any, i: number) => (
            <a key={i} href={resource.url} target="_blank" rel="noopener noreferrer" className="bg-hemp-cream border border-hemp-gold/30 rounded-lg p-4 hover:border-hemp-leaf hover:shadow-sm transition group">
              <p className="font-semibold text-hemp-green group-hover:text-hemp-leaf transition">{resource.label}</p>
              <p className="text-sm text-hemp-brown/60 mt-1">Visit →</p>
            </a>
          ))}
        </div>
      </section>
      <div className="text-center pt-4">
        <Link href="/" className="text-hemp-green hover:text-hemp-leaf font-medium">← Back to Home</Link>
      </div>
    </div>
  )
}
