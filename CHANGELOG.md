# Changelog

What has changed here, newest first. This is the site's own account of itself — what was built, what was got wrong, and what is still missing.

We publish the mistakes too. A changelog that only lists wins is an advertisement.

----

## 2026-09-15 — the site went live

**[monotropicmap.org](https://monotropicmap.org/) exists.** The Map of Monotropic Experiences has its own home, built on Helen Edgar's go-ahead with joint Stimpunks and Autistic Realms attribution settled first.

### What is here

- **Both maps, and you can click them.** The map's twenty areas, and the nine zones of *Autism &amp; The Map of Neuronormative Domination*. The markers sit **over** Helen's original artwork — nothing about the pictures was redrawn, recoloured or cropped.
- **Twenty area pages**, one for each place on the map, **each crediting the person who named it** and linking to their own words. This is a map of other people's coinages and the credit is the content, not a footnote.
- **A plain-language definition on every area page, before the quoted one.** The glossary entries these come from are collections of academic quotations — useful, and not what somebody meeting an idea for the first time should have to read first. They average seven words a sentence. No sentence runs over fifteen.
- **A numbered key under the map**, so the picture can orient you on its own: the marker on the artwork, the name in the key, the same number on both.
- **The frame is structural, not an appendix.** The second map has a page of its own, and every area page follows the rule it implies: *what changes a stuck state is a change to the conditions, never an instruction to the person.* You will not find "rest more" here.
- **The whole free training**, about 4,000 words with presenter notes, all sixteen slides, and all eight *Consider* reflection prompts. The training pack and workbook stay at [Autistic Realms](https://autisticrealms.com/product/training-with-notes-the-map-of-monotropic-experiences/) — buying them there is what funds this work.
- **The community story project**, and the questions for marking your own map.
- **No accounts, no analytics, no tracking, no third parties.** See [privacy](privacy.html).

### The front page needs no JavaScript at all

The map, its key, and every name on it are in the page before any script runs. Not as a degraded fallback — as the only mode there is. The page loads nothing but a light/dark toggle.

**It took two goes.** The first version was a picture/list switcher, built so the list would be a real front door rather than a fallback. The principle was right and the mechanism undermined it: making the two mutually exclusive put the twenty names in the view you were *not* looking at, so with the picture showing, an area was a numbered circle and nothing else.

The key fixed that, and the switcher then had nothing left to do. It is gone, and so is the script behind it.

### Four credits were wrong, and are fixed

The first draft of the area pages carried **four invented names** — attributions where our own published page gave only a surname and the gap got filled in rather than looked up. Every one was wrong.

They were caught by opening the sources, and corrected: the training video is **Kieran Rose's**, and the sensory-sea graphics are **Janae Elisabeth's**. A surname you can source beats a full name you cannot.

One is still incomplete: the Forest of Joy, Awe and Wonder credits **Blackwater**, and the byline is not on the live article. If you know it, [tell us](mailto:hello@stimpunks.org).

### A bug that only existed once it was public

The site sends a strict security policy that forbids inline styles. The map markers were positioned with exactly that — so on the first live deploy **every marker on both maps stacked in the top-left corner**, while looking perfect on the machine it was built on, because a local server sends no such policy.

Fixed, and the build now refuses to ship an inline style at all. Recorded here because *verify in production, not on your own machine* is the kind of lesson that is cheap to write down and expensive to relearn.

### Said "map", stopped saying "island"

The site's tagline was *An island you can find yourself on*. It is now **A map you can find yourself on**, and the word is gone from the rest of the site's voice: the association the word now carries is not one a page about Autistic flow states should be putting in anybody's head.

It survives in one place only — the **alt text** describing the artwork, because the artwork *is* an island and a blind reader should get the same picture everyone else does. Describing a picture accurately is a different job from choosing our own words.

### My Monotropic Map: you can mark the map now

The tool the *Your map* page has been describing since launch is built. Go through the twenty areas and say what each is for you right now — **living here, passing through, taken over the map, never been** — and the map above fills in as you go. You get a legend you can print or copy.

Those four are not new words. They are the sentence that page has used from the start, which is where they came from.

**There is no score, no type and no result, and that includes counts.** The tool will never tell you that you marked eight of twenty, because eight of twenty is a number and a number would make this a quiz. What you have not got to yet is listed under *Not said yet*, by name. Nothing on the page interprets your marks or offers you advice about them — each area links to its own page, where what the *environment* can change is already written down.

**Nothing you mark leaves your device, and the tool has no way to send it anywhere.** There is no account, no upload, and no request to anywhere — the page is not permitted to make one, and there is no button that would want to. Copying the legend puts it on your clipboard, and what happens to it after that is entirely yours. Clearing your browser data clears your marks; there is nothing on our side to delete.

**It works with JavaScript switched off**, because the twenty controls are ordinary radio buttons. What a script adds is remembering your marks between visits, assembling the legend, and the print and copy buttons. Without one you can still fill the page in and print it, and the page says so rather than silently doing less.

The [workbook](https://autisticrealms.com/product/my-monotropic-map-workbook/) still does this on paper and in far more depth. This is the five-minute version.

### The typeface the design asked for is now actually shipped

**For the whole of the site's first day, `Atkinson Hyperlegible` was named in the stylesheet and no font file was ever served**, so every reader quietly got the system stack instead. Naming a face costs nothing and proves nothing. The page looked fine to everybody testing it, which is exactly why it lasted.

It is now served from this origin: four faces, about 97 KB all told, cached for a year. **Atkinson Hyperlegible is drawn for low vision** — the letterforms are pulled apart so that b and d, i and l, and 0 and O cannot be mistaken for one another — and it is the reason the face was asked for in the first place.

**Nothing is fetched from a third party to do it.** The files are ours to serve, `font-src 'self'` is unchanged, and the CSP did not need editing — which is the test this repository applies to anything new.

The font is [Braille Institute of America's](https://brailleinstitute.org/freefont), under the SIL Open Font License, and **the licence ships in `fonts/OFL.txt` beside it because the licence requires that**. It was converted from the published TrueType to WOFF2 and changed in no other way — no subsetting, all 342 glyphs — so no character quietly loses its shape.

**`tools/check.mjs` now fails if the face is named and not served**, if any font file referenced is missing, or if the licence stops travelling with it. The bug that lasted a day cannot last a second one.

One thing it does not cover: **the font has no ← or → glyph**, and the previous/next links at the foot of each area page use both. Those two characters fall back to the system stack. They are arrows; they look like arrows.

### Open, and said out loud

- **The marking tool marks our map, not yours yet.** Version one is on [your map](stories.html). Version two would let you drag and resize your own island, and it needs each area as a separate drawing — which may not exist. That is Helen's to answer.
- The twenty *What changes this* paragraphs are **ours, and Helen has not reviewed them**.
- No offline copy yet. **Once a service worker ships it lives on people's devices until something unregisters it**, so it is worth being sure of the page shapes first.

### This page exists

All of our sites publish a changelog. This was the one that did not.

The full record, including what was decided and why, is in [DECISIONS.md](https://github.com/Stimpunks/Monotropic-Map/blob/main/DECISIONS.md). Credits are in [ATTRIBUTIONS.md](https://github.com/Stimpunks/Monotropic-Map/blob/main/ATTRIBUTIONS.md). The whole site is [open source](https://github.com/Stimpunks/Monotropic-Map), CC BY-SA 4.0.
