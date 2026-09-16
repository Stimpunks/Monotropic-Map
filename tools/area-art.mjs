/**
 * area-art.mjs — one illustration for each of the twenty areas, drawn by us.
 *
 * NO CANVA CONTENT REACHES THIS SITE'S OWN ARTWORK. Helen's map is a composition of
 * licensed stock elements and stays exactly as she made it, reproduced unaltered.
 * Everything the site draws for itself — every shape in tools/shapes.mjs and every
 * illustration here — is Stimpunks' own work, which is what makes it publishable
 * under CC BY-SA and free of a stock licence that forbids handing on the pieces.
 * See DECISIONS.md.
 *
 * AN ILLUSTRATION IS AN ARRANGEMENT, NOT NEW PATH DATA. Each of the twenty is a short
 * list of shapes the builder already offers, each placed, sized and turned. Twenty
 * hand-drawn scenes would be twenty more drawings to keep in step with the palette,
 * and every one of them a place for a typo in a path to hide. This way an area's
 * artwork is four or five readable lines, every part of it is a drawing that has
 * already been seen to render, and a change to a shape reaches all twenty at once.
 *
 * THEY ARE NOT A SECOND MAP. These are pictures of the twenty ideas in our own hand,
 * for the builder's tray and for whatever else wants them. Helen's map is the map;
 * the arrangement of her island, the wording on it and the artwork are hers. Putting
 * these anywhere that speaks for the map itself is a question for her, not a thing to
 * slide in because the files exist.
 *
 * Parts are drawn in order, so the first is furthest back. Coordinates are the same
 * -100..100 space the shapes are drawn in, `s` scales, `r` turns clockwise in degrees,
 * and `flip` mirrors.
 */

/** @type {Record<string, Array<{shape: string, x?: number, y?: number, s?: number, r?: number, flip?: boolean}>>} */
export const AREA_ART = {
  /* A tunnel you are already inside, with the way in behind you. */
  'attention-tunnels': [
    { shape: 'arch', s: 1.05, y: 6 },
    { shape: 'path', x: 0, y: 58, s: 0.78 },
  ],

  /* One penguin, one pebble, offered. */
  'penguin-pebbling-cove-of-friendship': [
    { shape: 'shore', y: 46, s: 0.95 },
    { shape: 'penguin', x: -34, y: -6, s: 0.72 },
    { shape: 'penguin', x: 34, y: 0, s: 0.62, flip: true },
    { shape: 'pebble', x: 2, y: 62, s: 0.38 },
  ],

  /* Attention as tendrils, reaching and curling. */
  'tendril-theory': [
    { shape: 'tendril', x: -6, y: -26, s: 0.85 },
    { shape: 'tendril', x: 10, y: 30, s: 0.7, flip: true },
  ],

  /* The same thought going round the mountain again. */
  'mountains-of-ruminating-thoughts': [
    { shape: 'ridge', y: 44, s: 1.05 },
    { shape: 'knot', x: 6, y: -42, s: 0.72 },
  ],

  /* A need that was not met, turning into weather. */
  'cyclones-of-unmet-needs': [
    { shape: 'cyclone', y: -4, s: 1.05 },
    { shape: 'scatter', y: 66, s: 0.5 },
  ],

  /* Down the hole, and the research goes on underground. */
  'rabbit-holes-of-research': [
    { shape: 'hole', x: 34, y: 44, s: 0.72 },
    { shape: 'rabbit', x: -26, y: -4, s: 0.82 },
  ],

  /* Everything, at length, downhill. */
  'infodump-canyon': [
    { shape: 'canyon', s: 1.05 },
  ],

  /* Runners underground, shoots above, no centre and no head. */
  'rhizomatic-communities': [
    { shape: 'rhizome', s: 1.1 },
  ],

  /* The river itself, and something carried along by it. */
  'river-of-monotropic-flow-states': [
    { shape: 'meander', y: 16, s: 1.1 },
    { shape: 'boat', x: 18, y: -22, s: 0.55 },
  ],

  /* A place to be yourself in, with the fire lit. */
  'campsite-of-cavendish-spaces': [
    { shape: 'pine', x: 58, y: -12, s: 0.6 },
    { shape: 'tent', x: -30, y: 12, s: 0.8 },
    { shape: 'campfire', x: 44, y: 40, s: 0.5 },
  ],

  /* Up on the mound, watching for what is coming. */
  'meerkat-mounds': [
    { shape: 'mound', x: 34, y: 40, s: 0.7 },
    { shape: 'meerkat', x: -22, y: -2, s: 0.9 },
  ],

  /* Time as the bank you are standing on, not the water. */
  'river-banks-of-monotropic-time': [
    { shape: 'bandDown', s: 1.05 },
    { shape: 'grove', x: -60, y: -24, s: 0.44 },
    { shape: 'mound', x: 58, y: 34, s: 0.44 },
  ],

  /* The water other people's assumptions are swimming in. */
  'shark-infested-waters': [
    { shape: 'wave', y: 30, s: 1 },
    { shape: 'shark', x: -8, y: -18, s: 0.85 },
  ],

  /* Somebody else on the sand, doing their own thing beside you. */
  'beach-of-body-doubling': [
    { shape: 'shore', y: 40, s: 1 },
    { shape: 'pair', x: 0, y: -14, s: 0.78 },
  ],

  /* Pulled round and down, and it takes the whole map with it. */
  'burnout-whirlpools': [
    { shape: 'pool', y: 12, s: 1.15 },
    { shape: 'whirl', y: 4, s: 0.82 },
  ],

  /* Out of sight is gone, and the ground goes vague. */
  'panic-hills-of-low-object-permanence': [
    { shape: 'ridge', y: 40, s: 1 },
    { shape: 'haze', x: 8, y: -16, s: 1.05 },
  ],

  /* The good forest, and what it is like to be in it. */
  'forest-of-joy-awe-and-wonder': [
    { shape: 'grove', x: -30, y: 26, s: 0.8 },
    { shape: 'pine', x: 48, y: 22, s: 0.6 },
    { shape: 'sparkle', x: 10, y: -48, s: 0.6 },
  ],

  /* A lake you can see all the way to the bottom of, and fall into. */
  'lake-of-limerence': [
    { shape: 'pool', y: 26, s: 1.05 },
    { shape: 'heart', x: 0, y: -26, s: 0.58 },
  ],

  /* Sensory input as tide: it comes in whether or not you are ready. */
  'tides-of-the-sensory-sea': [
    { shape: 'drift', y: -34, s: 0.9 },
    { shape: 'wave', y: 34, s: 1.05 },
  ],

  /* The weather nobody told you was coming. */
  'sudden-storms-of-unexpected-events': [
    { shape: 'storm', y: -18, s: 0.95 },
    { shape: 'drift', y: 62, s: 0.7 },
  ],
};

