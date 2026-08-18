# Season Zero / LBTV — Public Release QA

Source revision: `6f19c5b37e4b20f2c72ad08a19ae3e330ead2083c91393bb2d6b94f69d9b2eb4`

## Homepage regression

- Browser widths checked: 360, 390, 430, 768, 1024, 1280, 1440.
- Horizontal overflow: zero at every width checked.
- Homepage source diff versus R4.1: only release-status attributes changed in `index.html`; no homepage layout/content markup changed.
- Pixel comparison: 1440 and 360 full-page captures are pixel-identical to R4.1; 390 shows only a tiny header underline/subpixel raster difference with no layout/content change.
- Chapter-by-chapter media-resolve check at 360 and 1440: zero missing visible images when each chapter enters view.
- Watch interaction checked across responsive runs; program acquisition works, guide closes, no Watch controls clip, and offscreen Watch playback pauses.
- Local-reference audit: 86 references checked, zero missing.
- JavaScript syntax: all local JS files pass `node --check`.

## Casting Sheet

- Browser widths checked: 360, 390, 430, 768, 1024, 1280, 1440.
- Horizontal overflow: zero at every width checked.
- Missing images: zero at every width checked.
- WIMPB natural source: 480×854, `object-fit: contain`; Scrambled 864×1536; Centerline 800×1000; Floral 1068×1422.
- Range is single-column at 360/390/430, two-column at 768, four-column from 1024 upward.
- White Claw legacy row: absent.
- `(uncredited)`: absent.
- GoTennis / ARSA result retains paid-amplification qualification.
- Booking mailto, Watch link, Home link and public GoTennis link are present.

## Social metadata

- Canonical: `https://meetlaurenbush.com/`.
- OG/Twitter image: `https://meetlaurenbush.com/assets/img/SeasonZero_LBTV_OG_1200x630.jpg`.
- OG dimensions: 1200×630.
- Twitter card: `summary_large_image`.
- Title and description remain the R4.1 public metadata.

Nothing in this package was deployed. GitHub and the live site were not modified.
