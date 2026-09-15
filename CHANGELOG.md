# Changelog

## 2026-09-15 — live on monotropicmap.org

Pushed to [Stimpunks/Monotropic-Map](https://github.com/Stimpunks/Monotropic-Map) (private) and deployed to **[monotropicmap.netlify.app](https://monotropicmap.netlify.app/)**. Netlify builds from `main` on every push; pushing publishes.

**The domain went live the same day**, on Netlify DNS with `force_ssl`, `www` redirecting to the apex. The site shipped `noindex` until the domain actually resolved — every canonical pointed at it — and indexing was opened once it did.

**The first live deploy found a bug no local server could**: the map hotspots positioned themselves with inline `style` attributes, which our own `style-src 'self'` blocks, so every marker on both maps stacked in the corner. Positions are now generated into `map-hotspots.css`, and `check.mjs` fails on any inline style.

## 2026-09-15 — the site exists

First build, on Helen Edgar's go-ahead, with `monotropicmap.org` chosen and joint attribution settled.

- **Both maps, with hotspots.** The island's twenty areas and the nine zones of *Autism &amp; The Map of Neuronormative Domination*, positioned over Helen's original artwork without altering it.
- **Twenty area pages**, generated from `tools/areas.mjs`, each crediting the person who named that area.
- **The frame is structural, not an appendix.** The second map has its own page, and every area page obeys the rule it implies: what changes a stuck state is a change to the conditions, never an instruction to the person.
- **The list view is a front door.** Both views ship visible; JavaScript only collapses them into a switcher once it can switch back.
- Training, the community story project, about, and privacy.
- `tools/check.mjs`: build drift, links, sitemap, metadata, alt text, the no-JavaScript promise, and contrast across both themes.
- **Four attributions were invented on the first pass and corrected against the sources.** `ATTRIBUTIONS.md` records what happened and why.

### The training is a page now

The whole free training reads on the web at `/training`, transcribed from the openly published PDF with presenter notes: fourteen sections, all eight *Consider* reflection prompts, the references, and inline links from every named area to its own page here.

- `tools/md.mjs` gained `::: consider` callouts, with an unknown callout name a hard error rather than an unstyled div.
- Long prose pages get a contents list, generated from the rendered headings so the hrefs and the ids come from one place and cannot disagree.
- `tools/check.mjs --net` now reports the **final** host behind a redirect. Three DOIs were failing as 403; the blockers are SAGE and Taylor & Francis, not doi.org, and naming the redirector would send the next person to debug the wrong service.

### The slides are on the training page

All sixteen, rendered from the published PDF and served from this site — about 1.2 MB, no Canva embed, no third-party frame, no CSP change. They work offline, they print, and every one carries hand-written alt text in `tools/slides.mjs`.

- `tools/make-slides.py` fetches the source PDF and crops a fixed 16:9 box, verified across six pages. Per-page detection was tried first and bled into the presenter notes.
- `tools/md.mjs` gained `@slide <slug>`; a slug with no rendered image is a hard error rather than a missing picture.
- One slide carries Sylvia Duckworth's Wheel of Power and Privilege — her handle stays in the crop, and `ATTRIBUTIONS.md` says so.

Not built yet: the *My Monotropic Map* marking tool, the shipped typeface, an offline copy. See `DECISIONS.md`.
