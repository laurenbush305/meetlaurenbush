# Season Zero / LBTV Color System

Status: LOCKED governing note for meetlaurenbush.com color decisions.

## Brief

Lauren Bush Television is sunny first: bright, glossy, inviting, brainy, funny and culturally specific. The visual base is editorial white / chrome / pool aqua with program-specific signal accents. Different programs may change temperature without changing network identity.

This is not a beige editorial portfolio, a greige lifestyle site, a spa palette, a dark sports network, a luxury-corporate studio, a generic streamer UI, or a pastel candy website.

## Non-negotiable exclusions

Do not use cream, beige, greige, khaki, taupe, olive, dusty sage, muddy brown, warm paper, oatmeal, parchment, warm gray or desaturated green as page/background systems.

Chrome/silver is allowed only as a material and structural cue: borders, rules, reflections, metal highlights, dividers and small UI details. It is not a full-page gray fill.

Do not create giant pale pink + pale aqua split backgrounds. Signal colors should feel concentrated and authored, not diluted across the whole page.

Do not use decorative signal colors as ordinary small body text when they fail WCAG contrast.

## Approved core palette

| Role | Token | Hex | Usage |
| --- | --- | --- | --- |
| Optical white | `--sz-white` | `#FFFFFF` | Primary page field |
| Ink | `--sz-ink` | `#0D0F13` | Primary text / black editorial structure |
| Ink soft | `--sz-ink-soft` | `#34404A` | Secondary body copy on light surfaces |
| Powder blue | `--sz-powder` | `#D9F1F8` | Program field / daylight temperature |
| Powder soft | `--sz-powder-soft` | `#EFF9FC` | Small supporting field only |
| Chrome | `--sz-chrome` | `#C3CED4` | Rules / metal / structural details |
| Pool aqua | `--sz-aqua` | `#0BBCD0` | Signal bars, indicators, dark-surface labels, fills |
| Accessible aqua | `--sz-aqua-text` | `#006B78` | Small aqua-family text on light surfaces |
| Hot pink | `--sz-pink` | `#FF1E86` | Booking signal, tally, focus, Create signal, concentrated accents |
| Accessible pink | `--sz-pink-text` | `#A80052` | Small pink-family text on light surfaces |
| Violet | `--sz-violet` | `#6A2BE0` | Television / Watch signal and large accents |
| Coral | `--sz-coral` | `#FF6A44` | Activate signal / fills |
| Accessible coral | `--sz-coral-text` | `#A6381A` | Small coral-family text on light surfaces |
| Broadcast black | `--sz-night` | `#0B0C10` | Host / Watch / booking / on-air fields |
| Broadcast violet | `--sz-night-2` | `#17101D` | Television dark field |
| Deep violet | `--sz-night-3` | `#25142C` | Television / Watch depth only |

## Contrast rules

Target WCAG 2.2 AA at minimum: 4.5:1 for normal text, 3:1 for large text and essential UI graphics. Body copy should normally exceed 7:1 when the palette permits it.

Approved pair receipts:

| Pair | Contrast |
| --- | ---: |
| Ink on white | 19.18:1 |
| Ink soft on white | 10.62:1 |
| Accessible aqua on white | 6.22:1 |
| Accessible pink on white | 7.54:1 |
| Violet on white | 6.92:1 |
| Accessible coral on white | 6.56:1 |
| Ink on powder blue | 16.34:1 |
| Ink soft on powder blue | 9.04:1 |
| Accessible aqua on powder blue | 5.30:1 |
| White on broadcast black | 19.55:1 |
| Soft light text on broadcast black | 12.80:1 |
| Pool aqua on broadcast black | 8.49:1 |
| Hot pink on deep violet | 4.76:1 |
| Ink on hot-pink fill | 5.28:1 |
| Ink on aqua fill | 8.33:1 |
| Ink on coral fill | 6.76:1 |

### Explicitly unsafe as ordinary small text

- Pool aqua `#0BBCD0` on white is about 2.30:1. Use `#006B78` for light-surface text instead.
- Hot pink `#FF1E86` on white is about 3.63:1. Use `#A80052` for light-surface text instead.
- Coral `#FF6A44` on white is about 2.84:1. Use `#A6381A` for light-surface text instead.
- White text on hot pink is about 3.63:1. Small hot-pink buttons use Ink text, not white.

## Program temperature rules

### Hero / Person
White leads. Powder blue may appear as a hard daylight field, reflected light or image-support plane. No overall pastel wash.

### Explain
Powder blue may become a real program field. Text remains Ink / Ink Soft. Aqua is signal and metadata, not body copy.

### Create
White page field + black film frame + concentrated hot-pink signal. Do not tint the entire section cream, peach or blush.

### Television / Watch
Broadcast black and violet are allowed to dominate. Hot pink and aqua behave like light inside the signal. Foreground text must be solid white / approved light text, not low-opacity gray.

### Host
Broadcast black. Aqua is the live signal. Photography remains the primary environmental color source.

### Activate
White daylight field. Coral is the activation signal; aqua/powder may support. Real environmental green may appear in photography but is not a UI/background color.

### Between Cues / Trust
Crisp white with chrome structure. Let the real room photograph provide warmth. Do not manufacture warmth with beige.

### Casting Imagination
White first, powder blue second. Use signal colors in cards, bars and accents. Avoid large cotton-candy pink/aqua split fields.

### Casting Sheet / Project Files
Same network, calmer producer-facing application: white, powder blue, black, chrome structure, restrained signal accents. No separate beige editorial sub-brand.

## Release rules

1. `a5107-accessible-signal-palette.css` must remain the final public palette layer until intentionally replaced by a later documented color-system release.
2. Any new color token must be added to this document with its role and contrast behavior before production.
3. Any small text color on a light surface must meet at least 4.5:1 against its actual background.
4. Any small text color on a dark surface must meet at least 4.5:1 against the darkest/lightest relevant dark field.
5. Bright signal fills should pair with Ink when white text does not meet 4.5:1.
6. Full-page backgrounds may only use approved White, Powder Blue, Broadcast Black or Broadcast Violet families unless a future brief explicitly changes this document.
7. Browser QA screenshots must be visually reviewed at 360px and desktop after any palette change. A green functional test alone is not sufficient.
8. Do not revive legacy warm-paper colors through gradients, alpha blends or new tokens with different names.


## Browser auto-dark protection

The public site is intentionally art-directed and does not permit third-party/browser auto-dark recoloring. Every root public HTML document must include these declarations in `<head>` before stylesheets:

- `<meta name="color-scheme" content="only light">`
- `<meta name="supported-color-schemes" content="light">`
- `<meta name="darkreader-lock">`

The final palette stylesheet must also declare `color-scheme: only light` on `:root`. This is required because Brave iOS Night Mode uses Dark Reader-style page recoloring that can turn approved light surfaces dark while leaving authored foreground colors unreadable.

This protection is part of the Season Zero color system. Do not remove it while the site remains light-first and art-directed. Browser chrome may remain dark according to the user's browser settings; the document itself must retain the authored palette.
