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

### Open, and said out loud

- **The marking tool does not exist yet.** *My Monotropic Map* — mark each area, get a legend you can print or send — is designed and not built. The page says so rather than pretending.
- The twenty *What changes this* paragraphs are **ours, and Helen has not reviewed them**.
- No offline copy, and the typeface the design asks for is not yet shipped.

### Stopped saying "island"

The tagline was *An island you can find yourself on*. It is now **A map you can find yourself on**, and the word is gone from the rest of the site's voice — the association it now carries is not one a page about Autistic flow states should be putting in anybody's head.

It survives in one place only: the **alt text** describing the artwork, because the artwork *is* an island and a blind reader should get the same picture everyone else does. Describing a picture accurately is a different job from choosing our own words.

### This page exists

All of our sites publish a changelog. This was the one that did not.

The full record, including what was decided and why, is in [DECISIONS.md](https://github.com/Stimpunks/Monotropic-Map/blob/main/DECISIONS.md). Credits are in [ATTRIBUTIONS.md](https://github.com/Stimpunks/Monotropic-Map/blob/main/ATTRIBUTIONS.md). The whole site is [open source](https://github.com/Stimpunks/Monotropic-Map), CC BY-SA 4.0.
