# Lauren Bush Site — Current Production Authority

**Effective:** October 6, 2026  
**Public site:** https://meetlaurenbush.com  
**Production branch:** `main`  
**Deploy path:** GitHub Pages

## Current public architecture

The live site uses the **simpler buyer-led editorial architecture introduced September 27, 2026**. It supersedes the older Season Zero A5.8 / A5.19 / A5.20 eleven-scene architecture and the production-luxury-pass branch.

Homepage order:

1. Hero
2. About
3. Selected Work
4. Live
5. The Brain Behind the Mic
6. Book Lauren

Deeper proof lives in the Casting Sheet and project files.

## Current navigation contract

- Work → `index.html#work`
- About → `index.html#engine`
- Casting Sheet → `casting-sheet.html`
- Book Lauren → `mailto:hello@meetlaurenbush.com?subject=Booking%20Lauren%20Bush`

Do not restore removed `#watch` or `#person` links. Permanent QA validates fragment targets.

## Current live-work signal

**Dirty South Trivia | Trivia Host | 2026–present** is an active professional hosting credit. The homepage Live section and Casting Sheet should keep this visible as current live-room proof, with a booking signal for select private events, interactive hosting, branded experiences, moderation and audience-led programming.

The site may link to the official Dirty South Trivia website for context. Do not imply Lauren owns Dirty South Trivia or that every Dirty South event is independently bookable through Lauren.

## Current front-door proof mix

1. **Scrambled Up** — Television
2. **Financial Education Explainer** — Explain / financial education + market analysis
3. **Dear Diary, for Montis** — Create
4. **Honcho × Centerline** — Field

`project-pickleball-bag.html` remains a valid public project file but is intentionally not one of the four primary front-door proof cards. This keeps the visible portfolio from reading as primarily pickleball talent.

## October 6 maintenance checkpoint

Public head at this checkpoint: `709be151c4dd7cdd634f3e9eb5ab5005e2d60652`

Completed:
- repaired corrupted About portrait
- corrected cross-page navigation and stale fragment targets
- removed retired Season Zero/LBTV social-preview metadata
- refreshed 404 and sitemap
- added the Financial Education Explainer project
- rebalanced homepage and Casting Sheet selected proof
- closed obsolete PR #3 and PR #22 without merging
- expanded release QA to six Chromium widths
- added WebKit/Safari-style homepage and Casting checks
- added cross-page fragment validation
- added transfer-budget checks

## Final release QA

GitHub Actions run: `37501660876`  
Artifact: `11429503868`  
Result: **PASS**

Chromium:
- Homepage + Casting: 1440 / 1024 / 768 / 430 / 390 / 360
- All public project files: desktop + 390 mobile

WebKit:
- Homepage + Casting: desktop + 390 mobile

Pass conditions:
- zero horizontal overflow
- zero console errors
- zero HTTP response errors
- zero non-benign request failures
- zero interaction failures
- zero broken internal or cross-page fragment targets
- zero legacy Season Zero/LBTV metadata flags
- no performance-budget failures

## Documentation authority

For current implementation decisions, use this file, current `main`, fresh public pixels, and the Notion page **02 — Site Build + QA**.

Older A5.8/A5.19/A5.20 documents, branches, screenshots, and review artifacts are historical provenance only where they conflict with the current public architecture.

Google Drive remains useful for source assets, approvals, rights, provenance, and archived production records. Old execution docs in Drive have been renamed **ARCHIVE** or **Not Current Execution Authority** and must not outrank current GitHub/Notion truth.
