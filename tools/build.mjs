/**
 * build.mjs — generates every page of monotropicmap.org from `areas.mjs` and the
 * `pages/*.md` prose. Run it after editing either. `--check` reports drift and
 * writes nothing.
 *
 * NEVER HAND-EDIT A GENERATED .html FILE. Everything at the repository root that
 * ends in .html is output; the sources are `areas.mjs`, `pages/`, and this file.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AREAS, STATES, BY_SLUG, validate } from './areas.mjs';
import { ZONES, validate as validateZones } from './domination.mjs';
import { SLIDES, validate as validateSlides } from './slides.mjs';
import { SHAPES, SETS, validate as validateShapes } from './shapes.mjs';
import { render } from './md.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const CHECK = process.argv.includes('--check');

/** Slide slug -> everything a page needs to render it. Dimensions come from the
 *  generated manifest so the markup always carries the real ones; an unrendered
 *  deck is an empty Map, and md.mjs then refuses the @slide rather than emitting
 *  a broken image. */
const SLIDE_MANIFEST = existsSync(join(ROOT, 'images', 'slides', 'manifest.json'))
  ? JSON.parse(readFileSync(join(ROOT, 'images', 'slides', 'manifest.json'), 'utf8'))
  : {};
const SLIDE_CTX = new Map(
  SLIDES.filter((s) => SLIDE_MANIFEST[s.slug]).map((s) => [s.slug, {
    src: `images/slides/${s.slug}.webp`,
    alt: s.alt,
    width: SLIDE_MANIFEST[s.slug].width,
    height: SLIDE_MANIFEST[s.slug].height,
  }])
);

export const SITE = {
  domain: 'monotropicmap.org',
  origin: 'https://monotropicmap.org',
  title: 'Map of Monotropic Experiences',
  tagline: 'A map you can find yourself on',
  authors: 'Helen Edgar (Autistic Realms) and the Stimpunks Foundation',
};

/** Nav order is editorial. `privacy` is deliberately footer-only — a privacy notice
 *  belongs in the footer, and putting it in the nav would make a six-item bar into
 *  a seven-item one for the page nobody navigates to on purpose. */
const NAV = [
  ['index', 'The map'],
  ['areas', 'The twenty areas'],
  ['neuronormative-domination', 'The frame'],
  ['training', 'Training'],
  ['stories', 'Your map'],
  ['draw', 'Draw a map'],
  ['about', 'About'],
  ['changelog', 'Changelog'],
];
const FOOTER_ONLY = ['privacy'];

const esc = (s) => String(s).replace(/&(?![a-zA-Z]+;|#\d+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** Strip tags and entities for use in <meta> and JSON. */
const plain = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d)).replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();

const MAP_PAGES = new Set(['index', 'neuronormative-domination', 'stories']);
/** Pages carrying an interactive tool, and the script each one needs. The two tools
 *  share no state and no file: version one marks Helen's map, version two draws your
 *  own, and a page that loads both would be paying for a tool it does not show. */
const TOOL_SCRIPTS = new Map([
  ['stories', 'my-map.js'],
  ['draw', 'map-canvas.js'],
]);

function shell({ slug, title, description, body, h1, wide = false }) {
  const canonical = slug === 'index' ? `${SITE.origin}/` : `${SITE.origin}/${slug}`;
  const pageTitle = slug === 'index' ? `${SITE.title} — ${SITE.tagline}` : `${title} — ${SITE.title}`;
  const nav = NAV.map(([s, label]) => {
    const href = s === 'index' ? '/' : `${s}.html`;
    const cur = s === slug ? ' aria-current="page"' : '';
    return `        <li><a href="${href}"${cur}>${esc(label)}</a></li>`;
  }).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(pageTitle)}</title>
<meta name="description" content="${esc(plain(description))}">
<link rel="canonical" href="${canonical}">
<link rel="preload" href="fonts/atkinson-hyperlegible-regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="monotropic-map.css">
${MAP_PAGES.has(slug) ? '<link rel="stylesheet" href="map-hotspots.css">\n' : ''}
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(pageTitle)}">
<meta property="og:description" content="${esc(plain(description))}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE.origin}/images/map-of-monotropic-experiences.png">
<meta name="twitter:card" content="summary_large_image">
<script src="theme.js"></script>
${TOOL_SCRIPTS.has(slug) ? `<script src="${TOOL_SCRIPTS.get(slug)}" defer></script>\n` : ''}</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="bar">
  <div class="bar-in">
    <a class="home" href="/">${esc(SITE.title)}</a>
    <nav aria-label="Sections">
      <ul>
${nav}
      </ul>
    </nav>
    <button class="theme-toggle" type="button" hidden>Dark</button>
  </div>
