import { stateConfig } from "@/config/state";

export default function LawsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">
        {stateConfig.pages.laws.title}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-gray-700">
        {stateConfig.pages.laws.description}
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border p-6">
          <h2 className="text-2xl font-semibold">Colorado Resources</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <a href="https://leg.colorado.gov/" target="_blank" rel="noreferrer" className="underline">
                Colorado General Assembly
              </a>
            </li>
            <li>
              <a href="https://ag.colorado.gov/brands/industrial-hemp-program" target="_blank" rel="noreferrer" className="underline">
                Colorado Industrial Hemp Program
              </a>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
