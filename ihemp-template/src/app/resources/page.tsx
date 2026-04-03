import { stateConfig } from "@/config/state";

export default function ResourcesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">
        {stateConfig.pages.resources.title}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-gray-700">
        {stateConfig.pages.resources.description}
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border p-6">
          <h2 className="text-2xl font-semibold">Get Involved</h2>
          <ul className="mt-4 space-y-2">
            <li><a href={stateConfig.resources.legislatureUrl} target="_blank" rel="noreferrer" className="underline">Colorado General Assembly</a></li>
            <li><a href={stateConfig.resources.findLegislatorUrl} target="_blank" rel="noreferrer" className="underline">Find My Legislator</a></li>
            <li><a href={stateConfig.resources.congressUrl} target="_blank" rel="noreferrer" className="underline">Congress.gov</a></li>
          </ul>
        </section>
        <section className="rounded-lg border p-6">
          <h2 className="text-2xl font-semibold">Advocacy Organizations</h2>
          <ul className="mt-4 space-y-2">
            <li><a href="https://thehia.org/" target="_blank" rel="noreferrer" className="underline">Hemp Industries Association</a></li>
            <li><a href="https://hempsupporter.com/" target="_blank" rel="noreferrer" className="underline">U.S. Hemp Roundtable</a></li>
            <li><a href="https://www.votehemp.com/" target="_blank" rel="noreferrer" className="underline">Vote Hemp</a></li>
          </ul>
        </section>
      </div>
    </main>
  );
}
