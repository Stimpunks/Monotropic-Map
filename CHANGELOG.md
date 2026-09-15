# Changelog

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

Not built yet: the *My Monotropic Map* marking tool, the shipped typeface, an offline copy. See `DECISIONS.md`.
