/**
 * review.mjs — the review packet for the forty passages that are ours, not Helen's.
 *
 * DERIVED, never authored. Every passage here is read out of `areas.mjs`, because a
 * packet with the forty passages retyped into it is a fortieth-and-first copy that
 * starts drifting the moment either side is edited — and drift in *this* file would be
 * the worst kind: Helen reviewing wording the site no longer carries, or approving
 * wording it never carried. Edit `areas.mjs`, re-run this, send the new packet.
 *
 * WHAT IS UNDER REVIEW IS EXACTLY TWO FIELDS. `plain` and `helps` are Stimpunks' words
 * sitting on Helen Edgar's map, and she has reviewed neither (`DECISIONS.md`). `gloss`,
 * `who` and `label` are hers or somebody else's and appear here only as context, which
 * is why the page marks the two apart rather than running all five together: a reviewer
 * who cannot tell whose sentence she is reading cannot review it.
 *
 *   node tools/review.mjs            the packet, as an Artifact page body (stdout)
 *   node tools/review.mjs --md       the same packet as Markdown, to print or email
 *
 * THE HTML IS A PAGE BODY, NOT A DOCUMENT. No doctype, no <html>, no <body> — the
 * Artifact host wraps it. That is also why it carries its own <style> rather than
 * linking `monotropic-map.css`: the packet has to be readable somewhere that is not
 * this origin. The tokens are copied from that stylesheet, values and all, so the
 * packet looks like the site it is asking about.
 *
 * `esc` and `plain` MIRROR `build.mjs` and must keep mirroring it. `esc` is
 * entity-aware on purpose: the prose fields in `areas.mjs` store `&amp;` as their
 * literal content, so a naive escape would show a reviewer "Joy, Awe &amp; Wonder".
 * They are copied rather than imported because `build.mjs` writes files on import.
 */
import { AREAS, STATES, validate } from './areas.mjs';

const MD = process.argv.includes('--md');

