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
import { render } from './md.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const CHECK = process.argv.includes('--check');

export const SITE = {
  domain: 'monotropicmap.org',
  origin: 'https://monotropicmap.org',
  title: 'Map of Monotropic Experiences',
  tagline: 'An island you can find yourself on',
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
  ['about', 'About'],
];
const FOOTER_ONLY = ['privacy'];

const esc = (s) => String(s).replace(/&(?![a-zA-Z]+;|#\d+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** Strip tags and entities for use in <meta> and JSON. */
const plain = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d)).replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();

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
<link rel="stylesheet" href="monotropic-map.css">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(pageTitle)}">
<meta property="og:description" content="${esc(plain(description))}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE.origin}/images/map-of-monotropic-experiences.png">
<meta name="twitter:card" content="summary_large_image">
<script src="theme.js"></script>
${slug === 'index' ? '<script src="map.js" defer></script>' : ''}
</head>
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
function mapFigure({ src, width, height, alt, items }) {
  const spots = items.map((it) =>
    `    <li><a href="${it.href}" style="left:${it.x}%;top:${it.y}%"${it.tone ? ` data-tone="${it.tone}"` : ''}>${it.marker}<span class="sr">. ${esc(plain(it.label))}</span></a></li>`
  ).join('\n');
  return `  <figure class="mapframe">
    <img src="${src}" width="${width}" height="${height}" alt="${esc(alt)}">
    <ul class="hotspots">
${spots}
    </ul>
  </figure>`;
}

