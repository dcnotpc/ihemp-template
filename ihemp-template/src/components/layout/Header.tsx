import Link from "next/link";
import { stateConfig } from "@/config/state";

export default function Header() {
  return (
    <header
      style={{ backgroundColor: "var(--hemp-green)", color: "var(--hemp-cream)" }}
      className="border-b"
    >
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          {stateConfig.siteName}
        </Link>

        <nav className="flex gap-4 text-sm">
          <Link href="/laws">Laws</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/resources">Resources</Link>
        </nav>
      </div>
    </header>
  );
}
