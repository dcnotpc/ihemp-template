# iHemp Brand Style Guide
## Version 1.0 — April 2026

---

## Brand Mission
Advocating for and educating about the Industrial Hemp industry.
Empowering farmers, entrepreneurs, and consumers to support sustainable hemp commerce.

---

## Color Palette

### Primary Colors
| Name           | Hex       | 1: The Style Guide

First, let's create the reference document:

```bash
mkdir -p /home/dcnotpc420/.openclaw/workspace/ihemp-template/docs
nano /home/dcnotpc420/.openclaw/workspace/ihemp-template/docs/STYLE_GUIDE.md
```

Paste this in:

```markdown
# iHemp Brand Style Guide
## Version 1.0 — April 2026

---

## Brand Mission
Advocating for and educating about the Industrial Hemp industry.
Empowering farmers, entrepreneurs, and consumers to support sustainable hemp commerce.

---

## Color Palette

### Primary Colors
| Name           | Hex       | Tailwind Class   | Psychology / Usage                              |
|----------------|-----------|------------------|-------------------------------------------------|
| Hemp Green     | #2D5A27   | green-800        | Trust, growth, nature — primary brand identity   |
| Field Green    | #3E7A32   | green-700        | Action buttons, links, energy                    |
| Leaf Green     | #4A9E3F   | green-600        | Accents, hover states, highlights                |

### Secondary Colors
| Name           | Hex       | Tailwind Class   | Psychology / Usage                              |
|----------------|-----------|------------------|-------------------------------------------------|
| Harvest Gold   | #D4A843   | amber-500        | Premium feel, heritage, warmth — CTAs            |
| Wheat          | #F5E6B8   | amber-100        | Taglines, soft highlights, section accents       |
| Rich Soil      | #5C4033   | stone-700        | Body text, grounded/authentic feel               |

### Neutral Colors
| Name           | Hex       | Tailwind Class   | Psychology / Usage                              |
|----------------|-----------|------------------|-------------------------------------------------|
| Parchment      | #FAFAF5   | stone-50         | Page backgrounds, clean/open feel                |
| Fieldstone     | #78716C   | stone-500        | Secondary text, captions                         |
| Charcoal       | #292524   | stone-800        | Headlines, strong contrast                       |
| Pure White     | #FFFFFF   | white            | Cards, content areas                             |
| Deep Forest    | #1A1A1A   | —                | Footer background, dark sections                 |

### Accent / Alert Colors
| Name           | Hex       | Usage                                           |
|----------------|-----------|------------------------------------------------|
| Advocacy Red   | #B83230   | Urgent CTAs, legal alerts                       |
| Sky Blue       | #3B82F6   | Informational badges, external links            |
| Success Green  | #16A34A   | Confirmations, positive status                  |

---

## Typography

### Font Stack
| Role           | Font              | Fallback            | Weight        | Why                                              |
|----------------|-------------------|---------------------|---------------|--------------------------------------------------|
| Headlines      | **Montserrat**    | Arial, sans-serif   | 700, 800, 900 | Bold, modern, authoritative — commands attention  |
| Body Text      | **Source Sans 3** | Georgia, serif      | 400, 600      | Highly readable, warm, professional               |
| Accent/Tagline | **Playfair Display** | Georgia, serif   | 400 italic    | Elegant heritage feel — "Seeds of the Past" vibe  |
| Code/Data      | **JetBrains Mono**| monospace           | 400           | Legal references, data tables                     |

### Font Sizes (Responsive)
| Element            | Mobile     | Tablet     | Desktop    |
|--------------------|------------|------------|------------|
| Hero Text (HEMP ON)| 3.75rem    | 5rem       | 7rem       |
| H1                 | 2rem       | 2.5rem     | 3rem       |
| H2                 | 1.5rem     | 1.75rem    | 2.25rem    |
| H3                 | 1.25rem    | 1.5rem     | 1.75rem    |
| Body               | 1rem       | 1.05rem    | 1.125rem   |
| Small / Caption    | 0.875rem   | 0.875rem   | 0.875rem   |

---

## Psychology Notes

### Color Psychology for Hemp eCommerce + Advocacy
- **Green (Primary):** Universally associated with nature, health, and growth.
  Builds instant trust for an agricultural/sustainability brand.
  In eCommerce, green CTAs signal "go" and reduce purchase anxiety.
- **Gold/Amber (Secondary):** Signals quality, heritage, and value.
  Creates premium perception without feeling exclusive.
  Perfect for "Add to Cart" and featured product highlights.
- **Earth Tones (Neutrals):** Ground the brand in authenticity.
  Avoids the "corporate" feel — connects to soil, farming, craft.
- **Advocacy Red (Sparingly):** Creates urgency for calls-to-action
  like petitions, legal updates, and time-sensitive campaigns.
  Use sparingly — too much red undermines the calm green trust.

### Font Psychology
- **Montserrat (Headlines):** Geometric sans-serif projects modernity
  and authority. Says "we're serious about this industry."
- **Source Sans 3 (Body):** Adobe's open-source workhorse. Extremely
  legible at all sizes. Warm enough for advocacy, clean enough for commerce.
- **Playfair Display (Accent):** Serif italic creates an emotional,
  heritage connection. Perfect for taglines and quotes. Says
  "this has deep roots."

---

## Button Styles

### Primary CTA (eCommerce / Main Actions)
- Background: Harvest Gold (#D4A843)
- Text: Charcoal (#292524)
- Hover: Darken 10%
- Border-radius: full (pill shape)
- Font: Montserrat 700
- Padding: 12px 32px

### Secondary CTA (Navigation / Exploration)
- Background: Hemp
