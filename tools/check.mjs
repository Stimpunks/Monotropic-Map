/**
 * check.mjs — the sweep. Run it before calling anything done.
 *
 * A GATE THAT COULD NOT RUN HAS NOT PASSED. Every check here either reports a
 * result or says plainly that it could not look; none of them pass by silence.
 *
 *   node tools/check.mjs          structure, links, contrast, build drift
 *   node tools/check.mjs --net    also resolve every external link over the network
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const NET = process.argv.includes('--net');
let failures = 0;
const fail = (msg) => { failures++; console.log(`  FAIL  ${msg}`); };
const pass = (msg) => console.log(`  ok    ${msg}`);

const pages = readdirSync(ROOT).filter((f) => f.endsWith('.html'));

/* ---- 1. build drift ------------------------------------------------------ */
console.log('\nbuild drift');
try {
  execFileSync('node', [join(ROOT, 'tools', 'build.mjs'), '--check'], { stdio: 'pipe' });
  pass('every generated file is current');
} catch (e) {
  fail('generated files are out of date — run `node tools/build.mjs`');
  process.stdout.write(String(e.stdout || ''));
}

/* ---- 1b. the slide deck -------------------------------------------------- */
console.log('\nslides');
try {
  const out = execFileSync('python3', [join(ROOT, 'tools', 'make-slides.py'), '--check'], { stdio: 'pipe', encoding: 'utf8' });
  pass(out.trim().replace(/^make-slides --check: /, ''));
} catch (e) {
  const out = String(e.stdout || '') + String(e.stderr || '');
  if (/No such file|not found|python3/.test(out) && !/FAIL/.test(out)) {
    /* A gate that could not run has not passed. Say which, and why. */
    fail('the slide check could not run (python3 missing) — slides NOT verified');
  } else {
    fail('slides are out of sync with tools/slides.mjs — run `python3 tools/make-slides.py`');
    process.stdout.write(out);
  }
}

