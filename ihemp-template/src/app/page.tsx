import { stateConfig } from "@/config/state";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{stateConfig.tagline}</h1>
      <p className="text-lg mb-8">
        {stateConfig.description}
      </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stateConfig.homepage.cards.map((card) => (
          <a
            key={card.href}
            href={card.href}
            className="block p-6 border rounded-lg hover:shadow-lg"
          >
            <h2 className="text-xl font-bold mb-2">{card.title}</h2>
            <p>{card.description}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