</header>
<main id="main" class="wrap"${wide ? ' data-wide' : ''}>
${h1 === false ? '' : `<h1>${esc(h1 ?? title)}</h1>\n`}${body}
</main>
<footer class="site">
  <div class="wrap">
    <p><strong>${esc(SITE.title)}</strong> is by ${esc(SITE.authors)} — Ryan Boren, Norah Hobbs and Chelsea Adams. The original map was created by Helen Edgar in 2024.</p>
    <p>The map and everything on this site derived from it are licensed <a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="noopener">CC BY-SA 4.0</a>. Share it, adapt it, keep the credit, keep the licence.</p>
    <p><a href="privacy.html">Privacy</a> · <a href="https://autisticrealms.com" rel="noopener">Autistic Realms</a> · <a href="https://stimpunks.org" rel="noopener">Stimpunks</a> · <a href="https://monotropism.org" rel="noopener">monotropism.org</a></p>
  </div>
</footer>
</body>
</html>
`;
}

/* ---- the map ------------------------------------------------------------ */

/** One map figure, used by both maps. `items` are {href, x, y, marker, label, tone}. */
/**
 * One map image, as a <picture> chain. WebP first, the original PNG as the fallback.
 *
 * THE WEBP IS PIXEL-FOR-PIXEL THE PNG — lossless, and `tools/make-map-webp.py` verifies
 * it by decoding both and comparing, rather than trusting an encoder's flag. That is the
 * only reason this is allowed at all: ATTRIBUTIONS.md says both artworks are reproduced
 * unaltered, and a lossy re-encode of somebody else's drawing would break that.
 *
 * THE PNG STAYS, and not only as a fallback for old browsers. It is the file Helen
 * published, and it is what somebody re-using the map under CC BY-SA should be able to
 * download. WebP is how we deliver it, not what it is.
 *
 * `width` and `height` live on the <img>, where the browser reads them to reserve the
 * slot — a <source> carries no intrinsic size, and moving them would hand us the layout
 * shift they exist to prevent.
 */
function mapPicture({ src, width, height, alt }) {
  const webp = src.replace(/\.png$/, '.webp');
  return `    <picture>
      <source srcset="${webp}" type="image/webp">
      <img src="${src}" width="${width}" height="${height}" alt="${esc(alt)}">
    </picture>`;
}

function mapFigure({ src, width, height, alt, items }) {
  const spots = items.map((it) =>
    `    <li><a class="hs-${it.id}" href="${it.href}"${it.tone ? ` data-tone="${it.tone}"` : ''}${it.area ? ` data-area="${it.area}"` : ''}>${it.marker}<span class="sr">. ${esc(plain(it.label))}</span></a></li>`
  ).join('\n');
  return `  <figure class="mapframe">
${mapPicture({ src, width, height, alt })}
    <ul class="hotspots">
${spots}
    </ul>
  </figure>`;
}

function hotspots() {
  return AREAS.map((a) => `    <li><a class="hs-${a.slug}" href="${a.slug}.html" data-tone="${a.state}">${a.n}<span class="sr">. ${esc(plain(a.label))}</span></a></li>`).join('\n');
}

/**
 * map-hotspots.css — every marker's position, as real stylesheet rules.
 *
 * NOT INLINE `style` ATTRIBUTES, and this is a correctness requirement rather than a
 * preference: `_headers` ships `style-src 'self'`, which blocks inline styles outright.
 * The first deploy had the positions inline and every marker on both maps stacked in
 * the corner — invisible locally, because a dev server sends no CSP at all. check.mjs
 * now fails on any `style=` attribute in generated HTML so it cannot come back.
 */
function hotspotCss() {
  const rule = (sel, [x, y]) => `.hs-${sel} { left: ${x}%; top: ${y}%; }`;
  return [
    '/* Generated by tools/build.mjs from areas.mjs and domination.mjs. Never edit.',
    '   These live here rather than in a style attribute because the CSP forbids',
    '   inline styles — see hotspotCss() in tools/build.mjs. */',
    ...AREAS.map((a) => rule(a.slug, a.hot)),
    ...ZONES.map((z) => rule(z.slug, z.hot)),
    '',
  ].join('\n');
}

function buildDomination() {
  const src = readFileSync(join(ROOT, 'pages', 'neuronormative-domination.md'), 'utf8');
  const lines = src.split('\n');
  const title = lines[0].slice(2).trim();

  const fig = mapFigure({
    src: 'images/map-of-neuronormative-domination.png',
    width: 1080, height: 1080,
    alt: 'An illustrated island titled "Autism & The Map of Neuronormative Domination". A grey highway of yellow arrows runs across it. Around and on it: Mountains of Misinformation, a "Disorder" Framing Disaster Zone marked with a red warning triangle, the Harmful highway, Behaviourism Bay, the Marsh of Masking, a Sandstorm of Stigma, the Dunes of Deficit Metaphors with puzzle pieces, the Canyon of Cures and Eugenics, and Destination Neurotypical Bay, where a person sits with their head down.',
    items: ZONES.map((z, i) => ({
      id: z.slug, href: `#${z.slug}`, x: z.hot[0], y: z.hot[1], marker: i + 1,
      label: z.label, tone: 'pressure',
    })),
  });

  const list = ZONES.map((z, i) => `<section class="panel" id="${z.slug}" data-tone="pressure">
  <h3><span class="num">${i + 1}</span> ${z.label}</h3>
  <p>${z.body}</p>
${z.link ? `  <p><a href="${z.link.url}" rel="noopener">${esc(z.link.name)} in the Stimpunks glossary</a></p>\n` : ''}</section>`).join('\n');

  const body = `<div class="prose"><p>There is a second map, and the first one does not make sense without it.</p></div>

${fig}
<p class="mapnote">Nine zones. Each marker jumps to what it is. Every one of them is made by people, and every one of them could be unmade.</p>

<h2 id="the-nine-zones">The nine zones</h2>
${list}

<div class="prose">
${render(lines.slice(1).join('\n').replace(/^\s*There is a second map[^\n]*\n/m, ''), 'pages/neuronormative-domination.md', { slides: SLIDE_CTX })}
</div>`;

  return shell({
    slug: 'neuronormative-domination',
    title,
    description: 'Autism & The Map of Neuronormative Domination: the nine zones that produce stuck states, and why the Map of Monotropic Experiences is not a picture of a person.',
    body,
  });
}