/* ---- 2. internal links --------------------------------------------------- */
console.log('\ninternal links');
let checked = 0, broken = 0;
for (const page of pages) {
  const html = readFileSync(join(ROOT, page), 'utf8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|#)/.test(href) === false) {
      checked++;
      const file = href.split('#')[0];
      if (file && !existsSync(join(ROOT, file.replace(/^\//, '')))) { broken++; fail(`${page} -> ${href} (no such file)`); }
    } else if (href.startsWith('#')) {
      checked++;
      const id = href.slice(1);
      if (!ids.has(id)) { broken++; fail(`${page} -> ${href} (no such id on the page)`); }
    }
  }
}
if (!broken) pass(`${checked} internal links and fragments all resolve across ${pages.length} pages`);

/* ---- 3. every page reachable and in the sitemap -------------------------- */
console.log('\nsitemap');
const sitemap = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8');
const listed = new Set([...sitemap.matchAll(/<loc>https:\/\/monotropicmap\.org\/?([^<]*)<\/loc>/g)].map((m) => m[1] || 'index'));
let missing = 0;
for (const page of pages) {
  const slug = page.replace(/\.html$/, '');
  if (slug === '404') continue;
  if (!listed.has(slug)) { missing++; fail(`${page} is not in sitemap.xml`); }
}
for (const slug of listed) {
  if (!existsSync(join(ROOT, `${slug}.html`))) { missing++; fail(`sitemap.xml lists /${slug} but there is no page`); }
}
if (!missing) pass(`${listed.size} URLs, and they match the pages on disk`);

/* ---- 4. metadata --------------------------------------------------------- */
console.log('\nmetadata');
let meta = 0;
for (const page of pages) {
  const html = readFileSync(join(ROOT, page), 'utf8');
  if (!/<title>[^<]{8,}<\/title>/.test(html)) { meta++; fail(`${page} has no usable <title>`); }
  if (page !== '404.html' && !/<meta name="description" content="[^"]{30,}"/.test(html)) { meta++; fail(`${page} has no usable description`); }
  if (page !== '404.html' && !/<link rel="canonical"/.test(html)) { meta++; fail(`${page} has no canonical`); }
  const h1s = [...html.matchAll(/<h1[ >]/g)].length;
  if (h1s !== 1) { meta++; fail(`${page} has ${h1s} h1 elements, expected 1`); }
}
if (!meta) pass(`${pages.length} pages each have a title, description, canonical and exactly one h1`);

/* ---- 5. images have real alt text ---------------------------------------- */
console.log('\nimages');
let imgs = 0, bad = 0;
for (const page of pages) {
  const html = readFileSync(join(ROOT, page), 'utf8');
  for (const m of html.matchAll(/<img\s[^>]*>/g)) {
    imgs++;
    const tag = m[0];
    const alt = /alt="([^"]*)"/.exec(tag);
    if (!alt) { bad++; fail(`${page}: an <img> with no alt attribute`); }
    else if (alt[1].trim().length < 40) { bad++; fail(`${page}: alt text is too thin to replace the picture (${alt[1].length} chars)`); }
    if (!/width="\d+"/.test(tag) || !/height="\d+"/.test(tag)) { bad++; fail(`${page}: an <img> without width/height, which makes the page jump on load`); }
  }
}
if (!bad) pass(`${imgs} images, all with substantive alt text and intrinsic dimensions`);

/* ---- 5b. no inline styles ------------------------------------------------- */
/* `_headers` ships style-src 'self'. An inline style attribute is therefore dead
   markup in production and perfectly fine on a dev server, which is the worst
   combination available. The first deploy shipped the map hotspots that way and
   every marker stacked in the corner. */
console.log('\ninline styles (blocked by our own CSP)');
{
  let inline = 0;
  for (const page of pages) {
    const html = readFileSync(join(ROOT, page), 'utf8');
    for (const m of html.matchAll(/<[^>]+\sstyle="[^"]*"/g)) {
      inline++;
      fail(`${page}: inline style attribute, which style-src 'self' blocks: ${m[0].slice(0, 70)}`);
    }
    if (/<style[\s>]/.test(html)) { inline++; fail(`${page}: an inline <style> element, which style-src 'self' blocks`); }
  }
  if (!inline) pass(`no inline styles in ${pages.length} pages`);
}

/* ---- 6. the no-JavaScript promise ---------------------------------------- */
console.log('\nno-JavaScript');
{
  const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
  const listBlock = /<div id="view-list"([^>]*)>/.exec(html);
  const swBlock = /<div class="viewswitch"([^>]*)>/.exec(html);
  if (!listBlock) fail('index.html has no list view at all');
  else if (/\bhidden\b/.test(listBlock[1])) fail('index.html hides the list view in markup — with JS off the map is the only way in');
  else pass('the list view is present and visible without JavaScript');
  if (!swBlock) fail('index.html has no view switcher');
  else if (!/\bhidden\b/.test(swBlock[1])) fail('the view switcher is visible without JS, but it cannot work without JS');
  else pass('the view switcher is hidden until JavaScript can wire it up');
}

/* ---- 7. contrast --------------------------------------------------------- */
console.log('\ncontrast (WCAG AA, 4.5:1 for body text)');
{
  const css = readFileSync(join(ROOT, 'monotropic-map.css'), 'utf8');
  const hex = (s) => { const h = s.replace('#', ''); const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h; return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16)); };
  const lum = (rgb) => { const a = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]; };
  const ratio = (a, b) => { const l1 = lum(hex(a)), l2 = lum(hex(b)); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  const tokens = (block) => Object.fromEntries([...block.matchAll(/(--[a-z-]+):\s*(#[0-9a-fA-F]{3,6});/g)].map((m) => [m[1], m[2]]));

  const lightBlock = css.slice(css.indexOf(':root {'), css.indexOf('@media (prefers-color-scheme: dark)'));
  const darkBlock = css.slice(css.indexOf(':root[data-theme="dark"]'), css.indexOf('*, *::before'));
  const L = tokens(lightBlock), D = tokens(darkBlock);
  const themes = [
    ['light', { bg: L['--sand'], card: L['--paper'], fg: L['--ink'], soft: L['--ink-soft'], accent: L['--sea'], wash: L['--sea-wash'], flow: L['--flow'], social: L['--social'], stuck: L['--stuck'], pressure: L['--pressure'] }],
    ['dark', { bg: D['--bg'], card: D['--card'], fg: D['--fg'], soft: D['--fg-soft'], accent: D['--accent'], wash: D['--wash'], flow: D['--flow'], social: D['--social'], stuck: D['--stuck'], pressure: D['--pressure'] }],
  ];
  let cbad = 0, ctested = 0;
  for (const [name, t] of themes) {
    const pairs = [
      ['body text on page', t.fg, t.bg], ['body text on card', t.fg, t.card],
      ['muted text on page', t.soft, t.bg], ['muted text on card', t.soft, t.card],
      ['link on page', t.accent, t.bg], ['link on card', t.accent, t.card],
      ['quote text on wash', t.fg, t.wash],
      ['flow tag on card', t.flow, t.card], ['social tag on card', t.social, t.card],
      ['stuck tag on card', t.stuck, t.card], ['pressure tag on card', t.pressure, t.card],
    ];
    for (const [what, fg, bg] of pairs) {
      if (!fg || !bg) { fail(`${name}: could not resolve a colour for "${what}" — the check did not run`); cbad++; continue; }
      ctested++;
      const r = ratio(fg, bg);
      if (r < 4.5) { cbad++; fail(`${name}: ${what} is ${r.toFixed(2)}:1 (${fg} on ${bg}), needs 4.5`); }
    }
  }
  if (!cbad) pass(`${ctested} colour pairs across both themes, all at or above 4.5:1`);
}

/* ---- 8. external links --------------------------------------------------- */
console.log('\nexternal links');
{
  const ext = new Set();
  for (const page of pages) {
    const html = readFileSync(join(ROOT, page), 'utf8');
    for (const m of html.matchAll(/href="(https?:\/\/[^"]+)"/g)) {
      /* Our own absolute URLs (canonicals, og:url, llms.txt) are not external links.
         Until the domain is registered they do not resolve, and failing on them would
         train everyone to ignore this check — which is how a real dead link ships. */
      if (m[1].startsWith('https://monotropicmap.org')) continue;
      ext.add(m[1]);
    }
  }
  if (!NET) {
    console.log(`  --    ${ext.size} distinct external links, NOT checked (pass --net to resolve them)`);
  } else {
    /* Publishers that refuse robots are a known, separate category. A 403 from one of
       these is NOT evidence the page is gone — verified by hand in a real browser on
       2026-09-15 — so it is reported and not failed. Anything else that 4xx/5xx fails.
       Add to this list only after opening the URL yourself. */
    const BLOCKS_ROBOTS = [
      /(^|\.)medium\.com$/, /(^|\.)researchgate\.net$/,
      /(^|\.)sagepub\.com$/, /(^|\.)tandfonline\.com$/, /(^|\.)liebertpub\.com$/,
    ];
    let dead = 0, blocked = 0;
    for (const url of ext) {
      let code = 0, finalUrl = url;
      try {
        /* The FINAL host is what matters: a DOI is a redirector, so a 403 belongs to
           the publisher it lands on, not to doi.org. Reporting doi.org as the blocker
           would send the next person to debug the wrong service. */
        const out = execFileSync('curl', ['-sS', '-o', '/dev/null', '-w', '%{http_code} %{url_effective}', '-L', '--max-time', '20', '-A', 'Mozilla/5.0 (monotropicmap.org link check)', url], { encoding: 'utf8' }).trim();
        const sp = out.indexOf(' ');
        code = Number(out.slice(0, sp));
        finalUrl = out.slice(sp + 1);
      } catch { code = 0; }
      const host = (() => { try { return new URL(finalUrl).hostname; } catch { return ''; } })();
      if (code === 403 && BLOCKS_ROBOTS.some((re) => re.test(host))) {
        blocked++;
        const via = host === new URL(url).hostname ? '' : ` (via ${new URL(url).hostname})`;
        console.log(`  note  403 from ${host}${via} — blocks robots, not a dead link: ${url}`);
        continue;
      }
      if (code === 0 || code >= 400) { dead++; fail(`${code || 'no response'}  ${url}`); }
    }
    if (!dead) pass(`${ext.size} external links resolve (${blocked} behind a robot block, reported above)`);
  }
}

/* ---- 9. the pre-launch flags ---------------------------------------------- */
/* Not a failure — a state the whole repository is in, printed every single run so
   nobody has to remember it. A guard is worth more than a fix, and the thing most
   easily forgotten about a pre-launch site is that it is still pre-launch. */
{
  const robots = readFileSync(join(ROOT, 'robots.txt'), 'utf8');
  const headers = readFileSync(join(ROOT, '_headers'), 'utf8');
  const blocked = /^\s*Disallow:\s*\/\s*$/m.test(robots);
  const noindex = /X-Robots-Tag:\s*noindex/i.test(headers);
  if (blocked || noindex) {
    console.log('\nPRE-LAUNCH');
    console.log(`  note  this site is closed to search engines (robots.txt: ${blocked ? 'Disallow' : 'open'}, X-Robots-Tag: ${noindex ? 'noindex' : 'absent'})`);
    console.log('  note  flip both at launch, once monotropicmap.org resolves — robots.txt says how');
    if (blocked !== noindex) fail('robots.txt and _headers disagree about indexing — one was flipped and the other was not');
  }
}

console.log(failures ? `\n${failures} failure(s).\n` : '\nAll checks pass.\n');
process.exit(failures ? 1 : 0);
