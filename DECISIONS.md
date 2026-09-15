# Decisions

What was chosen while building this site, and what is still open. Read before reopening any of it.

## Open

### "Blackwater" is a surname with no first name
Area 17's definition is credited to Blackwater, which is what our own published page says, and the byline is not on the live article at themighty.com. Ask Helen or ask The Mighty. **Do not guess** — four names were guessed on the first pass and all four were wrong (`ATTRIBUTIONS.md`).

### The "What changes this" text is ours and unreviewed
Twenty new paragraphs, one per area, drafted by Stimpunks. Helen has not read them. They are the one place on the site where we put words into a map that is hers, and they should get her eye before launch.

### The marking tool is not built
*My Monotropic Map* — mark each area, get a legend, print or submit it — is designed and described on `stories.html` and does not exist. The page says so rather than pretending. Version one annotates Helen's map and needs no new artwork; version two, which would let a person drag and resize their own island, needs per-area art that may or may not exist as separable assets in the training decks. **That is a question for Helen, not an assumption.**

### The typeface is named but not shipped
The CSS asks for Atkinson Hyperlegible and falls back to the system stack, which is what everyone currently gets. Shipping the woff2 means adding a `fonts/` payload and keeping `font-src 'self'` honest. Worth doing; not done.

### There is no service worker and no offline copy
Penguin Pebbling has one. This site does not, and that is a deliberate not-yet rather than a no: **once a worker ships it lives on people's devices until something unregisters it**, so it is worth being sure of the page shapes first.

----

## Settled

### The repository is public
Opened 2026-09-15, on Ryan's call, matching [Queering Earth](https://queering.earth/) rather than Penguin Pebbling. It was created private and flipped once the site was live.

Scanned before flipping, because **making a repository public exposes its whole history permanently** — forks and caches outlive a revert. Nothing secret in the tree or in any commit; the only address in the content is the public `hello@stimpunks.org`; the Netlify deploy key and webhook live on GitHub and Netlify and were never in these files. The deploy key and webhook both survived the visibility change, and CI was re-verified with a push afterwards.

**`DECISIONS.md` and `ATTRIBUTIONS.md` are public now too**, including the record of four attributions invented on the first pass and the open note that Helen has not yet reviewed the twenty *What changes this* paragraphs. That is deliberate — it is the same accountability we ask of everyone else — but it is worth knowing it is readable.

### Launched on monotropicmap.org, 2026-09-15
The domain was registered the same day the site was built, pointed at Netlify DNS (`nsone.net` nameservers), and set as the Netlify custom domain with `force_ssl`. `www` 301s to the apex; HTTP 301s to HTTPS.

**Indexing was opened at launch and not before.** Until the domain resolved, `robots.txt` disallowed everything and `_headers` sent `X-Robots-Tag: noindex`, because every canonical pointed at an address that did not exist and a crawler following those canonicals would have landed on nothing. Both were flipped once the domain served the site. `tools/check.mjs` still watches the pair and **fails if one is ever flipped without the other**.

### It is one site holding both maps, not two sites
Decided 2026-09-15. The island on its own reads as a personality quiz — *here is your Burnout Whirlpool, chart a course out* — which inverts the argument, because the whirlpool is manufactured. *Autism &amp; The Map of Neuronormative Domination* is therefore structural rather than an appendix: its own page, its own nine hotspots, linked from every stuck-state area.

**The rule that follows from it, and that every area page obeys: what changes a stuck state is a change to the conditions, never an instruction to the person.** "Rest more" is the failure mode. If a future contribution cannot be written that way, the problem is the contribution.

### The nine zones of the second map are anchors, not pages
Every zone there is a force rather than a place you can be. Nine separate URLs would let a reader meet one in isolation, which is the move the map argues against. They stay on one page.

### The list view is a front door, not a fallback
Both views are in the markup and both are visible with no JavaScript; `map.js` only collapses them into a switcher once it is certain it can switch back. A picture-only navigation excludes screen reader users, anyone who cannot point precisely, and anyone on a small screen — which is a large share of the people this map is *for*.

`tools/check.mjs` enforces this: it fails if `#view-list` ships with a `hidden` attribute, and fails if the switcher is *not* hidden, since a control that cannot work without JavaScript must not be visible without it.

**On screens under 700px the picture starts collapsed.** At 350px the labels printed on the artwork are not legible and no marker size fixes that. The switcher is right there; this is a default, not a decision made for anyone.

### Hotspot positions are stylesheet rules, never inline styles
Found on the first live deploy, 2026-09-15. `_headers` ships `style-src 'self'`, which blocks inline styles outright — so the `style="left:30%;top:16%"` on each marker was dead markup in production and **every hotspot on both maps stacked in the top-left corner.**

