/**
 * Amazon Associates utility functions
 * Stores configuration for Amazon affiliate links
 */

export const AMAZON_STORE_ID = 'dcnotpc08-20'

/**
 * Build an Amazon affiliate link with proper tracking
 * @param asin - Amazon Standard Identification Number (optional, can use direct URL)
 * @param directUrl - Direct Amazon product URL (alternative to ASIN)
 * @returns Complete Amazon affiliate URL with tracking
 */
export function buildAmazonLink(asin?: string, directUrl?: string): string {
  if (directUrl) {
    // If we have a direct URL, ensure it has our affiliate tag
    try {
      const url = new URL(directUrl)
      url.searchParams.set('tag', AMAZON_STORE_ID)
      // Add optional parameters for better tracking
      url.searchParams.set('linkCode', 'ogi')
      url.searchParams.set('th', '1')
      url.searchParams.set('psc', '1')
      return url.toString()
    } catch {
      // If URL parsing fails, return as-is
      return directUrl
    }
  }
  
  if (asin) {
    // Build URL from ASIN
    return `https://www.amazon.com/dp/${asin}/?tag=${AMAZON_STORE_ID}&linkCode=ogi&th=1&psc=1`
  }
  
  // Fallback to generic Amazon search
  return `https://www.amazon.com/?tag=${AMAZON_STORE_ID}`
}

/**
 * Extract ASIN from Amazon URL
 * Useful for converting short links to ASIN-based links
 */
export function extractAsinFromUrl(url: string): string | null {
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/, // Standard dp/ASIN format
    /\/gp\/product\/([A-Z0-9]{10})/, // gp/product/ASIN format
    /\/product\/([A-Z0-9]{10})/, // product/ASIN format
    /amzn\.to\/[a-zA-Z0-9]+/ // Short link - would need expansion
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return null
}

/**
 * Product interface for Amazon items on Resources page
 */
export interface AmazonProduct {
  title: string
  description: string
  url: string
  imageUrl?: string
  asin?: string
  category?: string
}