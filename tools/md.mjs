/**
 * md.mjs — a deliberately small Markdown dialect.
 *
 * ANYTHING IT DOES NOT UNDERSTAND IS A HARD ERROR, never a silent drop. A page that
 * quietly loses a paragraph still looks fine, which is exactly why it must not be
 * possible. Supported: `##`/`###` headings, paragraphs, `-` lists, `>` quotes,
 * `----` rules (four dashes, house style), links, **bold**, *italic*, `code`, and
 * `::: consider` … `:::` callouts.
 *
 * THE CALLOUT NAME IS CHECKED. `::: whatever` is a hard error rather than a div with a
 * class nobody styled — a callout that renders as an unstyled paragraph is the same
 * silent-loss failure as a dropped line, wearing a box.
 */

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };

/** Callout name -> the label printed on it. Add a name here AND style it in the CSS. */
const CALLOUTS = new Map([
  ['consider', 'Consider'],
  ['note', 'Note'],
]);

/** Escape text, but leave existing entities (&amp;, &#36;) alone. */
function esc(s) {
  return s.replace(/&(?![a-zA-Z]+;|#\d+;)|[<>]/g, (c) => ESC[c]);
}

function inline(s, where) {
  let out = esc(s);
  out = out.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, href) => {
    const ext = /^https?:\/\//.test(href) && !href.includes('monotropicmap.org');
    const rel = ext ? ' rel="noopener"' : '';
    return `<a href="${href}"${rel}>${t}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>');
  if (out.includes('](')) throw new Error(`md: malformed link in ${where}: ${s}`);
  if (/\*\*/.test(out)) throw new Error(`md: unclosed bold in ${where}: ${s}`);
  return out;
}

/** `ctx.slides` is a Map of slug -> {src, alt, width, height}, supplied by build.mjs
 *  from slides.mjs and the generated manifest. An `@slide` naming a slug that is not
 *  in it is a hard error: a missing slide must not render as nothing. */
export function render(src, where = 'markdown', ctx = {}) {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    if (line === '----') { out.push('<hr>'); i++; continue; }

    if (line.startsWith('@slide ')) {
      const slug = line.slice(7).trim();
      const slides = ctx.slides || new Map();
      const s = slides.get(slug);
      if (!s) {
        throw new Error(`md: @slide "${slug}" is not a known slide (${where}, line ${i + 1}); run tools/make-slides.py, or check tools/slides.mjs`);
      }
      out.push(`<figure class="slide">
  <img src="${s.src}" width="${s.width}" height="${s.height}" loading="lazy" decoding="async" alt="${s.alt.replace(/"/g, '&quot;')}">
</figure>`);
      i++; continue;
    }

    if (line.startsWith(':::')) {
      const name = line.slice(3).trim();
      if (!CALLOUTS.has(name)) {
        throw new Error(`md: unknown callout ":::${name}" (${where}, line ${i + 1}); known: ${[...CALLOUTS.keys()].join(', ')}`);
      }
      i++;
      const body = [];
      while (i < lines.length && lines[i].trim() !== ':::') {
        if (lines[i].trim()) body.push(lines[i]);
        i++;
      }
      if (i >= lines.length) throw new Error(`md: callout ":::${name}" is never closed (${where})`);
      i++;
      const inner = body.map((t) => t.startsWith('- ') ? null : `  <p>${inline(t, where)}</p>`);
      const rendered = [];
      let bullets = null;
      for (let k = 0; k < body.length; k++) {
        if (body[k].startsWith('- ')) {
          if (!bullets) { bullets = []; }
          bullets.push(`    <li>${inline(body[k].slice(2), where)}</li>`);
        } else {
          if (bullets) { rendered.push(`  <ul>\n${bullets.join('\n')}\n  </ul>`); bullets = null; }
          rendered.push(inner[k]);
        }
      }
      if (bullets) rendered.push(`  <ul>\n${bullets.join('\n')}\n  </ul>`);
      out.push(`<aside class="callout ${name}">\n  <p class="callout-label">${CALLOUTS.get(name)}</p>\n${rendered.join('\n')}\n</aside>`);
      continue;
    }
    if (/^-{3}$|^-{5,}$/.test(line.trim())) {
      throw new Error(`md: horizontal rules are four dashes in this house (${where}, line ${i + 1})`);
    }

    let m = /^(#{2,3})\s+(.+)$/.exec(line);
    if (m) {
      const level = m[1].length;
      const id = m[2].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      out.push(`<h${level} id="${id}">${inline(m[2], where)}</h${level}>`);
      i++; continue;
    }
    if (/^#\s/.test(line)) throw new Error(`md: the h1 comes from the page title, not the body (${where}, line ${i + 1})`);

    if (line.startsWith('- ')) {
      const items = [];
      while (i < lines.length && lines[i].startsWith('- ')) { items.push(inline(lines[i].slice(2), where)); i++; }
      out.push(`<ul>\n${items.map((t) => `  <li>${t}</li>`).join('\n')}\n</ul>`);
      continue;
    }

    if (line.startsWith('> ')) {
      const body = [];
      while (i < lines.length && lines[i].startsWith('> ')) { body.push(inline(lines[i].slice(2), where)); i++; }
      const cite = body.length > 1 && body[body.length - 1].startsWith('— ')
        ? body.pop().slice(2) : null;
      out.push(
        `<blockquote>\n${body.map((t) => `  <p>${t}</p>`).join('\n')}` +
        (cite ? `\n  <cite>${cite}</cite>` : '') + `\n</blockquote>`
      );
      continue;
    }

    if (/^\s+\S/.test(line)) throw new Error(`md: unexpected indent (${where}, line ${i + 1}): ${line}`);

    out.push(`<p>${inline(line, where)}</p>`);
    i++;
  }
  return out.join('\n');
}
