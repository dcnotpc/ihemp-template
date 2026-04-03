import { stateConfig } from "@/config/state";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const yearDisplay =
    currentYear === stateConfig.startYear
      ? `${stateConfig.startYear}`
      : `${stateConfig.startYear}-${currentYear}`;

  return (
    <footer
      style={{ backgroundColor: "var(--hemp-brown)", color: "var(--hemp-cream)" }}
      className="mt-16"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="font-bold text-lg">{stateConfig.siteName}</p>
        <p className="text-xs opacity-50 mt-4">
          © {yearDisplay} {stateConfig.siteName}.
        </p>
      </div>
    </footer>
  );
}