/**
 * The numbered key that sits under the picture — 1 to 20, in map order.
 *
 * IT IS A LEGEND, NOT A SECOND LIST VIEW, and the difference is the point. The grouped
 * list answers "what kind of place is this?"; the key answers "what is that number on
 * the picture?". Before it existed the map view could not orient anybody on its own:
 * area 7 was a circle, the labels printed on the artwork are unreadable at page width,
 * and the names lived in the view you were not looking at.
 *
 * Helen's own training deck does exactly this — slide 14 is the map beside a numbered
 * key — which is the strongest argument for it.
 */
function numberedKey() {
  const items = AREAS.map((a) => `    <li data-tone="${a.state}"><a href="${a.slug}.html">${a.label}</a></li>`).join('\n');
  return `  <nav class="mapkey" aria-labelledby="mapkey-heading">
    <h2 id="mapkey-heading">Areas of the map</h2>
    <ol>
${items}
    </ol>
  </nav>`;
}

function areaCards(list) {
  return `<ul class="arealist">\n` + list.map((a) => `  <li><a href="${a.slug}.html" data-tone="${a.state}">
    <span class="num">${a.n}</span>
    <span class="name">${a.label}</span>
    <span class="who">${a.coiner ? `named by ${a.coiner}` : a.who ? `named by ${a.who.name}` : 'no single originator'}</span>
  </a></li>`).join('\n') + `\n</ul>`;
}

function stateGroups() {
  return [...STATES].map(([key, s]) => {
    const list = AREAS.filter((a) => a.state === key);
    return `<section class="stategroup" data-tone="${key}">
  <h2><span class="tag">${esc(s.name)}</span></h2>
  <p>${esc(s.blurb)}</p>
  ${areaCards(list)}
</section>`;
  }).join('\n\n');
}

function buildIndex() {
  const body = `<p class="prose">Twenty places a monotropic person goes. Some of them are where the good work happens; some of them are weather that other people make. This is Helen Edgar's map of her own Autistic and ADHD experience, and it turned out that a great many of us live here too.</p>

  <figure class="mapframe">
${mapPicture({
    src: 'images/map-of-monotropic-experiences.png', width: 1080, height: 1080,
    alt: 'An illustrated island in a blue sea. Around and on it: Sudden Storms of Unexpected Events, Attention Tunnels, Penguin Pebbling Cove of Friendship, Tendril Theory, Mountains of Ruminating Thoughts, Cyclones of Unmet Needs, Rabbit Holes of Research, Infodump Canyon, Rhizomatic Communities, River of Monotropic Flow States, Campsite of Cavendish Spaces, River Banks of Monotropic Time, Meerkat Mounds, Burnout Whirlpools, Panic Hills of Low Object Permanence, Shark Infested Waters of Neuronormativity and Behaviourism and Double Empathy Problems, Beach of Body Doubling, Forest of Joy Awe and Wonder, Lake of Limerence, and Tides of the Sensory Sea.',
  })}
    <ul class="hotspots">
${hotspots()}
    </ul>
  </figure>
  <p class="mapnote">Each numbered marker opens that area, and so does its name in the key below. Prefer them sorted by what kind of place they are? <a href="areas.html">The twenty areas</a> groups them into flow, connection, stuck states and pressure.</p>
${numberedKey()}

<h2>The water it all sits in</h2>
<p class="prose">It would be easy to read this map as a picture of a person. It is not. Burnout Whirlpools and the Shark Infested Waters are not weather that happens to you — they are produced, by schools and workplaces and clinics built on the assumption that there is one correct way to have a mind. <a href="neuronormative-domination.html">The second map</a> is about who makes the weather.</p>

<h2>Take it further</h2>
<ul class="prose">
  <li><a href="training.html">Free open-source training</a> — about forty-five minutes, for schools, workplaces, health settings and community groups.</li>
  <li><a href="stories.html">Mark your own map</a>, and share it with the community story project.</li>
  <li><a href="https://pa11erns.com/psychometrics/mq/" rel="noopener">The Monotropism Questionnaire</a> — Garau et al.'s validated measure, shared under CC BY-NC-SA. We link it rather than copying it.</li>
</ul>`;
  return shell({
    slug: 'index',
    title: SITE.title,
    h1: SITE.title,
    description: "Twenty places a monotropic person goes. Helen Edgar's Map of Monotropic Experiences, with an area-by-area guide, the free training, and the frame that explains who makes the weather.",
    body,
  });
}

