# Decisions

What was chosen while building this site, and what is still open. Read before reopening any of it.

## Open

### Two sets of our own words sit on Helen's map, and she has reviewed both
**Forty short passages now, not twenty.** The *What changes this* paragraph and the *In plain words* definition on each area page are both drafted by Stimpunks. They are the places where we put our words into a map that is hers, and they should get her eye.

The plain definitions are derived from the Stimpunks glossary entries, which are collections of academic quotations — useful, and not what somebody meeting an idea for the first time should have to read first.

**Measured, not asserted**: 472 words over 63 sentences, 7.5 words a sentence, longest 14, reading ease 95/100, Flesch-Kincaid 1.9, 3% three-syllable words, no sentence over 15 words. `validate()` in `areas.mjs` fails any definition averaging over 15 words a sentence or containing one over 18, so this cannot quietly drift back into prose.

**That is below the Easy Read band of the Autistic Self Advocacy Network (ASAN) — [autisticadvocacy.org](https://autisticadvocacy.org) — (grade 3–5) rather than inside it, and no script can certify Easy Read anyway** — that takes a focus group of people with intellectual and developmental disabilities. What the numbers show is that the text is short and simple. Whether it is *right* is a question for readers.

**The packet that asks her is generated, not retyped.** `node tools/review.mjs` reads the forty passages out of `areas.mjs` and emits a review page; `--md` emits the same thing as Markdown to print or email. A packet with the passages copied into it would be a forty-first copy that drifts the moment either side is edited, and the drift would be the worst kind — Helen reviewing wording the site no longer carries, or approving wording it never carried. It marks *ours* and *hers* apart on purpose: a reviewer who cannot tell whose sentence she is reading cannot review it. It also carried the three questions only she could answer: Blackwater's first name, whether anyone named Rabbit Holes of Research or Infodump Canyon, and whether per-area artwork exists for version two of the marking tool.

**She answered all three on 2026-09-16, and returned notes on eighteen of the forty passages.** The answers: the byline is **Amelia Blackwater** ([her profile](https://themighty.com/u/amelia-blackwater)); **Rabbit Holes of Research and Infodump Canyon are both hers**; and the artwork question is superseded by what she wants version two to *be* (below). The wording changes are in `areas.mjs` and the three that are not are above.

**Four of her notes were general and apply to the whole site**, not to one area: keep the capital A on Autistic; spell out Autistic Self Advocacy Network on first use and link it; "monotropic mind" becomes "monotropic person" everywhere; and the senses are eight, not five. The first was already true in our own words and is **deliberately not applied inside quotations** — several sources write it lowercase, and correcting someone else's words is not ours to do. The other three are applied.

### Both versions ship, because they are two different questions
Settled 2026-09-16, on Ryan's call. **Version one asks *where are you on Helen's map*. Version two asks *what does your map look like*.** Those are not the same question and the second does not replace the first: a person meeting monotropism for the first time needs the twenty places named and a way to say which are theirs, and a person who already knows needs a blank ground. Shipping only the builder would take the easier door away.

So `stories` keeps the marking tool, and the canvas gets **its own page**, added to `NAV` and to the same list `sitemap.xml` is generated from. `TOOL_PAGES` in `tools/build.mjs` grows a second entry and a second script, because the two tools share no state and should not share a file.

**The no-JavaScript floor does not move.** Version one works with the script off — real radios, printable. A drag-and-resize canvas cannot, so the builder page must say so plainly and send a reader to the marking tool and to the paper workbook, the way `stories` already sends them to the workbook. **A page whose whole content needs a script must not pretend otherwise**, and the front page's promise is untouched either way: `index.html` still loads nothing but `theme.js`.

### Version two has its artwork, and a licence question in place of the old one
**Answered on 2026-09-16: the separable artwork exists.** Helen sent the working files — a Pixelmator document and a 17 MB SVG export of the same thing — and they hold the map's drawings laid out unlabelled, without the landmass and without the printed names. Version one shipped on 2026-09-15 (below); version two is the one that would let a person **drag and resize their own island** rather than mark Helen's.

**Both files are flat.** 2,347 objects at the top level, no groups, no layer names, in the Pixelmator document and the SVG alike. So a cut cannot follow the structure — there is none — and has to follow the pixels: render every object on its own, then join the ones whose ink actually touches.

**Done that way, about thirty drawings come out whole**: the river, the orange canyon, the tornado, three waves, the sharks, the octopus, the surfer, the cave, the tent, the tunnel with its rabbit, the mushrooms, the storm cloud, the storm mountains, the pond, the campfire, the mud mountain, grass-and-rock, two penguins and three rabbits. **Two regions do not come out**: the flood-and-waves group on the left (608 shapes) and the stars-forest-sunbather group in the middle (131), because those drawings genuinely overlap on the canvas. They want a hand pass, or a re-export with them moved apart — not a cleverer script.

**The rasters in the export are written twice**, once as colour and once as a greyscale `mask`, and a renderer that reads SVG masks differently draws the mask's black background instead of the transparency. Folding each pair into one RGBA image says the same thing and cannot be misread. Worth knowing before anybody looks at a preview and concludes the artwork is broken.

**The blocker is now the licence, not the artwork: the pieces are Canva elements.** Canva's Content License Agreement §9 forbids, for free and Pro content alike, incorporating content in any product "that results in a re-distribution or re-use of the content or is otherwise made available in a manner such that a person can extract or access or reproduce the content as an electronic file". A drag-and-drop library of separable images is a description of that.

**The map as published is not in question** — a flat exported design on a web page is the ordinary permitted use under §5, and that is what this site serves.

**What decides version two is a fact only Helen can look up: whether every element in the map is Free Content.** §6 grants Free Content precisely what version two needs — standalone download, use in templates, a copy posted on a web server. §3 denies it to Pro Content: "You may not copy, download or distribute the Pro Content as a standalone item." And §1 says that where a design mixes categories **the most restrictive category governs the whole design**, so a single Pro element anywhere in the map means no piece of it can ship. In Canva it is visible per element: hover, the three dots, Content source information. Some free elements are CC0 or come from Pixabay or Pexels, which is a better answer again, because those licences are ours to pass on.

**ShareAlike sharpens it rather than softening it.** Publishing under CC BY-SA 4.0 tells every reader they may adapt and redistribute what we publish, and §9 forbids sub-licensing Canva content. That tension is already present in the composed map and it is Helen's call, made. Publishing the *pieces* under the same licence would be handing on a right we do not hold, twenty times over, which is a different act and not one to slide into.

**If the answer is Pro, version two is still possible without the artwork.** What a person drags could be the twenty numbered markers and their names on a blank ground, which is ours to give away. Smaller, and not a redraw of anybody's map.

**Helen's own answer, 2026-09-16, is close to that and better than it.** A blank map; icons a person places wherever they like; and open **"?" symbols** they can fill with their own image, art or wording for an experience the twenty do not name. Her one structural instruction: **the maps should be joined by fresh water rather than kept as separate islands, "which feels neuronormative"** — bridges between islands, and boats acting like rhizome networks, so nobody's map is marooned.

**That changes what version two is for.** The old sketch let a person re-arrange *her* twenty areas. Hers lets a person add what is missing and connect to other people. It needs less of the Canva artwork, not more, which means the licence question above stops being the blocker for this design — and a "?" a reader fills in is content they own, which is a question for [privacy](pages/privacy.md) before any of it is built.

**Nothing has been cut into this repository.** The cutting pass exists as a scratch experiment and no piece, manifest or tool has been committed.

**The review packet has been updated** and now carries Helen's answer rather than the question. What is still unbuilt from her answer is the **"?" symbol**: the shapes and the twenty illustrations exist, bridges and boats exist, and a placeholder a reader fills with their own image, art or wording does not.

### There is no service worker and no offline copy
Penguin Pebbling has one. This site does not, and that is a deliberate not-yet rather than a no: **once a worker ships it lives on people's devices until something unregisters it**, so it is worth being sure of the page shapes first.

----

## Settled

### The site draws its own artwork, and uses no Canva content
Settled 2026-09-16, on Ryan's call, and it closes the licence question above rather than answering it. **Nothing the site draws for itself comes from a stock library.** Every shape in `tools/shapes.mjs` and all twenty illustrations in `tools/area-art.mjs` are Stimpunks' own work, built from circles, triangles, rounded rectangles and generated curves in the site's own tones.

**So whether Helen's elements are Free or Pro decides nothing here.** It would have decided whether her pieces could ever be published; we are not publishing them. **Her map stays exactly as she made it, reproduced unaltered** — the ordinary permitted use under Canva's §5 — and the pieces stay in her working files.

**What we gain is the right to give ours away.** CC BY-SA 4.0 tells every reader they may adapt and redistribute what we publish. That promise could never have covered somebody else's stock elements. It covers these, because we drew them.

**A recognisable rabbit is nobody's property. A particular drawing of one is.** So "our own" means drawn from scratch and never traced — not from Helen's map, and not from a stock element that happens to show the same animal. Tracing is copying with extra steps.

**The twenty illustrations are arrangements, not new drawings.** Each is a short list of shapes the builder already offers, placed and sized and turned, so an area's artwork is four or five readable lines and every part of it has already been seen to render. The palette and the illustrations cannot drift apart: a change to a shape reaches all twenty at once.

**They are not a second map.** They are pictures of the twenty ideas in our hand, for the builder's tray. **The map is Helen's** — the island, the arrangement, the wording printed on it. Putting these illustrations anywhere that speaks for the map itself, the area pages included, is a question for her before it is a commit.

### Attention Tunnels keeps our replacement wording, not Helen's suggestion

**Helen asked for an alternative to "a tunnel is cheap to stay in and expensive to re-enter"** — the word *cheap* undersells what is happening — and offered "easy to settle into and hard to leave," marked as wanting Ryan's take.

**The two say different things.** The paragraph is about the cost of *coming back after an interruption*, not the cost of leaving. So the page reads "easy to settle into and hard to get back into once you have been pulled out of it": her objection met, the meaning kept.

**Ryan settled it on 2026-09-16: the shipped text stands.** Recorded because the next person to read her note beside the page will see wording that is not hers and wonder whether it was missed. It was not. It was weighed, and the difference was the point.

### The Shark Infested Waters are drunk, not just swum in

**Helen's notes on area 13, relayed 2026-09-16:** we absorb the water and it becomes part of us; explore it through hydrofeminism; and *"we need to drink from other waters, nourishing community water vs normative waters."*

**The area used to say only that the water is around everything else.** That made neuronormativity ambient and external — weather to be got out of. It is not. It is swallowed, and it does its work from inside, which is the mechanism of internalised ableism without needing the phrase. The page now says: *you do not just swim in it, you drink it, and it becomes part of you.*

**Hydrofeminism is borrowed, not claimed.** Neimanis writes that bodies are permeable and water passes through them, so there is no clean edge where the outside stops. She is not writing about neuronormativity; applying it here is Helen's move, and `ATTRIBUTIONS.md` says so.

**The third note needed care, because as written it breaks the one rule.** "We need to drink from other waters" is an instruction to the person, and *What changes this* never instructs the person — on the one area that is explicitly about institutions, it would be the worst possible place to slip. So the paragraph states it as a condition instead: **nourishing water has to be within reach.** Not *go and find community* but *community has to exist and be reachable*, which is an environmental claim and somebody's job.

**This also resolves what the paragraph could not say before.** "Nothing a person does to themselves" was true and empty — it named no lever at all, on the one area with a politics. Other water is the lever, and most of the rest of the map is that water: rhizomatic communities, Cavendish spaces, penguin pebbling, body doubling.

**It is the same argument as her design for version two** — islands joined by fresh water rather than kept separate, "which feels neuronormative." The answer to bad water is not dry land. It is different water. Worth holding on to when version two gets built.

### A quotation from an unrecorded talk is on the page, and says so

**"Cultivating resilience becomes an act of defiance" is Nick Walker's, from a talk at the 2026 Autistic Mental Health Conference**, and there is no public video, transcript or published text of it. Recordings went to ticket holders. Helen suggested the line; she was in the room and helped organise the event.

**Every other quotation here links to the words themselves, and this one cannot.** What it links instead is [the conference page](https://neurohubcommunity.org/2026/08/09/16166/), which names Walker and the talk — *unorthodox approaches to Autistic psychological resilience*. The provenance is written down in `ATTRIBUTIONS.md` rather than left implicit, because a weaker basis that is stated is a different thing from a weaker basis that is hidden.

**It went in rather than being left out because the map's author heard it said and vouches for the wording.** The alternative was dropping a line she asked for on a technicality about media. **If a published version turns up, cite that instead.**

**Placement matters more than usual here.** *What changes this* names what the environment changes and never instructs the reader, and a bare "cultivate resilience" would break that rule in the one paragraph about burnout — the exact place the site cannot afford to read as advice. So the page says the resilience that gets trained into people is compliance under another name, and gives Walker the line that turns it round. The defiance is of the training, not a task set for the reader.

### The site's voice says "map", not "island" — except in alt text
Changed 2026-09-15, on Ryan's call. **"Island" now carries a Jeffrey Epstein association for a lot of readers**, which is not something a page about Autistic flow states should be making anybody think about.

The tagline went from *An island you can find yourself on* to **A map you can find yourself on**, and the word was replaced in every other piece of reader-facing voice: the home page's "the water it all sits in", the Pressure blurb, the Shark Infested Waters gloss, and the prose on `stories`, `about` and `neuronormative-domination`.

**Three uses were kept, all of them alt text**, and the distinction is the point: alt text describes the artwork, and the artwork *is* an island. A blind reader needs the same picture everyone else gets, and calling it a map would be describing something the image does not show. **Accuracy about a picture is not the same job as choosing our own vocabulary.**

So: the word survives only where it is describing what is drawn. Anywhere the site is speaking in its own voice, it says map. **Do not "fix" the alt text for consistency** — that would make it worse.

### The maps ship as lossless WebP, and a check proves the pixels are unchanged
Done 2026-09-15, on Ryan's call, after auditing the site against [The Website Specification](https://specification.website/spec/performance/image-optimization/), where image optimisation is **required** and says in as many words: *"PNG for photos. PNG is for graphics with sharp edges and few colours."* Both maps are full-colour illustrations, both were PNG, and together they were **742 KB** — the larger one is the front page's LCP element.

They are now a `<picture>` chain: WebP first, **the original PNG still there as the fallback**. 742 KB becomes 596 KB, and the domination map alone drops 36%.

**The PNG stays for two reasons and only one of them is old browsers.** It is the file Helen published, and it is what somebody re-using the map under CC BY-SA should be able to download. WebP is how we deliver the artwork, not what the artwork is.

**Lossless, and verified rather than asserted.** `tools/make-map-webp.py` encodes, then decodes both files back to RGBA and compares them pixel by pixel; if one byte differs it writes nothing and deletes the output. `--check` re-runs the comparison against what is committed, and `check.mjs` calls it. **A "lossless" flag is a promise from an encoder; the comparison is evidence** — and the thing being promised is that we have not altered somebody else's drawing, which `ATTRIBUTIONS.md` forbids.

**`check.mjs` also fails on a `<source>` pointing at a file that is not there.** That failure is invisible by design: the browser drops silently to the `<img>` fallback, so the page looks perfect while every visitor downloads the big PNG. Same shape as the inline-style bug — correct-looking and wrong. Both gates were tested by breaking them.

**AVIF was tried and rejected, and the reason is a trap worth writing down.** The first measurement said lossless AVIF was 231 KB and 72 KB, against WebP's 376 KB and 220 KB — dramatically better, and it was recorded here as such. **It was wrong.** Those files came from Pillow's `lossless=True`, which for AVIF silently produces *lossy* output: decoding it back and comparing to the PNG showed 2.8 million bytes altered. Pillow also accepts `matrix_coefficients=0` and ignores it, returning a byte-identical file, so the parameter that would have fixed it fails silently too.

**True lossless AVIF is bigger than the PNG, never mind the WebP.** `avifenc --lossless`, which sets the identity matrix and does decode pixel-for-pixel, gives **1,410,221 bytes** for the main map and **382,390** for the other at maximum effort `-s 0` — against WebP's 376 KB and 220 KB. Adding AVIF would have tripled the front page's largest asset. It is not in the chain and should not be added on the strength of a number nobody decoded and checked.

**Lossy AVIF is genuinely much smaller — 231 KB and 72 KB — and it is Helen's call, not ours.** It alters her artwork, which is the one thing `ATTRIBUTIONS.md` says we do not do. It is worth asking her, because 72 KB against 220 KB is a real difference for anybody on a slow connection; it is not worth assuming.

**The general lesson, and it is the same one the CSP taught: a flag is a claim, and only a comparison is evidence.** `make-map-webp.py` decodes and compares for exactly this reason, and it is what caught this.

### My Monotropic Map, version one, marks Helen's map and emits no number
Built 2026-09-15, on Ryan's call, into `stories.html` rather than a page of its own — the page already promised it, in that exact spot, under *Mark where you are*, and "Your map" in the nav already led here. A separate URL would have meant an eighth nav item or a page reachable only by a link from the page that describes it.

**The four marks are the page's own sentence, not new vocabulary.** `stories.md` has asked the same question since before any tool existed — "somewhere you are living, somewhere you pass through, somewhere that has taken over the whole map this month, or somewhere you have never been" — so the marks were lifted from it. A fifth, **Not said yet**, is the resting state, because twenty areas silently defaulting to nothing and twenty areas a person has actually considered are not the same map. `check.mjs` fails if the prose stops offering one of the four.

**No score, no type, no result — and that rules out counts.** "The moment the site emits a number it is a quiz", and *8 of 20* is a number. So the tool never tallies anything, and the way a person sees what they have not reached is that it is listed by name under *Not said yet*. `check.mjs` greps the script for a rendered count. The first version of that gate failed on the comment explaining the rule, so it strips block comments and reads the code.

**Nothing interprets the marks.** No advice is generated from them, which is the site's one rule seen from the other side: what changes a stuck state is a change to the conditions, and a web page does not know anybody's conditions. Each area in the legend links to its own page, where the environmental change is already written down by somebody who thought about it.

**The controls are real radios and work with JavaScript off.** What the script adds is remembering, the legend, the map reflecting the marks, and the print/copy/send buttons — and those buttons ship `hidden` and are revealed by the script, the way `theme.js` reveals the theme toggle, because a control that needs a script must not be visible before the script has run. With JS off a person can still fill the page in and print it, and a `noscript` note says the marks will not be remembered and points at the workbook.

**Nothing leaves the device, and the tool offers no route out at all.** No fetch, no form, `connect-src 'self'` and `form-action 'none'` in `_headers`. A *Send it to us* button that built a `mailto:` was in the first version and **was taken out on Ryan's call before it ever shipped**: copy puts the legend on the clipboard and the person decides what to do with it, which is one fewer thing the page presumes about them, and it means the page never addresses anybody. `check.mjs` fails on a `fetch`, `XMLHttpRequest`, `sendBeacon`, `WebSocket` or form `action` appearing in the tool.

**Two things were got wrong in the first pass and are worth keeping written down.** *Never been* was drawn as a faded marker, which made a real answer look like an unanswered one — it now recedes by dropping the area's colour for the muted grey and going dotted, rather than by fading until it reads as a rendering fault on somebody else's artwork. And *Not said yet*, being checked on all twenty at load, was styled as emphatically as a real mark, so the tool opened looking like twenty confident answers nobody had given. Both were only visible by looking at the thing.

**The vocabulary is written down once.** `my-map.js` reads every label back out of the DOM that `build.mjs` generated, so there is no second list to fall out of step with the first.

### Atkinson Hyperlegible is shipped, and the check makes sure it stays shipped
Done 2026-09-15, on Ryan's call. **The face was named in `--font` from the first commit and no font file was ever served**, so for the site's whole first day every reader got the system stack. That is the failure mode worth naming: a named typeface looks identical to a shipped one in every local test, because the fallback is a real font and the page looks fine.

Four faces, complete, from the TrueType published at google/fonts, converted to WOFF2 and changed in no other way. **Not subsetted** — 342 glyphs each, about 97 KB for the set, and no character can quietly lose its shape because a subsetter did not know the site used it. `/fonts/*` was already cached `immutable` for a year in `_headers`, and `font-src 'self'` already allowed it; **the CSP did not need editing**, which is this repository's test for whether something new belongs.

**All four faces are declared even though bold italic is unused today, because declaring a face costs nothing.** A browser fetches only the faces a page actually needs, so the unused one is never downloaded — measured, not assumed: on an area page the other three report `loaded` and bold italic reports `unloaded` and is never requested. The alternative is a browser synthesising bold italic later by smearing the regular, which on a face chosen for legibility defeats the point of choosing it.

**`font-display: swap`, not `block`.** A reader gets the system stack for a few hundred milliseconds and then the real face. The alternative is invisible text, and invisible text on an accessibility site is not a trade worth making. Only the regular face is preloaded, because it is the only one every page uses, and the preload carries `crossorigin` so it coalesces with the stylesheet's request instead of fetching the file twice.

**The gate checks the property, not the file list**: `check.mjs` fails if the family named in `--font` has no `@font-face` serving it, if any referenced font file is missing, if a page preloads one that does not exist, or if `fonts/OFL.txt` stops travelling with the font — which the SIL OFL requires. All four failure modes were tested by breaking them.

**Known and accepted: the font has no ← or → glyph.** The previous/next links at the foot of every area page use both, so those two characters render from the fallback stack while the words beside them do not. They are arrows and they look like arrows. Recorded so nobody rediscovers it as a bug.

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
The MQ is a validated instrument by Garau et al. with 47 items written by Autistic adults, shared under CC BY-NC-SA. Copying somebody else's validated measure would invite readers to treat our numbers as theirs.

**Where we point changed on 2026-09-15, on Ryan's call**, from `dlcincluded.github.io/MQ` to [pa11erns.com/psychometrics/mq](https://pa11erns.com/psychometrics/mq/). The wording around every one of those links changed with it, and that is the part worth reading twice: two of them said the link went to the measure's **own authors** — *hosted by its own authors*, *a home of its own* — and the new host is a third party that implements the MQ and cites Garau et al. rather than being them. **Swapping the URL under that sentence would have pinned the authors' name to a site that is not theirs**, which is the Dorothy Tennov error in `ATTRIBUTIONS.md` exactly, committed a second time. The links now say the measure is Garau et al.'s and the hosting is not.

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
