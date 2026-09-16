/**
 * shapes.mjs — the drawing vocabulary for the map builder, and the only place it is
 * written down. `tools/build.mjs` renders every one of these into the page once, as a
 * <symbol> in a <defs> block, and `map-canvas.js` places them with <use>. So the
 * browser holds one copy of each drawing however many times a person stamps it, and
 * the script carries no drawing data of its own — the same arrangement as the marking
 * tool, where my-map.js reads the four marks back out of the DOM rather than keeping
 * its own list.
 *
 * NOTHING HERE IS TRACED. Every shape is built from circles, triangles, rounded
 * rectangles and generated curves, in the site's own tokens. That is what makes them
 * ours to publish under CC BY-SA: the map's own elements are Canva's, whose licence
 * forbids handing on the pieces, and a trace of one of those elements would still be
 * that element. A recognisable rabbit is nobody's property. A particular drawing of a
 * rabbit is. See DECISIONS.md.
 *
 * COLOURS ARE TOKENS, NEVER LITERALS. `TONE` is substituted for the shape's own tone
 * at render time, and anything else reaches for var(--leaf), var(--social) and the
 * rest, so every drawing follows the theme. A hex code here would be a shape that
 * only works in one of them.
 *
 * THE IRREGULAR ONES ARE GENERATED. Coastlines, spirals, the tendril, the burst, the
 * mesh and the stars are computed from a seed rather than typed, because long
 * hand-written path data is where drawings go wrong silently — and because six
 * islands have to be six different shapes, not one shape six times.
 */

