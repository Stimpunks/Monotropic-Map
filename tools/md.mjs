/**
 * md.mjs — a deliberately small Markdown dialect.
 *
 * ANYTHING IT DOES NOT UNDERSTAND IS A HARD ERROR, never a silent drop. A page that
 * quietly loses a paragraph still looks fine, which is exactly why it must not be
 * possible. Supported: `##`/`###` headings, paragraphs, `-` lists, `>` quotes,
 * `----` rules (four dashes, house style), links, **bold**, *italic*, `code`.
 */

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };

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

export function render(src, where = 'markdown') {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    if (line === '----') { out.push('<hr>'); i++; continue; }
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
