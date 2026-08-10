# SickSec redesign prototypes

Four isolated homepage directions built around the blog's real research and existing identity. These do not alter the current Hugo theme or production output.

## Preview

From the repository root, run:

```sh
python3 -m http.server 4173
```

Then open [http://localhost:4173/prototypes/](http://localhost:4173/prototypes/).

The comparison hub links to all four directions. On any prototype, use the floating direction control (or keyboard keys `1`–`4`) to switch concepts.

Every featured story, case card, constellation node, and archive entry opens the complete Markdown article in the matching visual reader. The reader includes a generated table of contents, reading progress, source images, formatted code, sharing controls, author details, and related research. Its floating `1`–`4` control restyles the current article without changing the article itself.

## Directions

1. **Signal** — cinematic intelligence brief; sharp, evidence-first, high-confidence.
2. **Editorial** — premium journal; typography-led and optimized for long-form reading.
3. **Console** — research operations interface; dense, technical, and practitioner-focused.
4. **Atlas** — immersive discovery system; spatial, atmospheric, and highly memorable.

All four are responsive, use semantic HTML, respect reduced-motion preferences, and require no build step. Google Fonts are progressively enhanced; system fallbacks keep the prototypes usable offline.