export const SHAPES = {
  /* ---- islands: the ground everything else sits on ----
     These drop to the back of the stage when added and start big, because a
     background you have to send backwards by hand is a background that spends
     its first ten seconds on top of your map. Generated rather than typed:
     an irregular coastline written out by hand is a coastline with a mistake
     in it, and every one of these has to be a different shape. */
  isleRound: { set:"islands", name:"Isle",      tone:"leaf",   back:true, size:2.6, draw:"ISLE1" },
  isleLong:  { set:"islands", name:"Long isle", tone:"leaf",   back:true, size:2.6, draw:"ISLE2" },
  isleLobed: { set:"islands", name:"Two lobes", tone:"leaf",   back:true, size:2.6, draw:"ISLE3" },
  isleSand:  { set:"islands", name:"Beach isle",tone:"social", back:true, size:2.6, draw:"ISLE4" },
  isleBay:   { set:"islands", name:"Bay",       tone:"social", back:true, size:2.6, draw:"ISLE5" },
  isleGroup: { set:"islands", name:"Scattered", tone:"social", back:true, size:2.6, draw:"ISLE6" },

  /* ---- ground: the stuff an area is made of ---- */
  blob:    { set:"ground", name:"Blob",    tone:"social",   draw:'<path d="M -55 -42 C 15 -66 82 -32 74 12 C 66 56 -6 72 -48 52 C -90 32 -96 -26 -55 -42 Z" fill="TONE" opacity="0.8"/>' },
  ridge:   { set:"ground", name:"Ridge",   tone:"pressure", draw:'<path d="M -95 50 L -45 -40 L 0 20 L 42 -54 L 100 50 Z" fill="TONE" opacity="0.8"/>' },
  shore:   { set:"ground", name:"Shore",   tone:"flow",     draw:'<g><path d="M -100 -6 C -46 -36 4 24 100 -14 L 100 70 L -100 70 Z" fill="TONE" opacity="0.32"/><path d="M -100 -6 C -46 -36 4 24 100 -14" fill="none" stroke="TONE" stroke-width="6" opacity="0.9"/></g>' },
  pool:    { set:"ground", name:"Pool",    tone:"flow",     draw:'<g><ellipse rx="84" ry="52" fill="TONE" opacity="0.4"/><ellipse rx="84" ry="52" fill="none" stroke="TONE" stroke-width="6" opacity="0.85"/><ellipse cx="-22" cy="-14" rx="30" ry="14" fill="TONE" opacity="0.3"/></g>' },
  grove:   { set:"ground", name:"Grove",   tone:"leaf",     draw:'<g><g fill="var(--social)" opacity="0.75"><rect x="-50" y="18" width="13" height="34" rx="5"/><rect x="-7" y="26" width="15" height="30" rx="6"/><rect x="34" y="20" width="12" height="32" rx="5"/></g><g fill="TONE"><circle cx="-44" cy="2" r="31" opacity="0.85"/><circle cx="0" cy="-20" r="39" opacity="0.9"/><circle cx="40" cy="0" r="33" opacity="0.8"/><circle cx="-18" cy="10" r="24" opacity="0.7"/></g></g>' },
  haze:    { set:"ground", name:"Haze",    tone:"soft",     draw:'<g fill="TONE"><ellipse rx="96" ry="56" opacity="0.18"/><ellipse cx="-18" cy="6" rx="66" ry="38" opacity="0.2"/><ellipse cx="26" cy="-8" rx="44" ry="26" opacity="0.22"/></g>' },

  /* ---- ways: things you travel along ---- */
  band:    { set:"ways", name:"Band",    tone:"flow",     draw:'<path d="M -100 -40 C -40 -10 -60 30 -10 45 C 40 60 60 40 95 58" fill="none" stroke="TONE" stroke-width="26" stroke-linecap="round" opacity="0.85"/>' },
  path:    { set:"ways", name:"Path",    tone:"soft",     draw:'<path d="M -95 34 C -40 -32 30 52 95 -24" fill="none" stroke="TONE" stroke-width="11" stroke-linecap="round" stroke-dasharray="1 26" opacity="0.95"/>' },
  drift:   { set:"ways", name:"Drift",   tone:"flow",     draw:'<g fill="none" stroke="TONE" stroke-width="8" stroke-linecap="round" opacity="0.7"><path d="M -92 -36 C -50 -54 -14 -18 28 -36 C 60 -50 78 -42 92 -48"/><path d="M -92 0 C -50 -18 -14 18 28 0 C 60 -14 78 -6 92 -12"/><path d="M -92 36 C -50 18 -14 54 28 36 C 60 22 78 30 92 24"/></g>' },
  tendril: { set:"ways", name:"Tendril", tone:"flow",     draw:"TENDRIL" },
  knot:    { set:"ways", name:"Knot",    tone:"stuck",    draw:'<path d="M -20 -54 C 52 -76 76 12 18 34 C -40 56 -74 4 -30 -18 C 14 -40 48 12 6 44" fill="none" stroke="TONE" stroke-width="10" stroke-linecap="round" opacity="0.9"/>' },
  reach:   { set:"ways", name:"Reach",   tone:"flow",     draw:'<path d="M -100 0 L 100 0" fill="none" stroke="TONE" stroke-width="34" opacity="0.85"/>' },
  meander: { set:"ways", name:"Meander", tone:"flow",     draw:'<path d="M -100 -34 C -58 -58 -56 -6 -18 -20 C 20 -34 18 22 56 12 C 78 6 88 26 100 34" fill="none" stroke="TONE" stroke-width="24" stroke-linecap="round" opacity="0.85"/>' },
  delta:   { set:"ways", name:"Delta",   tone:"flow",     draw:'<g fill="none" stroke="TONE" stroke-linecap="round" opacity="0.85"><path d="M -100 -14 C -56 -28 -34 -8 -10 -2" stroke-width="26"/><path d="M -12 -2 C 18 4 42 20 98 32" stroke-width="17"/><path d="M -12 -2 C 18 -10 44 -24 98 -36" stroke-width="15"/><path d="M -12 -2 C 14 -2 44 0 96 -2" stroke-width="11" opacity="0.8"/></g>' },
  spiral:  { set:"ways", name:"Spiral",  tone:"flow",     draw:"SPIRAL" },

  /* ---- marks: things that sit on the ground ---- */
  rings:   { set:"marks", name:"Rings",   tone:"stuck",    draw:'<g fill="none" stroke="TONE" stroke-width="8"><circle r="78" opacity="0.25"/><circle r="56" opacity="0.45"/><circle r="34" opacity="0.65"/><circle r="14" opacity="0.9"/></g>' },
  crater:  { set:"marks", name:"Crater",  tone:"stuck",    draw:'<g><circle r="72" fill="TONE" opacity="0.3"/><circle r="72" fill="none" stroke="TONE" stroke-width="7" opacity="0.85"/><circle r="34" fill="var(--ground)"/><circle r="34" fill="none" stroke="TONE" stroke-width="5" opacity="0.6"/></g>' },
  burst:   { set:"marks", name:"Burst",   tone:"pressure", draw:"BURST" },
  scatter: { set:"marks", name:"Scatter", tone:"soft",     draw:'<g fill="TONE" opacity="0.7"><ellipse cx="-62" cy="-8" rx="15" ry="12"/><ellipse cx="-24" cy="-34" rx="10" ry="8"/><ellipse cx="4" cy="6" rx="18" ry="14"/><ellipse cx="40" cy="-22" rx="12" ry="10"/><ellipse cx="66" cy="14" rx="9" ry="7"/><ellipse cx="-40" cy="30" rx="11" ry="9"/><ellipse cx="22" cy="40" rx="8" ry="7"/></g>' },
  mesh:    { set:"marks", name:"Mesh",    tone:"social",   draw:"MESH" },
  arch:    { set:"marks", name:"Arch",    tone:"soft",     draw:'<g><path d="M -62 58 L -62 -8 A 62 62 0 0 1 62 -8 L 62 58 Z" fill="TONE" opacity="0.75"/><path d="M -28 58 L -28 -6 A 28 28 0 0 1 28 -6 L 28 58 Z" fill="var(--ground)"/></g>' },
  wall:    { set:"marks", name:"Wall",    tone:"pressure", draw:'<g><rect x="-96" y="-16" width="192" height="32" rx="8" fill="TONE" opacity="0.85"/><rect x="-96" y="20" width="192" height="12" rx="6" fill="TONE" opacity="0.4"/></g>' },

  /* ---- things: the twenty, covered ----
     Drawn from scratch out of circles, triangles and rounded rectangles, in the
     site's own flat idiom and its own four tones. NOT traced from the map and not
     traced from the Canva elements — which is both the licence answer and the
     reason these look like ours and not like hers. A recognisable rabbit is not
     anybody's property; a particular drawing of one is. */
  penguin:  { set:"things", name:"Penguin",  tone:"social", draw:'<g><ellipse rx="44" ry="58" fill="var(--fg)" opacity="0.92"/><ellipse cy="10" rx="28" ry="44" fill="var(--card)"/><circle cx="-14" cy="-28" r="10" fill="var(--card)"/><circle cx="14" cy="-28" r="10" fill="var(--card)"/><circle cx="-14" cy="-27" r="4" fill="var(--fg)"/><circle cx="14" cy="-27" r="4" fill="var(--fg)"/><path d="M -8 -14 L 8 -14 L 0 -3 Z" fill="TONE"/><ellipse cx="-19" cy="60" rx="15" ry="7" fill="TONE"/><ellipse cx="19" cy="60" rx="15" ry="7" fill="TONE"/></g>' },
  rabbit:   { set:"things", name:"Rabbit",   tone:"social", draw:'<g><ellipse cx="-17" cy="-34" rx="9" ry="30" fill="var(--card)" stroke="TONE" stroke-width="5"/><ellipse cx="17" cy="-34" rx="9" ry="30" fill="var(--card)" stroke="TONE" stroke-width="5"/><circle cy="4" r="32" fill="var(--card)" stroke="TONE" stroke-width="5"/><circle cx="-12" cy="-2" r="4" fill="var(--fg)"/><circle cx="12" cy="-2" r="4" fill="var(--fg)"/><path d="M -6 10 L 6 10 L 0 17 Z" fill="TONE"/><path d="M -94 64 C -70 26 -40 34 0 34 C 40 34 70 26 94 64 Z" fill="TONE" opacity="0.85"/></g>' },
  meerkat:  { set:"things", name:"Meerkat",  tone:"social", draw:'<g><path d="M -22 56 C -27 6 -18 -16 0 -16 C 18 -16 27 6 22 56 Z" fill="TONE" opacity="0.9"/><circle cy="-36" r="22" fill="TONE" opacity="0.9"/><circle cx="-17" cy="-51" r="7" fill="TONE" opacity="0.9"/><circle cx="17" cy="-51" r="7" fill="TONE" opacity="0.9"/><ellipse cx="-9" cy="-39" rx="6" ry="7" fill="var(--fg)"/><ellipse cx="9" cy="-39" rx="6" ry="7" fill="var(--fg)"/><ellipse cy="-25" rx="5" ry="4" fill="var(--fg)"/><path d="M -88 64 C -60 40 -30 46 0 46 C 30 46 60 40 88 64 Z" fill="TONE" opacity="0.5"/></g>' },
  shark:    { set:"things", name:"Shark",    tone:"soft",   draw:'<g><path d="M -22 -62 C 2 -34 16 -8 24 16 L -64 16 C -48 -10 -36 -38 -22 -62 Z" fill="TONE" opacity="0.9"/><path d="M 52 16 C 62 2 72 -8 88 -18 C 80 -2 80 8 88 22 C 72 14 62 14 52 16 Z" fill="TONE" opacity="0.75"/><path d="M -98 20 C -60 6 -20 34 18 20 C 54 8 78 28 98 18 L 98 62 L -98 62 Z" fill="var(--flow)" opacity="0.4"/><path d="M -98 20 C -60 6 -20 34 18 20 C 54 8 78 28 98 18" fill="none" stroke="var(--flow)" stroke-width="7" opacity="0.85" stroke-linecap="round"/></g>' },
  tent:     { set:"things", name:"Tent",     tone:"stuck",  draw:'<g><path d="M 0 -58 L 76 52 L -76 52 Z" fill="TONE" opacity="0.9"/><path d="M 0 -26 L 25 52 L -25 52 Z" fill="var(--ground)"/><path d="M -90 52 L 90 52" stroke="TONE" stroke-width="9" stroke-linecap="round" opacity="0.75"/></g>' },
  campfire: { set:"things", name:"Campfire", tone:"stuck",  draw:'<g><path d="M 2 -62 C 24 -32 36 -16 30 8 C 24 32 2 42 -10 34 C -28 22 -28 -4 -14 -20 C -12 -6 -4 -2 0 -8 C 8 -20 4 -42 2 -62 Z" fill="TONE" opacity="0.9"/><path d="M 4 -24 C 14 -8 16 2 11 12 C 6 22 -6 22 -11 15 C -17 7 -12 -6 -3 -14 Z" fill="var(--social)" opacity="0.95"/><rect x="-48" y="26" width="96" height="15" rx="7" fill="var(--social)" opacity="0.85" transform="rotate(-11 0 33)"/><rect x="-48" y="26" width="96" height="15" rx="7" fill="var(--social)" opacity="0.6" transform="rotate(11 0 33)"/></g>' },
  storm:    { set:"things", name:"Storm",    tone:"sky",    draw:'<g><g fill="TONE" opacity="0.9"><circle cx="-34" cy="-26" r="28"/><circle cx="2" cy="-40" r="34"/><circle cx="38" cy="-22" r="24"/><rect x="-62" y="-30" width="102" height="32" rx="16"/></g><path d="M 8 6 L -16 44 L 0 44 L -10 76 L 24 32 L 8 32 Z" fill="var(--social)"/></g>' },
  cyclone:  { set:"things", name:"Cyclone",  tone:"flow",   draw:'<g fill="TONE" opacity="0.85"><ellipse cy="-56" rx="64" ry="15"/><ellipse cy="-30" rx="52" ry="13"/><ellipse cy="-6" rx="39" ry="11"/><ellipse cy="16" rx="27" ry="9"/><ellipse cy="36" rx="15" ry="7"/><ellipse cy="54" rx="7" ry="5"/></g>' },
  canyon:   { set:"things", name:"Canyon",   tone:"social", draw:'<g><path d="M -98 -62 L -30 -62 L -22 -30 L -40 -4 L -24 22 L -34 62 L -98 62 Z" fill="TONE" opacity="0.9"/><path d="M -30 -62 L -22 -30 L -40 -4 L -24 22 L -34 62 L -50 62 L -42 20 L -56 -6 L -40 -30 L -48 -62 Z" fill="var(--fg)" opacity="0.13"/><path d="M 98 -62 L 34 -62 L 26 -30 L 42 -4 L 28 22 L 38 62 L 98 62 Z" fill="TONE" opacity="0.62"/><path d="M -20 -62 C -12 -20 -22 20 -26 62 L 30 62 C 24 20 16 -20 26 -62 Z" fill="var(--flow)" opacity="0.5"/><path d="M -20 -62 C -12 -20 -22 20 -26 62" fill="none" stroke="var(--flow)" stroke-width="5" opacity="0.7"/></g>' },
  whirl:    { set:"things", name:"Whirlpool", tone:"stuck", draw:"WHIRL" },
  wave:     { set:"things", name:"Wave",     tone:"flow",   draw:'<g><path d="M -96 30 C -62 -34 -18 -36 8 2 C 28 30 54 30 70 8 C 79 -4 88 -8 96 -6 L 96 58 L -96 58 Z" fill="TONE" opacity="0.45"/><path d="M -96 30 C -62 -34 -18 -36 8 2" fill="none" stroke="TONE" stroke-width="9" opacity="0.9" stroke-linecap="round"/><path d="M 8 2 C 28 30 54 30 70 8" fill="none" stroke="TONE" stroke-width="8" opacity="0.7" stroke-linecap="round"/></g>' },
  pebble:   { set:"things", name:"Pebble",   tone:"soft",   draw:'<g fill="TONE"><ellipse cx="-18" cy="10" rx="46" ry="34" opacity="0.8"/><ellipse cx="36" cy="26" rx="25" ry="18" opacity="0.55"/><ellipse cx="-30" cy="-2" rx="16" ry="10" opacity="0.35"/></g>' },
  /* The runner and the roots are underground and the shoots are not, which is
     what the two tones are for. */
  rhizome:  { set:"things", name:"Rhizome",  tone:"leaf",   draw:'<g fill="none" stroke="var(--social)" stroke-linecap="round" opacity="0.9"><path d="M -94 2 C -60 -20 -20 18 12 0 C 44 -18 70 8 96 -4" stroke-width="13"/><path d="M -58 -10 C -66 10 -74 20 -80 36" stroke-width="7" opacity="0.6"/><path d="M -10 6 C -6 24 0 34 4 50" stroke-width="7" opacity="0.6"/><path d="M 42 -6 C 48 14 54 24 60 42" stroke-width="7" opacity="0.6"/></g><g fill="none" stroke="TONE" stroke-linecap="round" opacity="0.9"><path d="M -58 -10 C -62 -26 -56 -38 -58 -52" stroke-width="9"/><path d="M -10 6 C -14 -12 -6 -24 -8 -38" stroke-width="9"/><path d="M 42 -6 C 38 -24 46 -34 44 -48" stroke-width="9"/></g><g fill="var(--social)" opacity="0.95"><circle cx="-58" cy="-10" r="12"/><circle cx="-10" cy="6" r="12"/><circle cx="42" cy="-6" r="12"/></g><g fill="TONE" opacity="0.85"><ellipse cx="-58" cy="-56" rx="11" ry="8"/><ellipse cx="-8" cy="-42" rx="11" ry="8"/><ellipse cx="44" cy="-52" rx="11" ry="8"/></g>' },
  sparkle:  { set:"things", name:"Sparkle",  tone:"pressure", draw:"SPARKLE" },
  pair:     { set:"things", name:"Pair",     tone:"social", draw:'<g><g fill="TONE" opacity="0.85"><circle cx="-36" cy="-28" r="21"/><path d="M -68 54 C -68 14 -52 0 -36 0 C -20 0 -4 14 -4 54 Z"/></g><g fill="var(--flow)" opacity="0.75"><circle cx="36" cy="-20" r="18"/><path d="M 8 54 C 8 20 22 8 36 8 C 50 8 64 20 64 54 Z"/></g></g>' },
  heart:    { set:"things", name:"Heart",    tone:"stuck",  draw:'<path d="M 0 58 C -72 8 -62 -48 -23 -48 C -9 -48 0 -35 0 -25 C 0 -35 9 -48 23 -48 C 62 -48 72 8 0 58 Z" fill="TONE" opacity="0.85"/>' },
  octopus:  { set:"things", name:"Octopus",  tone:"stuck",  draw:'<g><path d="M -46 -8 C -46 -54 -22 -74 0 -74 C 22 -74 46 -54 46 -8 C 46 8 30 14 0 14 C -30 14 -46 8 -46 -8 Z" fill="TONE" opacity="0.92"/><circle cx="-17" cy="-28" r="7" fill="var(--card)"/><circle cx="17" cy="-28" r="7" fill="var(--card)"/><circle cx="-17" cy="-28" r="3.5" fill="var(--fg)"/><circle cx="17" cy="-28" r="3.5" fill="var(--fg)"/><g fill="none" stroke="TONE" stroke-width="13" stroke-linecap="round" opacity="0.85"><path d="M -38 6 C -54 28 -62 48 -50 62 C -42 70 -32 64 -34 54"/><path d="M -20 12 C -28 36 -30 54 -18 66"/><path d="M -3 14 C -5 40 -7 58 3 70"/><path d="M 16 12 C 22 38 24 54 14 66"/><path d="M 34 6 C 50 28 58 48 46 62 C 38 70 28 64 30 54"/></g></g>' },
  mushroom: { set:"things", name:"Mushroom", tone:"stuck",  draw:'<g><path d="M -20 12 C -17 38 -22 56 -15 66 L 15 66 C 22 56 17 38 20 12 Z" fill="var(--card)" stroke="TONE" stroke-width="4" opacity="0.95"/><path d="M -64 4 C -64 -36 -33 -62 0 -62 C 33 -62 64 -36 64 4 C 64 13 40 18 0 18 C -40 18 -64 13 -64 4 Z" fill="TONE" opacity="0.92"/><g fill="var(--card)" opacity="0.85"><ellipse cx="-34" cy="-14" rx="11" ry="9"/><ellipse cx="2" cy="-32" rx="9" ry="7"/><ellipse cx="30" cy="-10" rx="12" ry="9"/><ellipse cx="-10" cy="2" rx="7" ry="5"/></g></g>' },
  hole:     { set:"things", name:"Hole",     tone:"social", draw:'<g><ellipse cy="12" rx="74" ry="42" fill="TONE" opacity="0.55"/><ellipse cy="14" rx="58" ry="31" fill="TONE" opacity="0.5"/><ellipse cy="10" rx="52" ry="27" fill="var(--fg)" opacity="0.82"/><ellipse cy="2" rx="40" ry="18" fill="var(--fg)" opacity="0.5"/></g>' },
  mound:    { set:"things", name:"Mound",    tone:"social", draw:'<g fill="TONE"><path d="M -86 46 C -70 4 -40 -32 0 -32 C 40 -32 70 4 86 46 Z" opacity="0.85"/><ellipse cx="-58" cy="52" rx="17" ry="8" opacity="0.6"/><ellipse cx="32" cy="54" rx="12" ry="6" opacity="0.5"/><ellipse cx="66" cy="50" rx="9" ry="5" opacity="0.45"/><ellipse cx="-14" cy="6" rx="22" ry="11" opacity="0.25"/></g>' },
  butterfly:{ set:"things", name:"Butterfly",tone:"pressure", draw:'<g><g fill="TONE" opacity="0.85"><path d="M -7 -6 C -30 -58 -78 -64 -86 -36 C -92 -12 -50 6 -7 4 Z"/><path d="M 7 -6 C 30 -58 78 -64 86 -36 C 92 -12 50 6 7 4 Z"/><path d="M -7 8 C -34 16 -66 40 -54 60 C -42 76 -14 48 -7 26 Z"/><path d="M 7 8 C 34 16 66 40 54 60 C 42 76 14 48 7 26 Z"/></g><g fill="TONE" opacity="0.45"><circle cx="-46" cy="-30" r="10"/><circle cx="46" cy="-30" r="10"/></g><ellipse cy="6" rx="6" ry="36" fill="var(--fg)" opacity="0.85"/><g fill="none" stroke="var(--fg)" stroke-width="3" stroke-linecap="round" opacity="0.8"><path d="M -3 -28 C -10 -46 -18 -54 -28 -58"/><path d="M 3 -28 C 10 -46 18 -54 28 -58"/></g></g>' },
  star:     { set:"things", name:"Star",     tone:"social", draw:"STAR" },
  pine:     { set:"things", name:"Pine",     tone:"leaf",   draw:'<g><rect x="-9" y="26" width="18" height="34" rx="5" fill="var(--social)" opacity="0.8"/><g fill="TONE" opacity="0.9"><path d="M 0 -64 L 28 -20 L -28 -20 Z"/><path d="M 0 -40 L 40 8 L -40 8 Z"/><path d="M 0 -14 L 52 40 L -52 40 Z"/></g></g>' }
};

