/* eslint-disable @next/next/no-img-element */

export default function CbdSampleOffer() {
  return (
    <section className="mb-12 bg-hemp-cream border border-hemp-gold/40 rounded-xl overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8">
        {/* Image — stacks above text on mobile, left side on desktop */}
        <div className="w-full sm:w-48 flex-shrink-0">
          <img
            src="/images/products/cbd-sample-offer.webp"
            alt="CBD Balm sample pack"
            className="w-full h-48 sm:h-36 object-cover rounded-lg"
          />
        </div>

        {/* Text + CTA */}
        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs font-bold tracking-widest text-hemp-green/60 uppercase mb-2">
            Limited Sample Offer
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-hemp-green mb-2" style={{ fontFamily: 'var(--font-fredoka)' }}>
            New to CBD Topicals? Try a Sample First.
          </h2>
          <p className="text-sm text-hemp-brown/70 mb-4 leading-relaxed">
            Low-cost trial so you can experience iHemp Harvest quality before committing to a full-size product.
          </p>
          <a
            href="https://ihempharvest.com/product/sample-offer/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-hemp-green hover:bg-hemp-leaf text-white font-bold py-2 px-6 rounded-full transition text-sm"
          >
            Get Your Sample
          </a>
        </div>
      </div>
    </section>
  )
}
