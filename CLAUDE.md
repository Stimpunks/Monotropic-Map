# CLAUDE.md — Map of Monotropic Experiences

Guidance for Claude Code working in this repository.

## What this is

The destination site for the **Map of Monotropic Experiences**, Helen Edgar's island of twenty monotropic places. A joint **Stimpunks Foundation** and **Autistic Realms** property, like [Star Stuff](https://starstuff.earth/) and [Queering Earth](https://queering.earth/).

Read `README.md` for the layout, `ATTRIBUTIONS.md` for who owns what, `DECISIONS.md` for what was chosen and what is still open, `LICENSE.md` for the terms.

## Two people work here

Helen Edgar and Ryan Boren both have rights to this work. **So *you* is whoever is at the keyboard, and it is never safe to guess.** Ask which only when the answer changes the work — a byline, an attribution, whose call a design decision is. It usually does not.

**The map is Helen's.** The artwork, the area names, the wording printed on the map. **Propose, do not apply.**

## The one rule the whole site rests on

**What changes a stuck state is a change to the conditions, never an instruction to the person.**

An interactive island is one short step from a personality quiz, and a quiz inverts the argument — Burnout Whirlpools and the Shark Infested Waters are manufactured, by schools and workplaces and clinics built on the assumption that there is one correct way to have a mind.

So every `helps` field in `tools/areas.mjs` names what the environment changes. *"Rest more"* is the failure mode. If a new paragraph cannot be written that way, the problem is the paragraph.

## House rules

- **Capitalize Autistic and Disabled. Identity-first language** — "Autistic person", never "person with autism".
- **Preserve original capitalization and wording in quotes**, even where it differs from house style. Several sources write "autistic" lowercase. Correcting someone else's words is not ours to do.
- **Horizontal rules in Markdown are `----`, four dashes.** `tools/md.mjs` treats three as a hard error. YAML fences stay at three.
- **One line per paragraph in Markdown.** No hard-wrapping prose.
- **British spelling in page copy where the map uses it** — the artwork says *Behaviourism*, and the page must match the picture.
- **The licence is CC BY-SA 4.0 and cannot become CC BY-NC-SA.** ShareAlike forbids added restrictions. Penguin Pebbling is NC-SA; **do not copy its licence header here.**

## Attribution is the content

This is a map of other people's coinages, and the credit is not decoration.

**Never invent a name.** Four were invented on the first pass and all four were wrong — every one from filling in a first name where our own published page gave only a surname. **A surname you can source beats a full name you cannot.** `ATTRIBUTIONS.md` has the record.

`who` is the source of the quoted definition. `coiner` is the person who named the thing when that is somebody else. Do not collapse them.

An area with no single originator **says so**, and never defaults to our name.

## Never hand-edit a generated file

Every `.html` at the root is output, as are `search-index.json`, `sitemap.xml` and `llms.txt`.

| Generated | From |
|---|---|
| every root `.html` | `tools/areas.mjs`, `tools/domination.mjs`, `pages/*.md`, `tools/build.mjs` |
| `search-index.json` | `tools/areas.mjs` |
| `sitemap.xml`, `llms.txt` | the page list in `tools/build.mjs` |
| `images/slides/*.webp` + `manifest.json` | the training PDF, via `tools/make-slides.py` |

Edit the left-hand side and an edit is lost on the next run, silently.

```bash
node tools/build.mjs
node tools/check.mjs
```

## The training slides

Sixteen slides, rendered from the published training PDF by `tools/make-slides.py` and placed in `pages/training.md` with `@slide <slug>`.

**Alt text lives in `tools/slides.mjs`, not in the Markdown** — it is content, it is the slide for anyone who cannot see it, and it belongs somewhere reviewable rather than scattered through prose. `validate()` refuses alt text under 80 characters.

**The source PDF is not in this repository.** It is 62 MB and Autistic Realms publishes it; the tool fetches it, so a re-render needs the network. `python3 tools/make-slides.py --check` only verifies that the rendered slides and `slides.mjs` still agree, and `check.mjs` reports plainly when it could not run at all.

One slide carries **Sylvia Duckworth's Wheel of Power and Privilege**. Her handle is printed on it and must stay in the crop. See `ATTRIBUTIONS.md`.

## Adding a page

`tools/build.mjs` has a `NAV` list and a `FOOTER_ONLY` list. A page in neither is not built. `sitemap.xml` is generated from the same list, so there is one place to add it — but `check.mjs` will tell you if that stops being true.

## Verifying

`node tools/check.mjs` — build drift, internal links and fragments, sitemap agreement, metadata, alt text and image dimensions, the no-JavaScript promise, contrast in both themes. `--net` resolves external links.

**A gate that could not run has not passed.** `--net` skips our own origin because the domain is not registered; a green run is not evidence that monotropicmap.org exists.

Then serve the folder and look at it, at 1200px and at 375px, in both themes.

## No build step, and keep it that way

No npm, no bundler, no framework, no CDN, no analytics, nothing fetched from a third party at runtime. `_headers` ships `default-src 'none'`. **Adding any third-party resource means editing the CSP, which is the signal to stop and ask whether it is worth it.**

## Deploying

- **Repository**: [Stimpunks/Monotropic-Map](https://github.com/Stimpunks/Monotropic-Map) — **private**, like Penguin-Pebbling.
- **Live**: <https://monotropicmap.org/> (Netlify project `monotropicmap`, Stimpunks team; `monotropicmap.netlify.app` still serves it).

**Netlify builds from `main` on every push, so pushing publishes.** There is no staging step and no build command — the files are served as-is. Treat a push as the publish it is.

**`robots.txt` and `X-Robots-Tag` must agree.** The site was `noindex` until the domain resolved; `check.mjs` still fails if one of the pair is ever flipped without the other.

**Verify in production, not on a dev server.** Our security headers only exist there, and the first live deploy proved the point: the map hotspots were positioned with inline `style` attributes, which `style-src 'self'` blocks, so every marker on both maps stacked in the corner while looking perfect locally.

Netlify's Pretty URLs rewrites the served HTML, so **a diff of the live page against this repository will never be clean.** Verify what a page does, not that its bytes match.
