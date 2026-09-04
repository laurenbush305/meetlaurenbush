Season Zero workflow policy — updated 2026-09-03

Lauren explicitly approved workflow optimization on 2026-09-03. The repository now keeps one durable visual-QA workflow: `visual-capture.yml`.

Rules:
- GitHub Pages remains the production deploy path.
- Visual QA may run automatically after meaningful HTML/CSS/JS/image changes on `main`, and may also be run manually.
- The workflow must capture fresh desktop, tablet, and mobile renders from the public domain and preserve the commit SHA in the artifact name/manifest.
- A successful deployment or green automated check is not visual approval. The fresh artifact must be opened and judged before a design state is called approved.
- Do not create/delete one-shot screenshot workflows for ordinary design iteration. Use the durable visual-QA lane.
- `.qa-trigger` may be changed only when a capture nudge is useful without changing public design files.
- Current art-direction authority lives in Notion A5.19 Warm Prismatic Stardust; older workflow/design notes are archive where they conflict.
