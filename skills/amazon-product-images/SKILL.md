---
name: amazon-product-images
description: Manage Amazon affiliate product images for iHemp state websites. Use when adding, updating, removing, or auditing product images on the Resources page. Handles image download from Amazon CDN, uniform resizing, alt text generation, and code updates to page.tsx. Also use when verifying affiliate link images match current Amazon listings, or when new products are added to the affiliate list.
---

# Amazon Product Images

Manage product images for Amazon affiliate listings on iHemp state site Resources pages.

## File Locations

- **Images directory**: `ihemp-template/public/images/products/`
- **Resources page**: `ihemp-template/src/app/resources/page.tsx`
- **Amazon config**: `ihemp-template/src/lib/amazon.ts` (store ID: `dcnotpc08-20`)

## Product Image Workflow

### 1. Extract Image ID from Amazon

Fetch the Amazon product page and find `data-a-dynamic-image` in the HTML. Extract the image ID (e.g., `51ojFaCbVJS`).

```
Pattern: https://m.media-amazon.com/images/I/{IMAGE_ID}._AC_SX522_.jpg
```

### 2. Download Image

```bash
curl -o ihemp-template/public/images/products/{slug}.jpg \
  "https://m.media-amazon.com/images/I/{IMAGE_ID}._AC_SX522_.jpg"
```

Naming convention: lowercase, hyphenated product name (e.g., `cbd-salve-stick-containers.jpg`).

### 3. Resize to Uniform Dimensions

All product images must be 300x300px with white background padding:

```bash
cd ihemp-template/public/images/products/
for f in *.jpg; do
  convert "$f" -resize 300x300 -gravity center -background white -extent 300x300 -quality 85 "$f"
done
```

If `convert` unavailable, use `magick` instead.

### 4. Update page.tsx

Each product in the `amazonProducts` array needs:

```typescript
{
  title: 'Product Name',
  description: 'Brief description.',
  url: 'https://amzn.to/XXXXX',
  image: '/images/products/product-slug.jpg',
  alt: 'Descriptive alt text for accessibility'
}
```

Render with:
```tsx
<img
  src={product.image}
  alt={product.alt}
  width={300}
  height={300}
  loading="lazy"
  className="w-full h-28 object-contain rounded mb-3"
/>
```

### 5. Verify and Commit

- Check all images are non-zero file size: `ls -la ihemp-template/public/images/products/`
- Verify page renders: check for TypeScript/JSX errors
- Commit with descriptive message

## Adding a New Product

1. Get the `amzn.to` short link from CEO
2. Resolve to full Amazon URL to find ASIN
3. Follow steps 1-5 above
4. Ensure `tag=dcnotpc08-20` is in the affiliate URL

## Compliance Rules

- **No hemp seeds for cultivation** — requires explicit CEO pre-approval (see SOUL.md)
- Use public product images only (Amazon CDN hero images)
- All images must have descriptive alt text
- Never hotlink Amazon images — always download and self-host
- Keep affiliate disclosure visible on Resources page

## Auditing Existing Images

To verify all product images are current and working:

```bash
# Check for missing/broken images
cd ihemp-template/public/images/products/
for f in *.jpg; do
  size=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f" 2>/dev/null)
  echo "$f: ${size} bytes"
done
```

Compare product count in `page.tsx` amazonProducts array against files in images directory.