function buildAreasPage() {
  const body = `<p class="prose">All twenty, grouped by what kind of place they are. The grouping is Helen Edgar's own, from <a href="neuronormative-domination.html">Stuck States vs Flow States</a>.</p>

${stateGroups()}`;
  return shell({
    slug: 'areas',
    title: 'The twenty areas',
    description: 'Every area of the Map of Monotropic Experiences, grouped into flow, connection, stuck states, and the pressures acting on it.',
    body,
  });
}

function buildArea(a) {
  const prev = AREAS[(a.n - 2 + 20) % 20];
  const next = AREAS[a.n % 20];
  const st = STATES.get(a.state);

  const borders = a.borders.map((s) => {
    const b = BY_SLUG.get(s);
    return `    <li><a href="${b.slug}.html">${b.label}</a></li>`;
  }).join('\n');

  const body = `<div class="areahead" data-tone="${a.state}">
  <p><span class="tag">${esc(st.name)}</span></p>
</div>

<section class="plain" data-tone="${a.state}" aria-labelledby="plain-heading">
  <h2 id="plain-heading">In plain words</h2>
  <p>${a.plain}</p>
</section>

${a.glossNote ? `<div class="gloss" data-tone="${a.state}">` : `<blockquote class="gloss" data-tone="${a.state}">`}
  <p>${a.gloss}</p>
  ${a.glossNote ? `<cite>${a.glossNote} <a href="${a.who.url}" rel="noopener">in their own words</a>.</cite>` : a.who ? `<cite>${a.coiner ? `Named by ${a.coiner}. Definition quoted from ` : ''}${a.coiner ? `<a href="${a.who.url}" rel="noopener">${a.who.name}</a>.` : `${a.who.name} — <a href="${a.who.url}" rel="noopener">in their own words</a>`}</cite>` : a.coiner ? `<cite>Named by ${a.coiner}. The definition above is a general one, not a quotation from the person who named this area.</cite>` : `<cite>A shared community coinage with no single originator.</cite>`}
${a.glossNote ? `</div>` : `</blockquote>`}

<div class="panel" data-tone="${a.state}">
  <h2>What changes this</h2>
  <p>${a.helps}</p>
</div>

<h2>Where it is on the map</h2>
<p class="prose">Area ${a.n} of twenty, printed on the map as <em>${a.label}</em>. It borders:</p>
<ul class="borders">
${borders}
</ul>

<h2>Read more</h2>
<ul class="prose">
  <li><a href="${a.stimpunks}" rel="noopener">Stimpunks glossary</a></li>
${a.who ? `  <li><a href="${a.who.url}" rel="noopener">${esc(a.who.name)} on ${esc(plain(a.title).toLowerCase())}</a></li>\n` : ''}${a.sibling ? `  <li><a href="${a.sibling.url}" rel="noopener">${esc(a.sibling.name)}</a> — a whole site about this part of the map.</li>\n` : ''}</ul>

<nav class="pager" aria-label="Areas">
  <a href="${prev.slug}.html">← ${prev.n}. ${prev.label}</a>
  <a href="${next.slug}.html">${next.n}. ${next.label} →</a>
</nav>`;

  return shell({
    slug: a.slug,
    title: a.title,
    h1: plain(a.title),
    description: plain(a.gloss).slice(0, 180),
    body,
  });
}

/** A contents list for a long page. Built from the rendered h2s rather than from the
 *  Markdown, so the hrefs and the ids come from one place and cannot disagree — the
 *  id-generation rule mangles apostrophes ("Let's" -> "let-s") and a second
 *  implementation of it would drift silently. check.mjs verifies every fragment. */
function tableOfContents(html) {
  const heads = [...html.matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g)];
  if (heads.length < 5) return '';
  const items = heads.map(([, id, label]) => `    <li><a href="#${id}">${label}</a></li>`).join('\n');
  return `<nav class="toc" aria-labelledby="toc-heading">
  <h2 id="toc-heading">On this page</h2>
  <ol>
${items}
  </ol>
</nav>\n`;
}

