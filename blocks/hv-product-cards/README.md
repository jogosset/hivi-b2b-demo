# HV Product Cards

4-up product card grid with eyebrow label, section heading, "View All" button, badge variants, wishlist heart, pricing with save%, bulk pricing text, and star ratings.

## Authoring

**Header row (first row, 3 cells):**

| Section Label | Heading | View All Link |
|--------------|---------|---------------|
| BESTSELLERS | TOP PRODUCTS | [View All →](/products) |

**Product rows (one per card, 11 cells):**

| Image | Brand | Name | ANSI Cert | Price | MSRP | Save % | Bulk Pricing | Badge | Rating | Link |
|-------|-------|------|-----------|-------|------|--------|--------------|-------|--------|------|
| [photo] | RADIANS | SV2Z Mesh... | ANSI/ISEA 107 Class 2 Type R | $5.49 | $9.35 | Save 41% | As low as per unit at 12+ | BESTSELLER | 4.8 (847) | /products/sv2z |

## Badge Variants

- `NEW` → neon/lime background with dark text
- Anything with `PRO` → dark background with white text
- All other values → orange background with white text

## Notes

- Rating format: `4.8 (847)` — value then count in parentheses
- Wishlist heart is client-side only (no backend); toggles ♡/♥ on click
- "Add to Cart" overlay slides up from the bottom of the image on hover
