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
          <h2 className="