/** The changelog page, built from the repository's own CHANGELOG.md.
 *
 *  ONE SOURCE, DELIBERATELY. A `pages/changelog.md` beside the root CHANGELOG.md would be
 *  two accounts of the same history, and the published one is always the one that goes
 *  stale. It also means the file has to stay readable by a visitor rather than only by
 *  whoever wrote the commit — which is the right pressure to be under. */
function buildChangelog() {
  const src = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8');
  const lines = src.split('\n');
  if (!lines[0].startsWith('# ')) throw new Error('CHANGELOG.md must open with "# Changelog"');
  const html = render(lines.slice(1).join('\n'), 'CHANGELOG.md', { slides: SLIDE_CTX });
  return shell({
    slug: 'changelog',
    title: lines[0].slice(2).trim(),
    description: "What has changed on monotropicmap.org, newest first — including what we got wrong.",
    body: `${tableOfContents(html)}<div class="prose">\n${html}\n</div>`,
  });
}

function buildProse(slug) {
  const src = readFileSync(join(ROOT, 'pages', `${slug}.md`), 'utf8');
  const lines = src.split('\n');
  if (!lines[0].startsWith('# ')) throw new Error(`pages/${slug}.md must open with "# Title"`);
  const title = lines[0].slice(2).trim();
  const desc = (lines.slice(1).find((l) => l.trim() && !l.startsWith('#')) || title).replace(/[*\[\]]|\(https?:[^)]+\)/g, '').trim();
  const html = render(lines.slice(1).join('\n'), `pages/${slug}.md`, {
    slides: SLIDE_CTX,
    mymap: slug === 'stories' ? myMapTool() : null,
    canvas: slug === 'draw' ? canvasTool() : null,
  });
  return shell({
    slug, title,
    description: desc.slice(0, 180),
    body: `${tableOfContents(html)}<div class="prose">\n${html}\n</div>`,
  });
}

/* ---- My Monotropic Map, version one -------------------------------------- */

/**
 * THE FOUR MARKS ARE THE PAGE'S OWN WORDS, not new ones. `pages/stories.md` has asked
 * the same question since before any tool existed — "somewhere you are living, somewhere
 * you pass through, somewhere that has taken over the whole map this month, or somewhere
 * you have never been" — so the marks are lifted from that sentence. If the prose
 * changes, these move with it; they are one thing said twice, not two things.
 *
 * NO SCORE, NO TYPE, NO RESULT, AND NO COUNTS. `DECISIONS.md` puts it as "the moment the
 * site emits a number it is a quiz", and a tally of how many areas you marked is a
 * number. So the legend names places and never counts them, and the way you see what
 * you have not reached yet is that it is listed under "Not said yet" — by name.
 *
 * NOTHING HERE INTERPRETS THE MARKS. No advice is generated from them, which is the
 * site's one rule seen from the other side: what changes a stuck state is a change to
 * the conditions, and this tool does not know anybody's conditions. Each area links to
 * its own page, where the environmental change is already written down.
 *
 * THE VOCABULARY LIVES HERE AND NOWHERE ELSE. `my-map.js` reads these labels back out
 * of the DOM instead of keeping its own copy, so there is no second list to drift.
 */
const MARKS = [
  { id: '',          label: 'Not said yet' },
  { id: 'living',    label: 'Living here' },
  { id: 'passing',   label: 'Passing through' },
  { id: 'swallowed', label: 'Taken over the map' },
  { id: 'never',     label: 'Never been' },
];