/**
 * Compose the illustrations out of the shape vocabulary.
 *
 * Returns entries shaped exactly like the ones in shapes.mjs, so the tray, the <defs>
 * block, the builder and every gate in check.mjs treat them as ordinary shapes. Each
 * part keeps its own tone — a tent stays its own colour inside an area that is not —
 * so the wrapper carries `data-tone` and the part's drawing resolves against it.
 */
export function composeAreaArt(SHAPES, AREAS) {
  const out = {};
  for (const area of AREAS) {
    const parts = AREA_ART[area.slug];
    if (!parts) continue;
    const draw = parts.map((p) => {
      const base = SHAPES[p.shape];
      if (!base) throw new Error(`area-art: ${area.slug} asks for shape "${p.shape}", which does not exist`);
      const moves = [];
      if (p.x || p.y) moves.push(`translate(${p.x || 0} ${p.y || 0})`);
      if (p.r) moves.push(`rotate(${p.r})`);
      if (p.s || p.flip) moves.push(`scale(${(p.s ?? 1) * (p.flip ? -1 : 1)} ${p.s ?? 1})`);
      return `<g data-tone="${base.tone}"${moves.length ? ` transform="${moves.join(' ')}"` : ''}>${base.draw}</g>`;
    }).join('');
    const full = String(area.label).replace(/&amp;/g, '&').replace(/<[^>]+>/g, '');
    out[`area${area.n}`] = {
      set: 'areas',
      name: full,
      /* Shown in the tray where a long name would stretch the whole row. It is the
         front of the real name, never a different one, and `name` above is what a
         screen reader announces and what a placed piece is called. */
      short: area.short ? String(area.short).replace(/&amp;/g, '&') : undefined,
      tone: area.state,
      draw,
    };
  }
  return out;
}

/** Twenty areas, twenty illustrations, and every part of every one of them real. */
export function validate(SHAPES, AREAS) {
  const problems = [];
  for (const area of AREAS) {
    const parts = AREA_ART[area.slug];
    if (!parts || !parts.length) { problems.push(`area-art: ${area.slug} has no illustration`); continue; }
    for (const p of parts) {
      if (!SHAPES[p.shape]) problems.push(`area-art: ${area.slug} asks for shape "${p.shape}", which does not exist`);
    }
  }
  const slugs = new Set(AREAS.map((a) => a.slug));
  for (const slug of Object.keys(AREA_ART)) {
    if (!slugs.has(slug)) problems.push(`area-art: "${slug}" is not one of the twenty areas`);
  }
  return problems;
}