It looked perfect locally, because a dev server sends no CSP at all. That is the worst available combination: correct on the machine you are working on, broken for everyone else.

`tools/build.mjs` now generates `map-hotspots.css` from `areas.mjs` and `domination.mjs`, and `tools/check.mjs` **fails on any `style=` attribute or `<style>` element** in a generated page, so it cannot come back.

**The general lesson, written down because it will recur: verify what a page does in production, not on a dev server.** Our own security headers only exist there.

### Hotspots go over the artwork; the artwork is never altered
The markers are a CSS layer positioned by percentage over Helen's original PNG. No redraw, no recolour, no crop, no re-set. This keeps the CC BY-SA attribution clean and keeps a visible change to someone else's work out of scope.

The markers were **too big on the first pass** and swallowed the island — twenty 44px circles over a 350px image. They are now 1.9rem with an invisible `::after` extending the hit area past the 44px minimum, so the target is large while the badge is small.

### The licence is CC BY-SA 4.0 and cannot become CC BY-NC-SA
The map is BY-SA. **ShareAlike forbids adding restrictions, and NonCommercial is an added restriction**, so an NC variant is not a compatible licence for anything derived from this map — we could not relicense it that way even if we wanted to.

This is written down because the instinct will be to match [Penguin Pebbling](https://penguinpebbling.app/), which adopted CC BY-NC-SA 4.0 on 2026-09-15. Different work, different origin. **Do not copy its licence header into this repository.**

### The slides are local images, not a Canva embed
Settled 2026-09-15. The stimpunks.org course page embeds the deck from Canva in an iframe. This site renders the sixteen slides out of the published PDF and serves them itself, at about 1.2 MB total.

An embed would have meant **editing the CSP to allow a third-party frame**, which this repository treats as the signal to stop and ask whether it is worth it. Against that one convenience, local images: work offline, print, carry real alt text, need no third-party JavaScript, load no tracking, and cannot break when somebody moves a Canva link.

**Ten of the PDF's 26 pages are notes continuations and carry no slide**, which is why there are sixteen images and not twenty-six.

The crop is a **fixed 16:9 box**, measured once and verified across pages 1, 3, 5, 12, 14 and 26. Per-page ink-density detection was tried first and bled into the presenter notes — a constant that is right everywhere beats a detector that fails differently on every page.

**The source PDF is not in this repository** — 62 MB, and Autistic Realms publishes it. `make-slides.py` fetches it, so regenerating needs the network, and `--check` verifies only that the rendered slides and `slides.mjs` still agree.

### No Monotropism Questionnaire here
The MQ is a validated instrument by Garau et al. with 47 items written by Autistic adults. It has a home of its own. Copying somebody else's validated measure would invite readers to treat our numbers as theirs.

### No score, no type, no result, no account
This is a map, not an assessment. The moment the site emits a number it is a quiz.

### The free training text is hosted here; the paid pack is not
Settled 2026-09-15, on Ryan's call, and the distinction is the whole of it.

**`training.html` carries the full training** — about 4,000 words, presenter notes and all eight *Consider* prompts — transcribed from *Training: Map of Monotropic Experiences with presenter notes*, the PDF Autistic Realms publishes openly. That document describes itself as "our free open-source training" and says in its own text: **"We welcome you to adapt this training to meet the needs of your community group and those you support."** Putting it on the web as readable, linkable, translatable HTML is the thing it asks for. A 62 MB PDF is not an accessible document.

**The training pack stays at Autistic Realms.** The slides, the PowerPoint, the script-only PDF and the workbook are Helen's downloads — free to individuals and anyone with limited funds, with a suggested donation for organisations and professionals. The page links to them at the top and at the foot and does not host copies. Getting them there is what funds this work.

**The earlier wording of this entry said the site "drives to Helen's shop rather than hosting the paid downloads", which a later session could easily read as "host no training content at all."** It never meant that — the proposal this site was built from asked for the training hosted properly — but the sentence was ambiguous enough to stop someone doing the right thing. Hence this rewrite.

The source PDF is linked rather than mirrored, so Helen's copy stays the copy.

### Node, dependency-free, no build step
Matches [Star Stuff](https://starstuff.earth/) and [Queering Earth](https://queering.earth/), the two other joint Stimpunks and Autistic Realms sites. Penguin Pebbling's tools are Python; that is a game, this is a reference site, and the sibling-document sites are the pattern to follow.

**Nothing here ever needs `npm install`.**

### `tools/md.mjs` hard-errors on anything it does not understand
A page that quietly loses a paragraph still looks fine. That is precisely why it must not be possible. Four-dash rules are house style and three dashes are an error, not a rule.
