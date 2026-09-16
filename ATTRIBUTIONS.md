# Attributions

**The map is Helen Edgar's.** Everything else here sits on top of that fact.

## The two maps

| Work | By | Licence |
|---|---|---|
| *Map of Monotropic Experiences* (2024) | **Helen Edgar**, Autistic Realms | CC BY-SA 4.0 |
| *Autism &amp; The Map of Neuronormative Domination* (2025) | **Helen Edgar** with Ryan Boren, Chelsea Adams and Norah Hobbs | CC BY-SA 4.0 |

Both artworks are reproduced here unaltered. The hotspot layer is positioned **over** the image with CSS; it does not modify, recolour, crop or re-set the artwork. If a future change would alter either image, that is Helen's call and not ours.

## The site's own drawings are not Helen's, and not anybody's stock

The shapes in the map builder and the twenty area illustrations are **Stimpunks' own work**, drawn from scratch in `tools/shapes.mjs` and arranged in `tools/area-art.mjs`. They are CC BY-SA 4.0 like the rest of this site: take them, change them, pass them on.

They are **not** traced from Helen's map and **not** derived from the Canva elements it is composed of — which is exactly what makes them ours to license. See `DECISIONS.md`.

The training, the workbook and the further development of the map are a collaboration between **Helen Edgar (Autistic Realms)** and the **Stimpunks Foundation** — Ryan Boren, Norah Hobbs and Chelsea Adams.

## The twenty areas are twenty other people's words

This is the part that is easy to get lazy about and the part that matters most. The map names things other people named. Every area page credits its originator and links to their own words.

| # | Area | Named by |
|---|---|---|
| 1 | Attention Tunnels | Fergus Murray |
| 2 | Penguin Pebbling Cove of Friendship | Helen Edgar |
| 3 | Tendril Theory | Erin Human (@EisforErin) |
| 4 | Mountains of Ruminating Thoughts | Dusty Chipura |
| 5 | Cyclones of Unmet Needs | Cassidy et al. |
| 6 | Rabbit Holes of Research | Helen Edgar (the area; *down the rabbit hole* is a shared idiom) |
| 7 | Infodump Canyon | Helen Edgar (the area; *infodump* is community usage) |
| 8 | Rhizomatic Communities | Helen Edgar |
| 9 | River of Monotropic Flow States | Fergus Murray |
| 10 | Campsite of Cavendish Spaces | Ryan Boren |
| 11 | Meerkat Mounds | Tanya Adkin &amp; David Gray-Hammond |
| 12 | Riverbanks of Monotropic Time | Helen Edgar |
| 13 | Shark Infested Waters | Damian Milton (double empathy problem) |
| 14 | Beach of Body Doubling | Jessica McCabe |
| 15 | Burnout Whirlpools | Dora Raymaker |
| 16 | Panic Hills of Low Object Permanence | Wenn Lawson |
| 17 | Forest of Joy, Awe and Wonder | Amelia Blackwater |
| 18 | Lake of Limerence | Dorothy Tennov (definition quoted from Psychology Today) |
| 19 | Tides of the Sensory Sea | Janae Elisabeth |
| 20 | Sudden Storms of Unexpected Events | Kieran Rose |

**An area with no single originator says so rather than leaving a blank**, and never defaults to our name.

**`who` is the source of the quoted definition; `coiner` is the person who named the thing** when that is somebody else. Limerence is Dorothy Tennov's word, quoted here from Psychology Today. Do not collapse them — pinning a person's name to a link that is not theirs is exactly the error this file exists to prevent.

## Four attributions were wrong on the first pass

Recorded because the failure is instructive, not because it is interesting. On 2026-09-15 the first draft of `areas.mjs` carried **four invented names**: *Jaime A. Heidel* for autistic joy, *Orion Kelly* for unexpected events, *Jen Elisabeth* for the sensory sea, and *Dorothy Tennov* pinned to a Psychology Today URL that is not hers.

Every one came from filling in a first name that our own published page gave only as a surname. **A surname you can source beats a full name you cannot.** They were caught by opening the sources: the YouTube video is *An Introduction to Monotropism* by The Autistic Advocate — Kieran Rose — and the Medium graphics are Janae Elisabeth's.

**Blackwater's first name came from Helen, not from a guess.** The byline is not on the live article on themighty.com, and the site carried the surname alone until 2026-09-16, when Helen Edgar gave the full name and the profile it belongs to: **Amelia Blackwater**, [themighty.com/u/amelia-blackwater](https://themighty.com/u/amelia-blackwater). That is the rule working — a surname you can source held the page until somebody who knew could fill it in.

## Two areas are Helen's own, and now say so

**Rabbit Holes of Research and Infodump Canyon were recorded as having no single originator.** Both are Helen Edgar's own additions to the map; she said so on 2026-09-16. *Down the rabbit hole* is a shared English idiom and *infodump* is community usage, so the **definitions** quoted on those two pages are still general ones rather than quotations from her — `who` stays null and `coiner` is Helen Edgar. The page says exactly that, because crediting her with a sentence she did not write would be the same error in the other direction.

## The training slides