function myMapTool() {
  const fig = mapFigure({
    src: 'images/map-of-monotropic-experiences.png',
    width: 1080, height: 1080,
    alt: "Helen Edgar's Map of Monotropic Experiences, with a numbered marker over each of the twenty areas. Each marker shows how you have marked that area.",
    items: AREAS.map((a) => ({
      id: a.slug, area: a.slug, href: `#mark-${a.slug}`,
      marker: a.n, label: a.label, tone: a.state,
    })),
  });

  /* Real radios, visible and working with JavaScript switched off. What JS adds is
     remembering, the legend, and the map reflecting the marks — enhancements, not the
     control itself. A person with no JS can still fill this in and print it. */
  const rows = AREAS.map((a) => {
    const opts = MARKS.map((m) => {
      const id = `mark-${a.slug}-${m.id || 'none'}`;
      return `        <label class="mark" for="${id}"><input type="radio" id="${id}" name="mark-${a.slug}" value="${m.id}"${m.id ? '' : ' checked'}><span>${m.label}</span></label>`;
    }).join('\n');
    return `    <li class="markrow" id="mark-${a.slug}" data-area="${a.slug}" data-tone="${a.state}">
      <div class="markrow-h">
        <span class="markrow-n">${a.n}</span>
        <a class="markrow-name" href="${a.slug}.html">${a.label}</a>
      </div>
      <fieldset class="marks">
        <legend class="sr">${esc(plain(a.label))} — how is it for you right now?</legend>
${opts}
      </fieldset>
    </li>`;
  }).join('\n');

  /* The legend reads what you said first and what you have not said last, which is the
     opposite of the radio row — there "Not said yet" is the resting state and belongs on
     the left. Leading a person's own legend with fifteen areas they have not reached
     buries the five they have. */
  const legendOrder = MARKS.filter((m) => m.id).concat(MARKS.filter((m) => !m.id));
  const groups = legendOrder.map((m) => `      <section class="legend-g" data-mark="${m.id}" hidden>
        <h4>${m.label}</h4>
        <ul></ul>
      </section>`).join('\n');

  return `<section class="mymap" id="my-monotropic-map" aria-labelledby="mymap-h">
  <h3 id="mymap-h">My Monotropic Map</h3>
  <p class="mymap-lede">Say what each of the twenty areas is for you right now. Nothing you mark leaves this device, there is no score at the end, and you can change any of it whenever you like.</p>

${fig}

  <noscript>
    <p class="mymap-note"><strong>JavaScript is switched off, so this page cannot remember your marks or build the legend for you.</strong> The twenty areas below still work — fill them in and print the page — and the <a href="https://autisticrealms.com/product/my-monotropic-map-workbook/" rel="noopener">workbook</a> does the same job on paper.</p>
  </noscript>

  <ol class="markrows">
${rows}
  </ol>

  <div class="legend" id="my-legend">
    <h3>Your legend</h3>
    <p class="legend-empty">Mark an area above and it will appear here.</p>
    <div class="legend-groups">
${groups}
    </div>
    <p class="legend-actions">
      <button type="button" class="btn" id="legend-print" hidden>Print this</button>
      <button type="button" class="btn" id="legend-copy" hidden>Copy as text</button>
      <button type="button" class="btn btn-quiet" id="legend-clear" hidden>Clear every mark</button>
    </p>
    <p class="legend-note" id="legend-status" role="status"></p>
  </div>
</section>`;
}

/* ---- the map builder, version two ---------------------------------------- */

/**
 * EVERY DRAWING IS WRITTEN INTO THE PAGE ONCE, into a <defs> block, and map-canvas.js
 * copies one out whenever it needs it — for a tray preview, and for each piece a
 * person stamps on the canvas. Fifty-one drawings placed twenty times is still
 * fifty-one drawings in the file.
 *
 * COPIED, NOT <use>d, AS A PRECAUTION RATHER THAN A FIX. A <use> draws its reference
 * in a shadow tree, and how reliably CSS custom properties inherit into one varies by
 * engine. Every colour in these drawings is a custom property, so the failure mode is
 * the whole tray rendering solid black — too costly to leave to an engine detail we
 * cannot test here. A copy is an ordinary child of the page and inherits --tone,
 * --card and the rest like anything else.
 *
 * FOR THE RECORD, that is NOT what made the icons black on 2026-09-16: the stylesheet
 * in the browser was a cached older copy with none of these rules in it. `serve` does
 * not honour `_headers`, so a local preview can hold a stale CSS file across edits
 * while the served file is current. Look at `document.styleSheets` before believing a
 * styling bug.
 *
 * THE VOCABULARY IS READ BACK OUT OF THE DOM, exactly as my-map.js reads the four
 * marks rather than keeping its own copy. `map-canvas.js` carries no shape data, no
 * names and no list of the twenty: it asks the buttons this function generated. So
 * tools/shapes.mjs and tools/areas.mjs stay the only places either is written down.
 *
 * THE WHOLE TOOL SHIPS `hidden`, and the script reveals it — the same rule as the
 * theme toggle and version one's print button. A drag-and-resize canvas cannot work
 * without JavaScript, and a control that cannot work must not be sitting there
 * looking like it can. What a reader with no script gets instead is `canvas-off`,
 * which is visible by default and says where to go: the marking tool, which does
 * work without a script, and the paper workbook.
 *
 * NO COUNTS, for the same reason version one has none. A canvas invites a readout —
 * how many pieces, how big, what percentage of the map is whirlpool — and the moment
 * the site emits a number it is a quiz. Position is said in words, and size is
 * "bigger" and "smaller".
 */

/** Paint goes on as a class, never as `fill="var(--x)"`.
 *
 *  A `var()` inside a presentation attribute is not a thing every browser resolves,
 *  and a shape whose fill does not resolve is a black shape — so the colour is moved
 *  into a class and the rule lives in `monotropic-map.css`, which is also the only
 *  way a theme switch can reach it. This is the same reason `map-hotspots.css` exists
 *  rather than twenty `style` attributes: the stylesheet is where colour is allowed
 *  to live on this site, and the CSP agrees.
 *
 *  A shape painting something this map does not know about is a hard error rather
 *  than a silently black drawing. */
const PAINT = new Map([
  ['TONE', 'tone'], ['var(--card)', 'card'], ['var(--fg)', 'fg'], ['var(--flow)', 'flow'],
  ['var(--ground)', 'ground'], ['var(--leaf)', 'leaf'], ['var(--social)', 'social'],
]);