const esc = (s) => String(s).replace(/&(?![a-zA-Z]+;|#\d+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plain = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d)).replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();

/* The numbers DECISIONS.md quotes, recomputed here rather than repeated, so the packet
   cannot tell Helen the text is short if somebody has since made it long. */
function measure() {
  let words = 0, sentences = 0, longest = 0;
  for (const a of AREAS) {
    const s = a.plain.split(/(?<=[.!?])\s+/).filter(Boolean);
    sentences += s.length;
    words += a.plain.trim().split(/\s+/).length;
    longest = Math.max(longest, ...s.map((x) => x.trim().split(/\s+/).length));
  }
  return { words, sentences, avg: (words / sentences).toFixed(1), longest };
}

/** Who the quoted definition belongs to, said the way the area page says it. */
function credit(a) {
  if (!a.who) return 'A shared community coinage with no single originator.';
  if (a.coiner) return `Named by ${a.coiner}. Definition quoted from ${a.who.name}.`;
  return `${a.who.name}, in their own words.`;
}

const m = measure();
const problems = validate();

/* ---- Markdown ------------------------------------------------------------ */
if (MD) {
  const L = [];
  L.push('# Forty Passages for Helen');
  L.push('');
  L.push('Twenty *In plain words* definitions and twenty *What changes this* paragraphs, from the area pages of [monotropicmap.org](https://monotropicmap.org/). These forty passages are Stimpunks\' words on your map, and you have not seen them yet.');
  L.push('');
  L.push('Everything in a quotation below is **not** under review — it is there so each passage can be read next to the definition it sits under.');
  L.push('');
  L.push('----');
  L.push('');
  L.push('## The rule every "What changes this" paragraph follows');
  L.push('');
  L.push('**It names what the environment changes, never what the person should do.** "Rest more" is the failure mode. A Burnout Whirlpool is manufactured, so the sentence has to point at the conditions that made it. If one of these forty reads like advice to the reader, that is the bug we are asking you to find.');
  L.push('');
  L.push('## The constraint every "In plain words" definition is held to');
  L.push('');
  L.push(`Short sentences, one idea each, everyday words — the shape the [Autistic Self Advocacy Network (ASAN)](https://autisticadvocacy.org) sets out. As it stands: **${m.words} words over ${m.sentences} sentences, ${m.avg} words a sentence, longest ${m.longest}.**`);
  L.push('');
  L.push('The site refuses to build a definition that averages over 15 words a sentence or contains one over 18, so a rewrite has to stay short. **No script can certify Easy Read** — that takes a focus group of people with intellectual and developmental disabilities. The numbers only say the text is short.');
  L.push('');
  L.push('## What a useful answer looks like');
  L.push('');
  L.push('Per passage: **keep**, **change** (your words, if you have them), or **cut**. "This is not how I would say it" is a complete and useful answer on its own — it is your map.');
  L.push('');
  L.push('----');
  L.push('');
  for (const a of AREAS) {
    L.push(`## ${a.n}. ${plain(a.label)}`);
    L.push('');
    L.push(`*${STATES.get(a.state).name}*`);
    L.push('');
    L.push('**In plain words** — ours, under review');
    L.push('');
    L.push(plain(a.plain));
    L.push('');
    L.push('> ' + plain(a.gloss));
    L.push('>');
    L.push('> — ' + plain(credit(a)));
    L.push('');
    L.push('**What changes this** — ours, under review');
    L.push('');
    L.push(plain(a.helps));
    L.push('');
    if (a.who) L.push(`Source: <${a.who.url}>`);
    L.push(`Glossary: <${a.stimpunks}>`);
    L.push('');
  }
  L.push('----');
  L.push('');
  L.push('## The three questions, answered 2026-09-16');
  L.push('');
  L.push('**1. Blackwater\'s first name.** Answered: **Amelia Blackwater**, <https://themighty.com/u/amelia-blackwater>. Area 17 now carries the full name.');
  L.push('');
  L.push('**2. Two areas had no named originator.** Answered: **Rabbit Holes of Research and Infodump Canyon are both yours.** Both now say so. The definitions quoted on those two pages are still general ones rather than your words, so the page credits you with the area and not with the sentence.');
  L.push('');
  L.push('**3. Per-area artwork.** Answered, and superseded by your own design for version two: a blank map, icons a person places where they like, open "?" symbols they fill with their own image, art or wording, and the maps joined by fresh water with bridges and boats rather than left as separate islands. Recorded in `DECISIONS.md`; nothing is built yet.');
  L.push('');
  L.push('**One question is open in their place.** The map is composed of Canva elements, and Canva\'s licence turns on whether every one of them is Free Content rather than Pro. It is visible per element in Canva: hover, the three dots, Content source information. A single Pro element anywhere governs the whole design.');
  L.push('');
  if (problems.length) {
    L.push('----');
    L.push('');
    L.push('## Generated from a source that does not currently validate');
    L.push('');
    for (const p of problems) L.push(`- ${p}`);
    L.push('');
  }
  process.stdout.write(L.join('\n') + '\n');
  process.exit(0);
}

/* ---- the packet page ----------------------------------------------------- */
const contents = AREAS.map((a) => `      <li class="tone-${a.state}"><a href="#area-${a.slug}"><span class="c-n">${a.n}</span>${a.label}</a></li>`).join('\n');

const blocks = AREAS.map((a) => `    <article class="area tone-${a.state}" id="area-${a.slug}">
      <header class="area-h">
        <p class="area-n">${a.n}</p>
        <div>
          <h3>${a.label}</h3>
          <p class="area-state">${esc(STATES.get(a.state).name)}</p>
        </div>
      </header>

      <div class="ours">
        <p class="ours-l">In plain words</p>
        <p class="ours-plain">${a.plain}</p>
      </div>

      <blockquote class="theirs">
        <p>${a.gloss}</p>
        <cite>${a.who ? `${a.who.name}, in their own words` : 'A shared community coinage with no single originator'}${a.coiner ? ` — named by ${a.coiner}` : ''}</cite>
      </blockquote>

      <div class="ours">
        <p class="ours-l">What changes this</p>
        <p>${a.helps}</p>
      </div>

      <p class="srcs">${a.who ? `<a href="${esc(a.who.url)}" rel="noopener">Source</a> · ` : ''}<a href="${esc(a.stimpunks)}" rel="noopener">Glossary</a> · <a href="https://monotropicmap.org/${a.slug}" rel="noopener">The page as it stands</a></p>
    </article>`).join('\n\n');

process.stdout.write(`<title>Forty Passages for Helen</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap">
<style>
/* Tokens copied from monotropic-map.css, values and all — the packet should look like
   the site it is asking about. Light is the bare :root; dark is redefined twice so an
   explicit choice wins in both directions and the un-stamped system state still works. */
:root {
  --sand: #f6efe2; --paper: #fffdf8; --ink: #1d2b32; --ink-soft: #4a5f68;
  --rule: #ddd0b8; --sea: #0b6b82; --sea-wash: #e3f1f4;
  --bg: var(--sand); --card: var(--paper); --fg: var(--ink); --fg-soft: var(--ink-soft);
  --line: var(--rule); --accent: var(--sea); --accent-fg: #fff; --wash: var(--sea-wash);
  --flow: #0b6b82; --social: #7a5a17; --stuck: #8a3324; --pressure: #5b3a72;
  --measure: 34rem;
  --font: "Atkinson Hyperlegible", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #0e1a20; --card: #152630; --fg: #e9f1f3; --fg-soft: #a9c0c8;
    --line: #2b4450; --accent: #6fc6dd; --accent-fg: #06212b; --wash: #14313c;
    --flow: #6fc6dd; --social: #e0b85c; --stuck: #f09a86; --pressure: #c3a0dc;
  }
}
:root[data-theme="dark"] {
  --bg: #0e1a20; --card: #152630; --fg: #e9f1f3; --fg-soft: #a9c0c8;
  --line: #2b4450; --accent: #6fc6dd; --accent-fg: #06212b; --wash: #14313c;
  --flow: #6fc6dd; --social: #e0b85c; --stuck: #f09a86; --pressure: #c3a0dc;
}

* { box-sizing: border-box; }
body {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: var(--font); font-size: 1.0625rem; line-height: 1.6;
  padding-block: 3rem 4rem; padding-left: 1.25rem; padding-right: 1.25rem;
}
.wrap { max-width: 44rem; margin: 0 auto; }
h1, h2, h3 { text-wrap: balance; line-height: 1.2; }
h1 { font-size: clamp(1.9rem, 5vw, 2.6rem); margin: 0 0 .5rem; letter-spacing: -0.015em; }
.stand { font-size: 1.15rem; color: var(--fg-soft); max-width: var(--measure); margin: 0 0 2.5rem; }
.stand strong { color: var(--fg); }
a { color: var(--accent); text-underline-offset: 0.15em; }
:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }

.eyebrow {
  font-family: var(--mono); font-size: .75rem; text-transform: uppercase;
  letter-spacing: .1em; color: var(--fg-soft); margin: 0 0 .4rem;
}

/* The framing notes. Quiet, bordered, not cards — they are read once. */
.note { border-top: 1px solid var(--line); padding-block: 1.5rem; max-width: var(--measure); }
.note h2 { font-size: 1.15rem; margin: 0 0 .5rem; }
.note p { margin: 0 0 .75rem; }
.note p:last-child { margin-bottom: 0; }

.metric {
  font-family: var(--mono); font-variant-numeric: tabular-nums;
  background: var(--wash); border: 1px solid var(--line); border-radius: 6px;
  padding: .75rem .9rem; margin: 0 0 .75rem; font-size: .9rem; line-height: 1.7;
}

/* Contents: map order, marker in the area's own state colour, columns by width. */
.toc { border-top: 1px solid var(--line); padding-block: 1.5rem 0; }
.toc ol { list-style: none; margin: 0; padding: 0; columns: 17rem; column-gap: 2rem; }
.toc li { break-inside: avoid; margin-bottom: .35rem; font-size: .95rem; }
.toc a { display: flex; gap: .6rem; text-decoration: none; color: var(--fg); align-items: baseline; }
.toc a:hover { text-decoration: underline; }
.c-n {
  flex: none; font-family: var(--mono); font-variant-numeric: tabular-nums;
  font-size: .75rem; color: var(--accent-fg); background: var(--tone, var(--accent));
  border-radius: 999px; min-width: 1.5rem; text-align: center; padding: .1rem 0;
}

.tone-flow { --tone: var(--flow); }
.tone-social { --tone: var(--social); }
.tone-stuck { --tone: var(--stuck); }
.tone-pressure { --tone: var(--pressure); }

.areas { display: flex; flex-direction: column; gap: 2.5rem; margin-top: 2.5rem; }

/* One area. The state stripe is information — it is Helen's own grouping of the map. */
.area { border-left: 4px solid var(--tone, var(--accent)); padding-left: 1.25rem; }
.area-h { display: flex; gap: .9rem; align-items: baseline; margin-bottom: 1rem; }
.area-n {
  flex: none; font-family: var(--mono); font-variant-numeric: tabular-nums;
  font-size: .9rem; font-weight: 700; color: var(--tone, var(--accent)); margin: 0;
}
.area-h h3 { font-size: 1.3rem; margin: 0; }
.area-state {
  font-family: var(--mono); font-size: .7rem; text-transform: uppercase;
  letter-spacing: .1em; color: var(--fg-soft); margin: .2rem 0 0;
}

/* Ours vs theirs is the whole information design of this page. Ours is panelled and
   labelled; the quotation is quiet and credited. A reviewer must never have to guess. */
.ours { background: var(--card); border: 1px solid var(--line); border-radius: 8px; padding: 1rem 1.1rem; margin-bottom: 1rem; }
.ours-l {
  font-family: var(--mono); font-size: .7rem; text-transform: uppercase;
  letter-spacing: .1em; color: var(--fg-soft); margin: 0 0 .5rem;
}
.ours p:last-child { margin-bottom: 0; }
.ours p { margin: 0; }
/* Plain first, and larger than the quotation below it — the site's own rule. */
.ours-plain { font-size: 1.2rem; line-height: 1.55; }

.theirs { margin: 0 0 1rem; padding: 0 0 0 1rem; border-left: 2px solid var(--line); }
.theirs p { margin: 0 0 .5rem; color: var(--fg-soft); font-size: .95rem; }
.theirs cite { font-style: normal; font-size: .85rem; color: var(--fg-soft); }

.srcs { font-size: .85rem; color: var(--fg-soft); margin: 0; }

.qs { border-top: 1px solid var(--line); margin-top: 3rem; padding-top: 1.5rem; max-width: var(--measure); }
.qs h2 { font-size: 1.4rem; margin: 0 0 1rem; }
.qs ol { padding-left: 1.2rem; }
.qs li { margin-bottom: 1rem; }

.foot { border-top: 1px solid var(--line); margin-top: 3rem; padding-top: 1.5rem; font-size: .9rem; color: var(--fg-soft); max-width: var(--measure); }

@media (max-width: 26rem) {
  .area { padding-left: 1rem; }
  .ours-plain { font-size: 1.1rem; }
}
</style>

<div class="wrap">
  <p class="eyebrow">Map of Monotropic Experiences</p>
  <h1>Forty Passages for Helen</h1>
  <p class="stand">Twenty <strong>In plain words</strong> definitions and twenty <strong>What changes this</strong> paragraphs, from the area pages of monotropicmap.org. These forty passages are Stimpunks&rsquo; words sitting on your map, and you have not seen them yet.</p>

  <section class="note">
    <h2>Everything in a quotation is not under review</h2>
    <p>Each passage is shown next to the definition it sits under, so it can be read in place. The quoted definitions are yours or somebody else&rsquo;s, they are credited as they are on the site, and they are context only.</p>
  </section>

  <section class="note">
    <h2>The rule every &ldquo;What changes this&rdquo; paragraph follows</h2>
    <p><strong>It names what the environment changes, never what the person should do.</strong> &ldquo;Rest more&rdquo; is the failure mode. A Burnout Whirlpool is manufactured, so the sentence has to point at the conditions that made it.</p>
    <p>If one of these forty reads like advice to the reader, that is the bug we are asking you to find.</p>
  </section>

  <section class="note">
    <h2>The constraint every &ldquo;In plain words&rdquo; definition is held to</h2>
    <p>Short sentences, one idea each, everyday words &mdash; the shape the <a href="https://autisticadvocacy.org" rel="noopener">Autistic Self Advocacy Network (ASAN)</a> sets out. As the twenty stand:</p>
    <p class="metric">${m.words} words &middot; ${m.sentences} sentences &middot; ${m.avg} words a sentence &middot; longest sentence ${m.longest} words</p>
    <p>The site refuses to build a definition that averages over 15 words a sentence or contains one over 18, so a rewrite has to stay short. <strong>No script can certify Easy Read</strong> &mdash; that takes a focus group of people with intellectual and developmental disabilities. The numbers only say the text is short. Whether it is right is what we are asking you.</p>
  </section>

  <section class="note">
    <h2>What a useful answer looks like</h2>
    <p>Per passage: <strong>keep</strong>, <strong>change</strong> &mdash; your words, if you have them &mdash; or <strong>cut</strong>. &ldquo;This is not how I would say it&rdquo; is a complete and useful answer on its own. It is your map.</p>
  </section>

  <nav class="toc" aria-labelledby="toc-h">
    <h2 class="eyebrow" id="toc-h">The twenty, in map order</h2>
    <ol>
${contents}
    </ol>
  </nav>

  <div class="areas">
${blocks}
  </div>

  <section class="qs">
    <h2>The three questions, answered 2026-09-16</h2>
    <ol>
      <li><strong>Blackwater&rsquo;s first name.</strong> Answered: <strong>Amelia Blackwater</strong>, <a href="https://themighty.com/u/amelia-blackwater" rel="noopener">her profile at The Mighty</a>. Area 17 now carries the full name.</li>
      <li><strong>Two areas had no named originator.</strong> Answered: <strong>Rabbit Holes of Research and Infodump Canyon are both yours.</strong> Both now say so. The definitions quoted on those two pages are still general ones rather than your words, so the page credits you with the area and not with the sentence.</li>
      <li><strong>Per-area artwork.</strong> Answered, and superseded by your own design for version two: a blank map, icons a person places where they like, open &ldquo;?&rdquo; symbols they fill with their own image, art or wording, and the maps joined by fresh water with bridges and boats rather than left as separate islands. Recorded in <code>DECISIONS.md</code>; nothing is built yet.</li>
    </ol>
    <p><strong>One question is open in their place.</strong> The map is composed of Canva elements, and Canva&rsquo;s licence turns on whether every one of them is Free Content rather than Pro. It is visible per element in Canva: hover, the three dots, Content source information. A single Pro element anywhere governs the whole design.</p>
  </section>

  <p class="foot">Generated from <code>tools/areas.mjs</code> by <code>tools/review.mjs</code>, so this packet cannot drift from the live pages. The map, the area names and the wording printed on the artwork are Helen Edgar&rsquo;s. Map of Monotropic Experiences is CC BY-SA 4.0.</p>
</div>
`);