The sixteen slides on [the training page](https://monotropicmap.org/training) are rendered from *Training: Map of Monotropic Experiences with presenter notes*, the PDF Autistic Realms publishes openly. They are **Helen Edgar's and Stimpunks' own deck**, reproduced unaltered — cropped from the page, resized, and converted to WebP, with nothing added, removed or recoloured.

`tools/slides.mjs` carries hand-written alt text for every one. **Alt text is content here, not a compliance box**: it is the slide for anyone who cannot see it, and `validate()` refuses one under 80 characters.

### One slide carries somebody else's artwork

The **Intersectionality and Double Empathy** slide reproduces the **Wheel of Power and Privilege by [Sylvia Duckworth](https://sylviaduckworth.com/)**, itself adapted from ccrweb.ca. Her handle is printed on the wheel and stays visible in our crop — **do not crop it out, and do not reproduce that wheel anywhere on this site without it.**

The slide also credits **Kimberlé Crenshaw**, who coined *intersectionality* in her essays of 1989 and 1991.

## The typeface

The site is set in **Atkinson Hyperlegible**, by the **[Braille Institute of America](https://brailleinstitute.org/freefont)**. The font's own metadata credits **Braille Institute, Applied Design Works, Elliott Scott, Megan Eiswerth, Linus Boman and Theodore Petrosky** — listed here exactly as it lists them, because working out which of those names belongs to which organisation would be guessing, and guessing is what the section above this one exists to prevent.

It is **named after the founder of the Braille Institute** — which is what the font's published description says, and it does not give his name, so neither do we. It is drawn for low vision: the letterforms are deliberately pulled apart so b and d, i and l, and 0 and O cannot be confused.

**SIL Open Font License 1.1, Copyright 2020 Braille Institute of America, Inc.** The OFL requires the licence travel with the font, so it ships as `fonts/OFL.txt` and `tools/check.mjs` fails if it ever stops doing so.

The four woff2 files are converted from the TrueType fonts published at [google/fonts](https://github.com/google/fonts/tree/main/ofl/atkinsonhyperlegible), **format-converted and changed in no other way** — not subsetted, all 342 glyphs intact. No Reserved Font Name is declared, so the family keeps its name.

**It is served from this origin and never fetched from a third party.** `font-src 'self'` did not need editing to ship it, which is the test this repository applies to anything new.

## The theory

Monotropism was developed by **Dinah Murray**, **Mike Lesser** and **Wenn Lawson** (Murray, Lesser &amp; Lawson, 2005). The canonical home of the theory is **[monotropism.org](https://monotropism.org/)**, maintained by **Fergus Murray**.

The **Monotropism Questionnaire** is by **Garau et al. (2023)**, shared under CC BY-NC-SA. We point people to [pa11erns.com/psychometrics/mq](https://pa11erns.com/psychometrics/mq/), which hosts it and cites the authors. **The measure is theirs and the hosting is somebody else's again — we copy neither**, and the wording here says "hosts it" rather than "their own home" for exactly that reason.

Intersectionality is **Kimberlé Crenshaw's**. The double empathy problem is **Damian Milton's** (2012).

## Quoted definitions

The definitions on the area pages are quoted from their originators or from the Stimpunks glossary, and each one is credited on the page with a link. They are short, attributed, and used for comment and education. **Original capitalization and wording are preserved in quotes even where they differ from house style** — several sources write "autistic" lowercase, and correcting someone else's words is not ours to do.

### Area 13's gloss was our prose under somebody else's name

**The Shark Infested Waters definition is a summary this site composed**, out of neuronormativity, behaviourism and the double empathy problem. Only the last of those three is **Damian Milton's**, and none of the sentences are his. Until 2026-09-16 the page printed it inside a `<blockquote>` with the credit *"Damian Milton — in their own words"* and a link to his Autscape handout, which reads as a quotation and is not one.

**Fixed:** the passage is no longer marked up as a quotation, and the credit now says what it is — a summary written here, with the double empathy problem attributed to Milton and linked. `glossNote` in `areas.mjs` carries the wording; it is the same discipline as `who` and `coiner`, applied to the definition instead of the credit.

## The water, and where the frame comes from

**Area 13 borrows hydrofeminism from [Astrida Neimanis](https://doi.org/10.5040/9781474275415)** — *Bodies of Water: Posthuman Feminist Phenomenology* (Bloomsbury, 2017), and the earlier essay *"Hydrofeminism: Or, On Becoming a Body of Water"* in **Undutiful Daughters: New Directions in Feminist Thought and Practice**, eds. Gunkel, Nigianni and Söderbäck (Palgrave Macmillan, 2012).

**Neimanis is not writing about neuronormativity**, and the page does not suggest otherwise. What is borrowed is the claim that bodies are permeable and water passes through them, so there is no clean edge where the outside stops. **Applying that to the water this map is drawn in is Helen Edgar's move, made in her review of 2026-09-16**, and the credit for the application belongs to her.

### One quotation has no public recording

**Burnout Whirlpools quotes Nick Walker: "Cultivating resilience becomes an act of defiance."** It is from a talk — *unorthodox approaches to Autistic psychological resilience* — given at the **2026 Autistic Mental Health Conference**, held online and in Brighton on 14–16 August 2026 by [NeuroHub Community](https://neurohubcommunity.org/2026/08/09/16166/).

**There is no public video, transcript or published text of it.** Recordings went to ticket holders. What can be linked is the conference page that names Walker and the talk, and that is what the page links.

**The wording rests on Helen Edgar, who was in the room and helped organise the event.** That is recorded here rather than left implicit, because it is a weaker basis than every other quotation on this site — those link to the words themselves. It is on the page because the map's author heard it said and vouches for it, not because we found it written down. **If a published version turns up, cite that instead.**

## Text that is ours

The **"What changes this"** paragraph on each area page is new text written for this site, in the Stimpunks Editorial Voice. It is not quoted from anyone, and it follows one rule: **it names what the environment changes, never what the person should do.**

Drafted by Stimpunks, for Helen's review. See `DECISIONS.md`.