function paintToClasses(draw, id) {
  return draw.replace(/<([a-z]+)([^>]*)>/g, (whole, tag, attrs) => {
    const classes = [];
    const rest = attrs.replace(/\s(fill|stroke)="([^"]+)"/g, (mm, prop, val) => {
      if (val === 'none') return mm;
      const name = PAINT.get(val);
      if (!name) throw new Error(`build: shape "${id}" paints ${prop}="${val}", which has no class — add it to PAINT in build.mjs and a rule to monotropic-map.css`);
      classes.push(`${prop === 'fill' ? 'f' : 's'}-${name}`);
      return '';
    });
    return `<${tag}${classes.length ? ` class="${classes.join(' ')}"` : ''}${rest}>`;
  });
}

function canvasTool() {
  /* `data-tone` on the symbol sets --tone, using the same rules the area pages and the
     map hotspots already use, so a shape's own colour follows the theme for free. */
  const defs = Object.entries(SHAPES).map(([id, sh]) =>
    `    <g id="sh-${id}" data-tone="${sh.tone}">${paintToClasses(sh.draw, id)}</g>`).join('\n');

  const sets = SETS.map(([setId, setName, setNote]) => {
    const buttons = Object.entries(SHAPES).filter(([, sh]) => sh.set === setId).map(([id, sh]) =>
      `        <button class="shapebtn" type="button" data-shape="${id}" data-name="${esc(sh.name)}" data-tone="${sh.tone}"${
        sh.back ? ' data-back="yes"' : ''}${sh.size ? ` data-size="${sh.size}"` : ''}>
          <svg class="shapeprev" viewBox="-112 -84 224 168" width="58" height="44" aria-hidden="true" focusable="false"></svg>
          <span>${esc(sh.name)}</span>
        </button>`).join('\n');
    return `      <section class="shapeset">
        <h4>${esc(setName)}</h4>
        <p class="setnote">${esc(setNote)}</p>
        <div class="shapes">
${buttons}
        </div>
      </section>`;
  }).join('\n');

  /* The same twenty, from the same source as everything else on the site. */
  const places = AREAS.map((a) => `        <li><button class="placebtn" type="button" data-place="${a.n}" data-name="${esc(plain(a.label))}" data-tone="${a.state}">
          <span class="placen">${a.n}</span><span>${a.label}</span>
        </button></li>`).join('\n');

  return `<section class="canvas-tool" id="map-canvas" aria-labelledby="canvas-h" hidden>
  <h3 id="canvas-h">Draw your own map</h3>
  <p class="canvas-lede">Put an island down, add what belongs on it, and move things until it looks like your year. Nothing you draw leaves this device, there is no score at the end, and no two maps are supposed to match.</p>

  <svg class="shape-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>
${defs}
  </defs></svg>

  <div class="canvas-board">
    <div class="canvas-bar">
      <button class="btn" type="button" id="canvas-bigger">Bigger</button>
      <button class="btn" type="button" id="canvas-smaller">Smaller</button>
      <button class="btn" type="button" id="canvas-turn">Turn</button>
      <button class="btn" type="button" id="canvas-flip">Flip</button>
      <button class="btn" type="button" id="canvas-remove">Take it off</button>
      <span class="canvas-spacer"></span>
      <button class="btn btn-quiet" type="button" id="canvas-clear">Clear the map</button>
    </div>

    <svg class="canvas-stage" id="canvas-stage" viewBox="0 0 1000 720" role="application"
         aria-label="Your map. Tab to a piece, then move it with the arrow keys.">
      <g id="canvas-pieces"></g>
    </svg>

    <p class="canvas-say" id="canvas-say" role="status"></p>
    <p class="canvas-keys">Drag a piece, or tab to it and use the <strong>arrow keys</strong> to move it, <strong>+</strong> and <strong>&#8722;</strong> to resize, <strong>[</strong> and <strong>]</strong> to turn, <strong>f</strong> to flip, <strong>Delete</strong> to take it off. A river turned is a river running the other way, which is why there is one of each shape rather than eight.</p>
  </div>

  <div class="canvas-tray">
    <section>
      <h4 class="trayhead">Shapes</h4>
      <p class="setnote">Drawn from scratch in the site's own tones, never traced from the map — which is what makes them yours to keep, copy and change.</p>
      <div class="shapesets">
${sets}
      </div>
    </section>

    <section>
      <h4 class="trayhead">The twenty places</h4>
      <p class="setnote">Add the ones that are yours. Leaving one off is an answer too.</p>
      <ul class="places">
${places}
      </ul>
    </section>
  </div>
</section>

<p class="canvas-off" id="canvas-off"><strong>JavaScript is switched off, so the drawing board on this page cannot run.</strong> Drawing needs a script in a way that marking does not — so the <a href="stories.html">marking tool</a> still works with the script off and can be printed, and the <a href="https://autisticrealms.com/product/my-monotropic-map-workbook/" rel="noopener">workbook</a> does this job on paper, which is where the invitation started.</p>`;
}