function hotspots() {
  return AREAS.map((a) => {
    const [x, y] = a.hot;
    return `    <li><a href="${a.slug}.html" style="left:${x}%;top:${y}%" data-tone="${a.state}">${a.n}<span class="sr">. ${esc(plain(a.label))}</span></a></li>`;
  }).join('\n');
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
      href: `#${z.slug}`, x: z.hot[0], y: z.hot[1], marker: i + 1,
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
${render(lines.slice(1).join('\n').replace(/^\s*There is a second map[^\n]*\n/m, ''), 'pages/neuronormative-domination.md')}
</div>`;

  return shell({
    slug: 'neuronormative-domination',
    title,
    description: 'Autism & The Map of Neuronormative Domination: the nine zones that produce stuck states, and why the Map of Monotropic Experiences is not a picture of a person.',
    body,
  });
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
  const body = `<p class="prose">Twenty places a monotropic mind goes. Some of them are where the good work happens; some of them are weather that other people make. This is Helen Edgar's map of her own Autistic and ADHD experience, and it turned out that a great many of us live here too.</p>

<div class="viewswitch" role="group" aria-label="How to read the map" hidden>
  <button type="button" data-view="map" aria-pressed="true">Picture</button>
  <button type="button" data-view="list" aria-pressed="false">List</button>
</div>

<div id="view-map">
  <figure class="mapframe">
    <img src="images/map-of-monotropic-experiences.png" width="1080" height="1080"
         alt="An illustrated island in a blue sea. Around and on it: Sudden Storms of Unexpected Events, Attention Tunnels, Penguin Pebbling Cove of Friendship, Tendril Theory, Mountains of Ruminating Thoughts, Cyclones of Unmet Needs, Rabbit Holes of Research, Infodump Canyon, Rhizomatic Communities, River of Monotropic Flow States, Campsite of Cavendish Spaces, River Banks of Monotropic Time, Meerkat Mounds, Burnout Whirlpools, Panic Hills of Low Object Permanence, Shark Infested Waters of Neuronormativity and Behaviourism and Double Empathy Problems, Beach of Body Doubling, Forest of Joy Awe and Wonder, Lake of Limerence, and Tides of the Sensory Sea.">
    <ul class="hotspots">
${hotspots()}
    </ul>
  </figure>
  <p class="mapnote">Each numbered marker opens that area. Prefer words to pointing? The list is the same twenty places, grouped by what kind of place they are.</p>
</div>

<div id="view-list">
${stateGroups()}
</div>

<h2>The water this island sits in</h2>
<p class="prose">It would be easy to read this map as a picture of a person. It is not. Burnout Whirlpools and the Shark Infested Waters are not weather that happens to you — they are produced, by schools and workplaces and clinics built on the assumption that there is one correct way to have a mind. <a href="neuronormative-domination.html">The second map</a> is about who makes the weather.</p>

<h2>Take it further</h2>
<ul class="prose">
  <li><a href="training.html">Free open-source training</a> — about forty-five minutes, for schools, workplaces, health settings and community groups.</li>
  <li><a href="stories.html">Mark your own map</a>, and share it with the community story project.</li>
  <li><a href="https://dlcincluded.github.io/MQ/" rel="noopener">The Monotropism Questionnaire</a> — Garau et al.'s validated measure, hosted by its own authors. We link it rather than copying it.</li>
</ul>`;
  return shell({
    slug: 'index',
    title: SITE.title,
    h1: SITE.title,
    description: "Twenty places a monotropic mind goes. Helen Edgar's Map of Monotropic Experiences, with an area-by-area guide, the free training, and the frame that explains who makes the weather.",
    body,
  });
}

function buildAreasPage() {
  const body = `<p class="prose">All twenty, grouped by what kind of place they are. The grouping is Helen Edgar's own, from <a href="neuronormative-domination.html">Stuck States vs Flow States</a>.</p>

${stateGroups()}`;
  return shell({
    slug: 'areas',
    title: 'The twenty areas',
    description: 'Every area of the Map of Monotropic Experiences, grouped into flow, connection, stuck states, and the pressures acting on the island.',
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

<blockquote class="gloss" data-tone="${a.state}">
  <p>${a.gloss}</p>
  ${a.who ? `<cite>${a.coiner ? `Named by ${a.coiner}. Definition quoted from ` : ''}${a.coiner ? `<a href="${a.who.url}" rel="noopener">${a.who.name}</a>.` : `${a.who.name} — <a href="${a.who.url}" rel="noopener">in their own words</a>`}</cite>` : `<cite>A shared community coinage with no single originator.</cite>`}
</blockquote>

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
${a.who ? `  <li><a href="${a.who.url}" rel="noopener">${esc(a.who.name)} on ${esc(plain(a.title).toLowerCase())}</a></li>\n` : ''}${a.sibling ? `  <li><a href="${a.sibling.url}" rel="noopener">${esc(a.sibling.name)}</a> — a whole site about this part of the island.</li>\n` : ''}</ul>

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

function buildProse(slug) {
  const src = readFileSync(join(ROOT, 'pages', `${slug}.md`), 'utf8');
  const lines = src.split('\n');
  if (!lines[0].startsWith('# ')) throw new Error(`pages/${slug}.md must open with "# Title"`);
  const title = lines[0].slice(2).trim();
  const desc = (lines.slice(1).find((l) => l.trim() && !l.startsWith('#')) || title).replace(/[*\[\]]|\(https?:[^)]+\)/g, '').trim();
  return shell({
    slug, title,
    description: desc.slice(0, 180),
    body: `<div class="prose">\n${render(lines.slice(1).join('\n'), `pages/${slug}.md`)}\n</div>`,
  });
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
      definition: plain(a.gloss),
      named_by: a.who ? plain(a.who.name) : null,
      source: a.who ? a.who.url : null,
      what_changes_this: plain(a.helps),
      borders: a.borders,
    })),
  }, null, 2) + '\n';
}

function sitemap() {
  const slugs = ['index', 'areas', ...AREAS.map((a) => a.slug), 'neuronormative-domination', 'training', 'stories', 'about', 'privacy'];
  const urls = slugs.map((s) => `  <url><loc>${SITE.origin}${s === 'index' ? '/' : '/' + s}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function llmsTxt() {
  return `# ${SITE.title}

> ${SITE.tagline}. Twenty areas of monotropic experience, mapped by Helen Edgar (Autistic Realms) and developed with the Stimpunks Foundation. CC BY-SA 4.0.

Monotropism is a neurodiversity-affirming theory of autism (Murray, Lesser & Lawson, 2005): monotropic minds pull more attention toward fewer interests at a time. This site maps what that is like, area by area, and names who coined each one.

## The map
- [The map](${SITE.origin}/): the island, as a picture and as a list.
- [The twenty areas](${SITE.origin}/areas): grouped into flow, connection, stuck states, and pressure.
- [The frame](${SITE.origin}/neuronormative-domination): why stuck states are produced rather than personal.

## The twenty areas
${AREAS.map((a) => `- [${plain(a.label)}](${SITE.origin}/${a.slug}): ${plain(a.gloss).slice(0, 150)}${a.who ? ` Named by ${plain(a.who.name)}.` : ''}`).join('\n')}

## The nine zones of neuronormative domination
${ZONES.map((z, i) => `- [${plain(z.label)}](${SITE.origin}/neuronormative-domination#${z.slug}): ${plain(z.body)}`).join('\n')}

## Also
- [Training](${SITE.origin}/training): free open-source training, about 45 minutes.
- [Your map](${SITE.origin}/stories): mark your own, and the community story project.
- [About](${SITE.origin}/about): who made this, and the licence.
- Machine-readable areas: ${SITE.origin}/search-index.json
`;
}

/* ---- run ---------------------------------------------------------------- */

const problems = [...validate(), ...validateZones()];
if (problems.length) { console.error('map data:\n  ' + problems.join('\n  ')); process.exit(1); }

const outputs = new Map();
outputs.set('index.html', buildIndex());
outputs.set('areas.html', buildAreasPage());
for (const a of AREAS) outputs.set(`${a.slug}.html`, buildArea(a));
outputs.set('neuronormative-domination.html', buildDomination());
for (const slug of [...NAV.map(([s]) => s).filter((s) => !['index', 'areas', 'neuronormative-domination'].includes(s)), ...FOOTER_ONLY]) {
  outputs.set(`${slug}.html`, buildProse(slug));
}
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
