# Decisions

What was chosen while building this site, and what is still open. Read before reopening any of it.

## Open

### "Blackwater" is a surname with no first name
Area 17's definition is credited to Blackwater, which is what our own published page says, and the byline is not on the live article at themighty.com. Ask Helen or ask The Mighty. **Do not guess** — four names were guessed on the first pass and all four were wrong (`ATTRIBUTIONS.md`).

### Two sets of our own words sit on Helen's map, and she has reviewed neither
**Forty short passages now, not twenty.** The *What changes this* paragraph and the *In plain words* definition on each area page are both drafted by Stimpunks. They are the places where we put our words into a map that is hers, and they should get her eye.

The plain definitions are derived from the Stimpunks glossary entries, which are collections of academic quotations — useful, and not what somebody meeting an idea for the first time should have to read first.

**Measured, not asserted**: 472 words over 63 sentences, 7.5 words a sentence, longest 14, reading ease 95/100, Flesch-Kincaid 1.9, 3% three-syllable words, no sentence over 15 words. `validate()` in `areas.mjs` fails any definition averaging over 15 words a sentence or containing one over 18, so this cannot quietly drift back into prose.

**That is below ASAN's Easy Read band (grade 3–5) rather than inside it, and no script can certify Easy Read anyway** — that takes a focus group of people with intellectual and developmental disabilities. What the numbers show is that the text is short and simple. Whether it is *right* is a question for readers.

### The marking tool is not built
*My Monotropic Map* — mark each area, get a legend, print or submit it — is designed and described on `stories.html` and does not exist. The page says so rather than pretending. Version one annotates Helen's map and needs no new artwork; version two, which would let a person drag and resize their own island, needs per-area art that may or may not exist as separable assets in the training decks. **That is a question for Helen, not an assumption.**

### The typeface is named but not shipped
The CSS asks for Atkinson Hyperlegible and falls back to the system stack, which is what everyone currently gets. Shipping the woff2 means adding a `fonts/` payload and keeping `font-src 'self'` honest. Worth doing; not done.

### There is no service worker and no offline copy
Penguin Pebbling has one. This site does not, and that is a deliberate not-yet rather than a no: **once a worker ships it lives on people's devices until something unregisters it**, so it is worth being sure of the page shapes first.

----

## Settled

### The site's voice says "map", not "island" — except in alt text
Changed 2026-09-15, on Ryan's call. **"Island" now carries a Jeffrey Epstein association for a lot of readers**, which is not something a page about Autistic flow states should be making anybody think about.

The tagline went from *An island you can find yourself on* to **A map you can find yourself on**, and the word was replaced in every other piece of reader-facing voice: the home page's "the water it all sits in", the Pressure blurb, the Shark Infested Waters gloss, and the prose on `stories`, `about` and `neuronormative-domination`.

**Three uses were kept, all of them alt text**, and the distinction is the point: alt text describes the artwork, and the artwork *is* an island. A blind reader needs the same picture everyone else gets, and calling it a map would be describing something the image does not show. **Accuracy about a picture is not the same job as choosing our own vocabulary.**

So: the word survives only where it is describing what is drawn. Anywhere the site is speaking in its own voice, it says map. **Do not "fix" the alt text for consistency** — that would make it worse.

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

### The plain definition comes first on an area page
Added 2026-09-15 on Ryan's suggestion. Order on the page is: the area's name, what kind of place it is, **In plain words**, then the quoted definition with its credit, then what changes it.

**Plain first, and set in larger type than the quotation below it.** An Easy Read version placed underneath the "real" one, in smaller type, tells the reader which of the two was meant for them. The plain definition is not a simplified aside; for a lot of people it is the definition.

The quoted one stays, in full, with its attribution — this is a map of other people's words and the plain version paraphrases rather than replaces them.

### A numbered key sits under the map
Added 2026-09-15 on Ryan's suggestion, patterned on the *Areas of the Map* list in the [published article](https://stimpunks.org/2024/10/21/map-of-monotropic-experiences/).

**It fixes a real hole in the map view.** Before it, the twenty names existed on the front page only inside the *other* view — so with the picture showing, area 7 was a numbered circle and nothing else, and the labels printed on the artwork are not legible at page width. The one job the picture has is orientation, and it could not do it alone.

**The key and the grouped list are different tools and both stay.** The key answers *what is that number on the picture?* — compact, in map order, columns, the marker in the area's own state colour. The grouped list answers *what kind of place is this?* — Helen's own flow/connection/stuck/pressure grouping, with credits.

It uses each area's **map label**, not its page title, because a legend has to match the words printed on the picture. That is why entry 13 is the long one.

Helen's training deck does the same thing: slide 14 is the map beside a numbered key.

### The front page shows the map and its key, and needs no JavaScript at all
**This replaces the picture/list switcher**, which shipped on 2026-09-15 and was removed the same day, on Ryan's call. The entry it replaces argued that the list was a front door and not a fallback — that principle was right and is now served better, which is why the mechanism went and the principle stayed.

**The switcher's own design was what undermined it.** Making the picture and the list mutually exclusive meant the twenty names lived in the view you were *not* looking at: with the picture showing, area 7 was a numbered circle, and the labels printed on the artwork are not legible at page width. A front door you have to close to use the other one is not two front doors.

The key fixed that, and once it existed the switcher had nothing left to do. The front page is now: the picture, the key beneath it, and a link to `areas.html` for the grouped view — which the switcher's list view had been duplicating exactly, while `areas.html` was already the second item in the nav.

**What this bought:**
- `map.js` is deleted. `index.html` loads **no script but the theme toggle**, and the whole page works with JavaScript off — not as a degraded fallback, as the only mode there is.
- The narrow-screen special case is gone too. It existed because the artwork alone could not orient anybody at 375px; with twenty readable names underneath, it can. Phones get the same page as everything else.
- Three dead CSS rules and a stored `mm-view` preference nobody asked for.

**`tools/check.mjs` checks the property rather than the old implementation**: twenty key entries present and unhidden, no script on the front page but `theme.js`, and no always-visible control that JavaScript would have to wire up. The previous version tested for `#view-list` and `.viewswitch` by name, which would have gone green on a page that no longer had either.

The key's columns are set by **column-width, not column-count**, so the browser fits as many as the space allows — one on a phone, three on a wide screen, no breakpoints to keep in sync. Fixed at two, entry 13's long label wrapped five lines deep at 375px.

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