/* ---- derived ------------------------------------------------------------ */

function searchIndex() {
  return JSON.stringify({
    site: SITE.title,
    url: SITE.origin,
    generated_from: 'tools/areas.mjs',
    note: 'The twenty areas, published as text so a mirror gets the content and not just the page furniture.',
    entries: AREAS.map((a) => ({
      n: a.n,
      slug: a.slug,
      title: plain(a.title),
      label: plain(a.label),
      state: a.state,
      url: `${SITE.origin}/${a.slug}`,
      plain_language: plain(a.plain),
      definition: plain(a.gloss),
      named_by: a.coiner || (a.who ? plain(a.who.name) : null),
      source: a.who ? a.who.url : null,
      what_changes_this: plain(a.helps),
      borders: a.borders,
    })),
  }, null, 2) + '\n';
}

function sitemap() {
  /* Derived from the same lists the nav and the builder use. Written out by hand this
     drifted the moment a page was added — which is the whole failure mode this file's
     other generated lists exist to avoid. */
  const slugs = [...NAV.map(([s]) => s), 'areas', ...AREAS.map((a) => a.slug), ...FOOTER_ONLY]
    .filter((s, i, all) => all.indexOf(s) === i);
  const urls = slugs.map((s) => `  <url><loc>${SITE.origin}${s === 'index' ? '/' : '/' + s}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function llmsTxt() {
  return `# ${SITE.title}

> ${SITE.tagline}. Twenty areas of monotropic experience, mapped by Helen Edgar (Autistic Realms) and developed with the Stimpunks Foundation. CC BY-SA 4.0.

Monotropism is a neurodiversity-affirming theory of autism (Murray, Lesser & Lawson, 2005): monotropic people pull more attention toward fewer interests at a time. This site maps what that is like, area by area, and names who coined each one.

## The map
- [The map](${SITE.origin}/): the map itself, as a picture and as a list.
- [The twenty areas](${SITE.origin}/areas): grouped into flow, connection, stuck states, and pressure.
- [The frame](${SITE.origin}/neuronormative-domination): why stuck states are produced rather than personal.

## The twenty areas
${AREAS.map((a) => `- [${plain(a.label)}](${SITE.origin}/${a.slug}): ${plain(a.plain)}${a.coiner || a.who ? ` Named by ${plain(a.coiner || a.who.name)}.` : ''}`).join('\n')}

## The nine zones of neuronormative domination
${ZONES.map((z, i) => `- [${plain(z.label)}](${SITE.origin}/neuronormative-domination#${z.slug}): ${plain(z.body)}`).join('\n')}

## Also
- [Training](${SITE.origin}/training): free open-source training, about 45 minutes.
- [Your map](${SITE.origin}/stories): mark where you are on the map, and the community story project.
- [Draw a map](${SITE.origin}/draw): blank ground and a tray of shapes, for drawing your own instead of marking hers.
- [About](${SITE.origin}/about): who made this, and the licence.
- [Changelog](${SITE.origin}/changelog): what has changed, including what we got wrong.
- Machine-readable areas: ${SITE.origin}/search-index.json
`;
}

/* ---- run ---------------------------------------------------------------- */

const problems = [...validate(), ...validateZones(), ...validateSlides(), ...validateShapes()];
if (problems.length) { console.error('map data:\n  ' + problems.join('\n  ')); process.exit(1); }

const outputs = new Map();
outputs.set('index.html', buildIndex());
outputs.set('areas.html', buildAreasPage());
for (const a of AREAS) outputs.set(`${a.slug}.html`, buildArea(a));
outputs.set('neuronormative-domination.html', buildDomination());
outputs.set('changelog.html', buildChangelog());
for (const slug of [...NAV.map(([s]) => s).filter((s) => !['index', 'areas', 'neuronormative-domination', 'changelog'].includes(s)), ...FOOTER_ONLY]) {
  outputs.set(`${slug}.html`, buildProse(slug));
}
outputs.set('map-hotspots.css', hotspotCss());
outputs.set('search-index.json', searchIndex());
outputs.set('sitemap.xml', sitemap());
outputs.set('llms.txt', llmsTxt());

let drift = 0;
for (const [name, content] of outputs) {
  const path = join(ROOT, name);
  const old = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if (old === content) continue;
  drift++;
  if (CHECK) console.log(`  would ${old === null ? 'create' : 'update'} ${name}`);
  else writeFileSync(path, content);
}

if (CHECK) {
  console.log(drift ? `build --check: ${drift} file(s) out of date` : 'build --check: everything up to date');
  process.exit(drift ? 1 : 0);
}
console.log(`build: ${outputs.size} files (${drift} written, ${outputs.size - drift} unchanged)`);
