import { stateConfig } from '@/config/state'

export default function Footer() {
  return (
    <footer className="bg-hemp-brown text-hemp-cream py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} {stateConfig.siteName}. All rights reserved.
        </p>
        <p className="text-xs mt-2 opacity-75">
          Informational purposes only. Not legal advice.
        </p>
      </div>
    </footer>
  )
}
