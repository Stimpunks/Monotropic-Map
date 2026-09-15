# Decisions

What was chosen while building this site, and what is still open. Read before reopening any of it.

## Open

### The domain is not registered yet
`monotropicmap.org` was available on 2026-09-15 and is the chosen name. **Nobody has bought it.** Until somebody does, the canonicals, `og:url`, `sitemap.xml` and `llms.txt` all point at an address that does not resolve. `tools/check.mjs` deliberately skips our own origin in the external link check for exactly this reason — see the comment there — so **that check going green is not evidence the domain exists.**

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

### It is one site holding both maps, not two sites
Decided 2026-09-15. The island on its own reads as a personality quiz — *here is your Burnout Whirlpool, chart a course out* — which inverts the argument, because the whirlpool is manufactured. *Autism &amp; The Map of Neuronormative Domination* is therefore structural rather than an appendix: its own page, its own nine hotspots, linked from every stuck-state area.

**The rule that follows from it, and that every area page obeys: what changes a stuck state is a change to the conditions, never an instruction to the person.** "Rest more" is the failure mode. If a future contribution cannot be written that way, the problem is the contribution.

### The nine zones of the second map are anchors, not pages
Every zone there is a force rather than a place you can be. Nine separate URLs would let a reader meet one in isolation, which is the move the map argues against. They stay on one page.

### The list view is a front door, not a fallback
Both views are in the markup and both are visible with no JavaScript; `map.js` only collapses them into a switcher once it is certain it can switch back. A picture-only navigation excludes screen reader users, anyone who cannot point precisely, and anyone on a small screen — which is a large share of the people this map is *for*.

`tools/check.mjs` enforces this: it fails if `#view-list` ships with a `hidden` attribute, and fails if the switcher is *not* hidden, since a control that cannot work without JavaScript must not be visible without it.

**On screens under 700px the picture starts collapsed.** At 350px the labels printed on the artwork are not legible and no marker size fixes that. The switcher is right there; this is a default, not a decision made for anyone.

### Hotspots go over the artwork; the artwork is never altered
The markers are a CSS layer positioned by percentage over Helen's original PNG. No redraw, no recolour, no crop, no re-set. This keeps the CC BY-SA attribution clean and keeps a visible change to someone else's work out of scope.

The markers were **too big on the first pass** and swallowed the island — twenty 44px circles over a 350px image. They are now 1.9rem with an invisible `::after` extending the hit area past the 44px minimum, so the target is large while the badge is small.

### The licence is CC BY-SA 4.0 and cannot become CC BY-NC-SA
The map is BY-SA. **ShareAlike forbids adding restrictions, and NonCommercial is an added restriction**, so an NC variant is not a compatible licence for anything derived from this map — we could not relicense it that way even if we wanted to.

This is written down because the instinct will be to match [Penguin Pebbling](https://penguinpebbling.app/), which adopted CC BY-NC-SA 4.0 on 2026-09-15. Different work, different origin. **Do not copy its licence header into this repository.**

### No Monotropism Questionnaire here
The MQ is a validated instrument by Garau et al. with 47 items written by Autistic adults. It has a home of its own. Copying somebody else's validated measure would invite readers to treat our numbers as theirs.

### No score, no type, no result, no account
This is a map, not an assessment. The moment the site emits a number it is a quiz.

### The site drives to Helen's shop rather than hosting the paid downloads
The training pack and the workbook are paid downloads on autisticrealms.com — free to individuals and anyone with limited funds, with a suggested donation for organisations. Hosting copies here would take income from a Disabled creator, which is the thing we say we are against.

### Node, dependency-free, no build step
Matches [Star Stuff](https://starstuff.earth/) and [Queering Earth](https://queering.earth/), the two other joint Stimpunks and Autistic Realms sites. Penguin Pebbling's tools are Python; that is a game, this is a reference site, and the sibling-document sites are the pattern to follow.

**Nothing here ever needs `npm install`.**

### `tools/md.mjs` hard-errors on anything it does not understand
A page that quietly loses a paragraph still looks fine. That is precisely why it must not be possible. Four-dash rules are house style and three dashes are an error, not a rule.
