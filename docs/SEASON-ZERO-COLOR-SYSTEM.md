# Season Zero / LBTV Accessibility Color Roles

Status: **IMPLEMENTATION SUPPORT ONLY. NOT VISUAL AUTHORITY.**

The authoritative art direction now lives in `docs/SEASON-ZERO-VISUAL-CANON.md`, which is grounded in the locked A5.8 Stardust Cinematic Production Canon and approved Visual Build Blueprint from Notion/Google Drive.

This file exists only to preserve contrast-safe foreground companions and browser color-protection rules. It must never be used to reduce Season Zero to a flat white / powder-blue / purple palette again.

## Core accessibility roles

| Role | Hex | Usage |
| --- | --- | --- |
| Ink | `#0D0F13` | Primary text on light/pearl surfaces |
| Ink soft | `#34404A` | Secondary body copy on light/pearl surfaces |
| Accessible aqua | `#006B78` | Small aqua-family text on light surfaces |
| Accessible pink | `#A80052` | Small pink-family text on light surfaces |
| Accessible coral | `#A6381A` | Small coral-family text on light surfaces |
| Optical white | `#FFFFFF` | High-contrast text on dark On Air surfaces |
| Soft light | `#C7D3D9` | Secondary text on dark On Air surfaces |
| Hot pink | `#FF1E86` / `#FF2B88` | Concentrated cue/fill only; pair with dark Ink for small button text |
| Pool aqua | `#0BBCD0` | Signal/fill/dark-surface label; not ordinary small text on white |

## Contrast rules

Target WCAG 2.2 AA at minimum: 4.5:1 for normal text and 3:1 for large text / essential UI graphics. Body copy should exceed 7:1 when practical.

Useful pair receipts from the prior audit:

- Ink on white: about 19:1
- Ink soft on white: about 10.6:1
- Accessible aqua on white: about 6.2:1
- Accessible pink on white: about 7.5:1
- Accessible coral on white: about 6.5:1
- White on broadcast black: about 19.5:1
- Pool aqua on broadcast black: about 8.5:1
- Ink on hot-pink fill: about 5.3:1

### Unsafe as ordinary small text

- Pool aqua on white is about 2.3:1.
- Hot pink on white is about 3.6:1.
- Coral on white is about 2.8:1.
- White text on hot pink is about 3.6:1.

Use the darker accessible companion when a bright optical signal color cannot carry readable small text.

## Critical visual-authority rule

**Accessibility tokens are not page-background instructions.**

Do not infer that an accessible aqua, powder blue, violet, white or black token should become a section fill merely because the pair passes contrast. Section atmosphere/material behavior is governed by `SEASON-ZERO-VISUAL-CANON.md`:

- pearl / icy silver / opalescent white / clear optical glass / chrome first;
- color appears primarily as reflection, refraction, transmission, glow and source-derived light;
- Daylight and On Air remain one material world;
- no flat powder-blue wallpaper;
- no flat purple nightclub sections;
- no cotton-candy aqua/pink split fields;
- no beige / cream / greige / khaki / taupe / olive / dusty-sage / muddy-brown page systems.

## Browser auto-dark protection

The public site is intentionally art-directed and does not permit browser/extension auto-dark recoloring. Every public root HTML document must include:

- `<meta name="color-scheme" content="only light">`
- `<meta name="supported-color-schemes" content="light">`
- `<meta name="darkreader-lock">`

The final visual stylesheet must also declare `color-scheme: only light`.

This requirement exists because a forced-dark browser can turn authored pearl/light surfaces into charcoal while leaving dark foreground text in place, producing exactly the unreadable failure observed on Brave iOS.

## Release rule

Axe/contrast success is necessary but insufficient. Every visual change must also pass the Stardust visual gate in `SEASON-ZERO-VISUAL-CANON.md`, including human inspection at 360/390 and desktop plus a dark-mode browser-context check.
