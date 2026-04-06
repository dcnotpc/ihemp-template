'use client'

import Link from 'next/link'
import { stateConfig } from '@/config/state'

export default function Header() {
  const navItems = Object.entries(stateConfig.pages).map(([key, page]) => ({
    href: `/${key}`,
    label: page.title as string,
  }))

  return (
    <header className="bg-hemp-green text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <img src={stateConfig.logo} alt={stateConfig.siteName} className="h-10" />
          </Link>
          <div className="flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-hemp-cream transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}
