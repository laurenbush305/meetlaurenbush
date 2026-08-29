# Season Zero / LBTV Visual Canon

Status: **LOCKED VISUAL AUTHORITY** for meetlaurenbush.com.

This document exists because the live site drifted twice by treating Season Zero as a color-palette problem instead of the material/cinematography system defined in the source canon. Future builders must read this before changing public visual styling.

## Source authority hierarchy

When implementation notes conflict, use these sources in this order:

1. **Notion — PHASE A5.8 — Stardust Cinematic Production Canon — LOCKED 2026-08-20** (`3c225df5-cad1-812a-b143-f0de357dc363`)
2. **Notion — A5.8 Visual Build Blueprint — Approved Direction** (`3c425df5-cad1-8182-ae8f-e9d4e639504a`)
3. **Notion — Canon + Greenlight Board** (`3a325df5-cad1-812a-8df9-e36885dc2b4a`)
4. **Notion — Asset + Image Room** (`3a325df5-cad1-8161-90f6-fdbd452f4a74`)
5. **Google Drive — Season Zero — A5.8 Stardust Cinematic Production Canon — LOCKED 2026-08-20** (`1p9hMAwDZuHOF89-75LDwQCmsSv4McvqF8gh2jYOmzKI`)
6. **Google Drive — 00 — Stardust Production Asset Manifest** (`11JOO5ctnABF63qOG0HW0ydRiS7WI8TkZNcj1Qi6WgnE`)

Accessibility/color-token documents are implementation aids. They do **not** supersede the visual canon above.

## Governing visual idea

Season Zero is **Prismatic Broadcast Glamour / Stardust Cinematic Production**.

At first glance the world reads almost colorless and expensive: **pearl, icy silver, opalescent white, clear optical glass and chrome**. Color appears because light hits material: reflection, refraction, transmission, lens bloom, caustics, edge glow and source-derived broadcast light.

The site is not “white + aqua + pink + purple.” Those colors are optical events inside the material world.

## The failure mode that is now banned

Do not translate this brief into a flat palette system.

The following are regressions even when the hex values are technically on-brand:

- a powder-blue section used as wallpaper
- a solid purple or violet section used as shorthand for “On Air”
- giant aqua/pink split fields
- flat dark backgrounds with low-contrast black/gray typography
- section-by-section candy colors
- generic glass cards without physical depth
- CSS gradients that read as pastel fog rather than optical material
- generic luxury-tech / SaaS / streamer styling
- beige, cream, greige, taupe, khaki, olive, dusty sage, muddy brown or warm-paper page fields

## Material behavior

### Daylight

Pearl / silver / opalescent white. Airy dimensionality. Real sunlight. Tiny aquamarine, blush, lilac/periwinkle and restrained pale-green refractions. One or two optical events per viewport maximum.

### On Air

The **same material world under deeper lighting**, not a different purple website. Black is depth. Source-derived color may intensify. Chrome, glass, pearl and optical edges remain continuous.

### Optical foreground

A thin camera-plane treatment may enter from a frame edge and bend/refract photography. It is never a centered crystal sculpture, logo or decorative object.

### Silver / glass signal rail

Razor-thin functional detail with a precise highlight. Jewelry-scale. No HUDs, dashboards, gamer interfaces or faux control rooms.

### Pearl transmission

Frosted/pearl media-carrying plane with subtle spectral edge behavior. It may clarify hierarchy for Finance, Create, Watch or proof. It must not become a SaaS glass-card component system.

## Human/media hierarchy

**Real Lauren is the human center.** Stardust frames, reflects, refracts or transmits her real photography/video and verified proof.

Use deliberate camera-distance rhythm: full-body → medium → close-up → environment → event proof → presenter motion → live room → BTS as the story requires. Do not solve empty space by enlarging weak or low-resolution media.

Generated assets may support optical/material behavior but must never invent Lauren, a fake set, fake proof or synthetic documentary evidence.

## Section rules

- **Hero:** Lauren first. Pearl/silver Stardust daylight. Editorial LAUREN BUSH interacts with her figure. One cropped optical event. No decorative-object hero.
- **Person:** first intentional close-up. Beauty editorial. Airy opalescent daylight and subtle reflection.
- **Explain:** WIMPB environment dominates. Finance appears as an illuminated/reflected transmission, not a dashboard card.
- **Create:** physical-media-object behavior. Glossy acrylic / cartridge / sleeve logic is preferred over a generic video card.
- **Television:** Stardust enters On Air using source-derived broadcast heat. Black depth, silver/optical continuity. No flat purple nightclub.
- **Host:** the real venue owns the scene. Wide/live-room authority first. No black void, podcast read or selfie read.
- **Activate:** Centerline environment dominates. GoTennis remains a smaller qualified proof transmission.
- **Watch:** active program changes environmental weather. Tuner feels physical/nearly invisible, not streaming dashboard UI.
- **Between Cues / Trust:** production world and operating context. Professional depth, not KPI cards.
- **Casting Imagination:** premium entertainment key-art leap using real Lauren. No generic fantasy collage and no cotton-candy split background.
- **Book:** calm dark end card with crystal/silver continuity and one concentrated hot-pink cue.
- **Casting Sheet / Project Files:** practical lower-intensity siblings using the same material world.

## Typography

Contemporary entertainment title design + fashion editorial. Purposeful scale tension, cropping, overlap and interaction with media/material. Supporting copy stays exceptionally legible.

Avoid generic centered web headings, conference-brand typography and decorative “future” fonts.

## Accessibility is a constraint, not the art direction

WCAG-safe foreground companions are required where bright optical colors fail as text. Accessibility tokens must never be promoted into giant page-background decisions merely because they pass contrast.

The visual system must satisfy both:

1. authored Stardust material behavior, and
2. readable/operable WCAG-conformant foreground/background pairings.

Passing Axe does not prove visual fidelity. Passing visual review does not excuse inaccessible text.

## Browser auto-dark protection

The public document is intentionally art-directed and must not be recolored by browser/extension auto-dark systems.

Every public root HTML page must include:

- `<meta name="color-scheme" content="only light">`
- `<meta name="supported-color-schemes" content="light">`
- `<meta name="darkreader-lock">`

The final visual stylesheet must also set `color-scheme: only light`.

**Required regression scenario:** review the site in a browser/system dark-mode context before release. Browser chrome may be dark; the authored document colors must remain unchanged.

## Visual-release gate

A palette/style release cannot merge merely because technical tests are green.

Every visual release must:

1. render the real browser at 1440, 1024, 768, 430, 390 and 360;
2. inspect full-page and chapter screenshots, not only assertions;
3. inspect 360/390 in a dark-mode browser context;
4. confirm Daylight looks pearl/silver/opalescent rather than beige, gray, powder-blue wallpaper or pastel fog;
5. confirm On Air looks like the same material world under deeper light rather than a purple skin;
6. confirm labels/captions remain readable over every image and transmission;
7. compare against this source hierarchy, not against the previous live build;
8. stop the release if the browser pixels contradict the canon, even when automated QA passes.

## Implementation authority

`assets/css/a5108-stardust-restoration.css` is the current final visual-authority layer. Earlier A5.10.6/A5.10.7 palette files remain historical/accessibility layers only and may not be treated as the visual brief.

Any future replacement must explicitly update this document and identify which locked source decision changed. Silent drift is forbidden.