export const SETS = [
  ["islands","Islands", "Start here. These go behind everything else."],
  ["ground", "Ground",  "What an area is made of."],
  ["ways",   "Ways",    "Things you travel along, or round and round."],
  ["marks",  "Marks",   "Things that sit on the ground."],
  ["things", "Things",  "The twenty, covered. Drawn by us, from scratch — combine them, and nobody's map has to look like anybody else's."]
];

/* Three shapes are generated rather than typed out, because long hand-written
   path data is where drawings go wrong silently. */
(function generate() {
  var pts = [], k, a, r;
  for (k = 0; k < 150; k++) { a = k * 0.22; r = 3 + k * 0.52; pts.push((r*Math.cos(a)).toFixed(1) + "," + (r*Math.sin(a)).toFixed(1)); }
  SHAPES.spiral.draw = '<polyline points="' + pts.join(" ") + '" fill="none" stroke="TONE" stroke-width="8" stroke-linecap="round" opacity="0.85"/>';

  var t = [], n;
  for (k = 0; k < 120; k++) {
    a = k * 0.19; r = 74 - k * 0.52;
    t.push((-70 + k * 1.2 + r * 0.42 * Math.cos(a)).toFixed(1) + "," + (r * 0.5 * Math.sin(a)).toFixed(1));
  }
  SHAPES.tendril.draw = '<polyline points="' + t.join(" ") + '" fill="none" stroke="TONE" stroke-width="9" stroke-linecap="round" opacity="0.9"/>';

  var rays = "";
  for (k = 0; k < 14; k++) {
    a = (k / 14) * Math.PI * 2;
    n = (k % 2) ? 44 : 84;
    rays += '<line x1="' + (18*Math.cos(a)).toFixed(1) + '" y1="' + (18*Math.sin(a)).toFixed(1) +
            '" x2="' + (n*Math.cos(a)).toFixed(1) + '" y2="' + (n*Math.sin(a)).toFixed(1) + '"/>';
  }
  SHAPES.burst.draw = '<g stroke="TONE" stroke-width="9" stroke-linecap="round" opacity="0.85">' + rays +
                      '</g><circle r="13" fill="TONE" opacity="0.85"/>';

  /* ---- coastlines -----------------------------------------------------
     A seeded generator, so every island is a different irregular shape and
     the same one every time the page loads. Points are sampled round an
     ellipse with the radius wobbling, then smoothed through their midpoints,
     which is what keeps a coastline from looking like a cut gem. */
  function rnd(seed) {
    var s = seed;
    return function () { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
  }
  function coast(seed, rx, ry, wobble) {
    var r = rnd(seed), n = 20, raw = [], i, j;
    for (i = 0; i < n; i++) raw.push(r());
    var pts = [];
    for (i = 0; i < n; i++) {
      /* average three neighbours so the wobble is lumpy, not spiky */
      var w = (raw[i] + raw[(i + 1) % n] + raw[(i + 2) % n]) / 3;
      var k = 1 - wobble / 2 + wobble * w;
      var a = (i / n) * Math.PI * 2;
      pts.push([Math.cos(a) * rx * k, Math.sin(a) * ry * k]);
    }
    var mid = function (p, q) { return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; };
    var m = mid(pts[n - 1], pts[0]);
    var d = "M " + m[0].toFixed(1) + " " + m[1].toFixed(1);
    for (i = 0; i < n; i++) {
      j = (i + 1) % n;
      var e = mid(pts[i], pts[j]);
      d += " Q " + pts[i][0].toFixed(1) + " " + pts[i][1].toFixed(1) + " " + e[0].toFixed(1) + " " + e[1].toFixed(1);
    }
    return d + " Z";
  }
  /* Land alone, or land with a beach: the same coastline drawn twice, the sand at
     full size and the land inside it. The opacity sits on the group and the fills
     are solid, so an island made of two overlapping coastlines has no seam down
     the middle where the two halves double up. */
  function isle(seed, rx, ry, wob, beach, extra, lobe) {
    var body = '<path d="' + coast(seed, rx, ry, wob) + '"/>';
    if (lobe) {
      body += '<path d="' + coast(lobe[0], lobe[1], lobe[2], wob) +
              '" transform="translate(' + lobe[3] + ' ' + lobe[4] + ')"/>';
      /* Recentred on the pair, or the island hangs off to one side of the
         place you dropped it. */
      body = '<g transform="translate(' + (-lobe[3] / 2) + ' ' + (-lobe[4] / 2) + ')">' + body + "</g>";
    }
    var out = '<g fill="TONE" opacity="0.5">' + body + "</g>";
    if (beach) {
      out += '<g transform="scale(0.86)" fill="var(--leaf)" opacity="0.5">' + body + "</g>";
    } else if (!lobe) {
      /* An outline only where there is one coastline to outline. Stroking a
         two-lobed island draws the seam where the lobes overlap, and a coastline
         with a join across it is not a coastline. */
      out += '<g fill="none" stroke="TONE" stroke-width="3" opacity="0.45">' + body + "</g>";
    }
    return "<g>" + out + (extra || "") + "</g>";
  }
  SHAPES.isleRound.draw = isle(7, 96, 74, 0.34, false);
  SHAPES.isleLong.draw  = isle(23, 122, 50, 0.3, false);
  /* Two lobes joined at a neck — a shape no amount of wobble on one coastline
     will give you, so it is two coastlines overlapping. */
  SHAPES.isleLobed.draw = isle(41, 62, 54, 0.4, false, "", [77, 56, 44, 66, 26]);
  SHAPES.isleSand.draw  = isle(58, 98, 76, 0.32, true);
  /* A bay is an island with water bitten out of it, so the water goes on top. */
  SHAPES.isleBay.draw   = isle(66, 106, 74, 0.4, true,
    '<path d="' + coast(91, 44, 34, 0.45) + '" transform="translate(40 26)" fill="var(--flow)" opacity="0.45"/>');
  SHAPES.isleGroup.draw = isle(84, 84, 62, 0.4, true,
    '<g transform="translate(-104 46) scale(0.34)"><path d="' + coast(12, 96, 74, 0.4) + '" fill="TONE" opacity="0.5"/><g transform="scale(0.86)"><path d="' + coast(12, 96, 74, 0.4) + '" fill="var(--leaf)" opacity="0.5"/></g></g>' +
    '<g transform="translate(96 -52) scale(0.26)"><path d="' + coast(33, 96, 74, 0.4) + '" fill="TONE" opacity="0.5"/><g transform="scale(0.86)"><path d="' + coast(33, 96, 74, 0.4) + '" fill="var(--leaf)" opacity="0.5"/></g></g>');

  /* A five-pointed star, which is a different thing from the four-pointed
     sparkle and wanted for different reasons. */
  var sp = [];
  for (k = 0; k < 10; k++) {
    a = -Math.PI / 2 + (k / 10) * Math.PI * 2;
    r = (k % 2) ? 30 : 74;
    sp.push((r * Math.cos(a)).toFixed(1) + " " + (r * Math.sin(a)).toFixed(1));
  }
  SHAPES.star.draw = '<path d="M ' + sp.join(" L ") + ' Z" fill="TONE" opacity="0.9"/>';

  /* A whirlpool is a spiral that thins as it goes down, so it is drawn segment by
     segment with the width tapering — one stroked path cannot taper, and SVG arc
     flags tangle into knots at this size. */
  var seg = "", px = null, py, w, o;
  for (k = 0; k < 130; k++) {
    a = k * 0.19; r = 80 - k * 0.56;
    var qx = r * Math.cos(a), qy = r * Math.sin(a) * 0.86;
    if (px !== null) {
      w = (15 - k * 0.085).toFixed(1);
      o = (0.35 + k * 0.004).toFixed(2);
      seg += '<path d="M ' + px.toFixed(1) + " " + py.toFixed(1) + " L " + qx.toFixed(1) + " " + qy.toFixed(1) +
             '" stroke-width="' + w + '" opacity="' + o + '"/>';
    }
    px = qx; py = qy;
  }
  SHAPES.whirl.draw = '<g fill="none" stroke="TONE" stroke-linecap="round">' + seg + '</g><circle r="9" fill="TONE"/>';

  /* Four-pointed stars, three sizes. Joy, awe and wonder. */
  function star(cx, cy, rad) {
    var w = rad * 0.2;
    return "M " + cx + " " + (cy - rad) + " L " + (cx + w) + " " + (cy - w) +
           " L " + (cx + rad) + " " + cy + " L " + (cx + w) + " " + (cy + w) +
           " L " + cx + " " + (cy + rad) + " L " + (cx - w) + " " + (cy + w) +
           " L " + (cx - rad) + " " + cy + " L " + (cx - w) + " " + (cy - w) + " Z";
  }
  SHAPES.sparkle.draw =
    '<g fill="TONE"><path d="' + star(-8, -6, 62) + '" opacity="0.9"/>' +
    '<path d="' + star(52, 34, 30) + '" opacity="0.7"/>' +
    '<path d="' + star(-62, 40, 22) + '" opacity="0.55"/>' +
    '<path d="' + star(44, -46, 18) + '" opacity="0.5"/></g>';

  var lines = "";
  for (k = -3; k <= 3; k++) {
    lines += '<line x1="' + (k*26 - 60) + '" y1="-60" x2="' + (k*26 + 60) + '" y2="60"/>';
    lines += '<line x1="' + (k*26 - 60) + '" y1="60" x2="' + (k*26 + 60) + '" y2="-60"/>';
  }
  SHAPES.mesh.draw = '<g stroke="TONE" stroke-width="5" stroke-linecap="round" opacity="0.55">' + lines + '</g>';
})();

/** The tray is grouped by what a shape does, so every shape has to belong to a group
 *  that exists, and every group has to have something in it. A shape with a set of
 *  "thigns" would silently never be rendered. */
export function validate() {
  const problems = [];
  const sets = new Set(SETS.map(([id]) => id));
  for (const [id, sh] of Object.entries(SHAPES)) {
    if (!sets.has(sh.set)) problems.push(`${id}: set "${sh.set}" is not one of ${[...sets].join(', ')}`);
    if (!sh.name) problems.push(`${id}: no name, and the name is what a screen reader announces`);
    if (!sh.draw || /^[A-Z]+$/.test(sh.draw)) problems.push(`${id}: draw is still the placeholder "${sh.draw}" — its generator did not run`);
    if (sh.draw && sh.draw.includes('#')) problems.push(`${id}: a literal colour, which cannot follow the theme — use a token`);
  }
  for (const [id, label] of SETS) {
    if (!Object.values(SHAPES).some((sh) => sh.set === id)) problems.push(`set "${label}" has no shapes in it`);
  }
  return problems;
}
