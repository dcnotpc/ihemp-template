import { stateConfig } from '@/config/state'
import { getStateBySlug } from '@/data/states'
import Link from 'next/link'

export const metadata = {
  title: `${stateConfig.pages.laws.title} | ${stateConfig.siteName}`,
  description: stateConfig.pages.laws.description,
}

export default function Laws() {
  const stateData = getStateBySlug(stateConfig.slug)
  
  if (!stateData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-3">State Data Not Found</h2>
          <p className="text-red-600">Unable to load state data for &quot;{stateConfig.slug}&quot;. Please check your configuration.</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-hemp-green mb-2" style={{ fontFamily: 'var(--font-fredoka)' }}>
          {stateData.name} Hemp Laws
        </h1>
        <p className="text-sm text-hemp-brown/70">Last updated: {stateData.lastUpdated}</p>
      </div>

      <section className="bg-hemp-cream rounded-lg p-6 mb-8 border border-hemp-gold/30">
        <div className="flex items-center gap-3 mb-4">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide ${
            stateData.status === 'legal' ? 'bg-hemp-leaf/20 text-hemp-green' :
            stateData.status === 'restricted' ? 'bg-hemp-gold/30 text-hemp-brown' :
            stateData.status === 'banned' ? 'bg-red-100 text-hemp-brown' :
            'bg-hemp-cream text-hemp-brown/70'
          }`}>
            {stateData.status}
          </span>
          <span className="text-hemp-brown/60 text-sm">Industrial Hemp Status</span>
        </div>
        <p className="text-hemp-brown leading-relaxed">{stateData.summary}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-hemp-green mb-3" style={{ fontFamily: 'var(--font-fredoka)' }}>THC Limit</h2>
        <div className="bg-hemp-gold/10 border border-hemp-gold/40 rounded-lg p-5">
          <p className="text-hemp-brown">{stateData.thcLimit}</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-hemp-green mb-3" style={{ fontFamily: 'var(--font-fredoka)' }}>Licensing</h2>
        <div className="bg-hemp-cream border border-hemp-gold/30 rounded-lg p-5">
          <p className="text-hemp-brown leading-relaxed mb-3">{stateData.licensingInfo}</p>
          <p className="text-hemp-brown/70 text-sm">
            Regulatory body:{' '}
            <a href={stateData.regulatoryUrl} target="_blank" rel="noopener noreferrer" className="text-hemp-green underline hover:text-hemp-leaf">
              {stateData.regulatoryBody}
            </a>
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-hemp-green mb-4" style={{ fontFamily: 'var(--font-fredoka)' }}>Key Legislation</h2>
        <div className="space-y-3">
{stateData.laws.map((law: any, i: number) => (
            <a key={i} href={law.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-white border border-hemp-gold/20 rounded-lg p-4 hover:border-hemp-leaf hover:shadow-sm transition group">
              <div>
                <p className="font-semibold text-hemp-brown group-hover:text-hemp-green transition">{law.title}</p>
                <p className="text-sm text-hemp-brown/60">Enacted {law.year}</p>
              </div>
              <span className="text-hemp-leaf text-sm font-medium whitespace-nowrap ml-4">View →</span>
            </a>
          ))}
        </div>
      </section>

      {stateData.notes && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-hemp-green mb-3" style={{ fontFamily: 'var(--font-fredoka)' }}>Important Notes</h2>
          <div className="bg-hemp-gold/10 border border-hemp-gold rounded-lg p-5">
            <p className="text-hemp-brown leading-relaxed">{stateData.notes}</p>
          </div>
        </section>
      )}

      <div className="text-center pt-4">
        <Link href="/" className="text-hemp-green hover:text-hemp-leaf font-medium">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
