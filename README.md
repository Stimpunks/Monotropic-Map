# Map of Monotropic Experiences

The destination site for the **[Map of Monotropic Experiences](https://stimpunks.org/2024/10/21/map-of-monotropic-experiences/)** — Helen Edgar's map of twenty monotropic places, developed with the Stimpunks Foundation.

Live at **[monotropicmap.org](https://monotropicmap.org/)**. Static files, no build step, deployed by Netlify from `main` — **pushing publishes, there is no staging step.**

## What is here

- **Two maps, both with hotspots.** The map itself, and *Autism &amp; The Map of Neuronormative Domination* — the frame that explains who makes the weather.
- **Twenty area pages**, each crediting the person who named that area and linking to their own words.
- **The free training**, the workbook, posters, and the community story project.
- **No accounts, no analytics, no third parties.** `default-src 'none'`.

## Layout

```
index.html                 the map: picture and list, both real front doors
areas.html                 all twenty, grouped by flow / connection / stuck / pressure
<twenty area pages>.html   generated, one per area
neuronormative-domination.html   the second map and its nine zones
training.html stories.html about.html privacy.html
pages/*.md                 the prose sources for the pages above
tools/areas.mjs            THE twenty areas — the single source for everything
tools/domination.mjs       the nine zones of the second map
tools/build.mjs            generates every .html, search-index.json, sitemap.xml, llms.txt
tools/md.mjs               a small, strict Markdown dialect
tools/slides.mjs           the sixteen training slides and their alt text
tools/make-slides.py       renders those slides out of the published training PDF
tools/check.mjs            the sweep
images/                    Helen Edgar's two maps, unaltered
images/slides/             the training deck, generated — never hand-edit
```

## Never hand-edit a generated file

**Every `.html` at the root is output.** So are `search-index.json`, `sitemap.xml` and `llms.txt`. The sources are `tools/areas.mjs`, `tools/domination.mjs`, `pages/*.md` and `tools/build.mjs`.

Edit the source, then:

```bash
node tools/build.mjs
```

## Verify a change

```bash
node tools/check.mjs
```

Build drift, internal links and fragments, sitemap agreement, per-page metadata, image alt text and dimensions, the no-JavaScript promise, and WCAG AA contrast across both themes.

Add `--net` to resolve every external link. It skips our own origin — see `DECISIONS.md` for why that means a green run is not proof the domain exists.

Then look at it:

```bash
npx -y serve . -l 8917 --no-clipboard
```

## Two people work here

Helen Edgar and Ryan Boren both have rights to this work. **So *you* is whoever is at the keyboard, and it is never safe to guess.**

**The map is Helen's.** The artwork, the area names, the wording of the map itself. Propose, do not apply.

## This repository is public

Everything here is world-readable, **including the history**. No secrets, no tokens, no private links — and keep it that way. The Netlify deploy key and webhook live on GitHub and Netlify, never in these files.

## Licence

**CC BY-SA 4.0.** See `LICENSE.md` — and note that **it cannot become CC BY-NC-SA**, whatever the sibling repositories do.

Credit lives in `ATTRIBUTIONS.md`. Read it before touching an area's `who`.
