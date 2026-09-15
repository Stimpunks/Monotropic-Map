/**
 * areas.mjs — the twenty areas of the Map of Monotropic Experiences.
 *
 * AUTHORED, not derived. Every field here is a judgement or a citation, and nothing
 * computes it. This is the single source for the map hotspots, the list view, the
 * twenty area pages, /search-index.json, /llms.txt and the sitemap. Kept in more than
 * one place it would drift, and the drift would be silent in the worst direction: an
 * area announced to agents that a reader cannot reach, or the reverse.
 *
 * `label` IS THE MAP'S OWN WORDING and does not always match the numbered list in the
 * published articles — the map prints "River Banks of Monotropic Time", the list writes
 * "Riverbanks". The map wins here, because a visitor is reading the picture. `title` is
 * what the area page is called.
 *
 * `who` IS THE SOURCE OF THE QUOTED DEFINITION, and `coiner` is the person who named
 * the thing when that is somebody else — limerence is Dorothy Tennov's word, quoted here
 * from Psychology Today. Do not collapse the two: pinning a person's name to a link that
 * is not theirs is the failure this file exists to prevent.
 *
 * `who` IS NOT OPTIONAL. This is a map of other people's coinages, and the credit is the
 * content. An area with no named originator has `who: null` and says so on its page —
 * never a silent blank, and never our name by default.
 *
 * `hot` is [x, y] as a percentage of the 1080x1080 artwork, measured from the label on
 * Helen Edgar's original. It positions a hotspot OVER her art; it never alters it.
 *
 * `plain` IS THE PLAIN-LANGUAGE DEFINITION, and it comes FIRST on the page — before the
 * quoted one, not after it as a simplified afterthought. The glossary entries this is derived
 * from are collections of academic quotations; useful, and not the first thing somebody
 * meeting an idea should have to read. Target is ASAN's: 10-15 words a sentence, one idea a
 * sentence, everyday words. `validate()` enforces the sentence length so it cannot drift back
 * into prose.
 *
 * `helps` IS NEW TEXT AND IS ABOUT THE ENVIRONMENT, NEVER THE PERSON. This is the one
 * rule that keeps the site from reading as a personality quiz: a stuck state is produced
 * by conditions, so the sentence names the conditions that change. "Rest more" is the
 * failure mode. See DECISIONS.md — this text is ours, drafted for Helen's review.
 */

/** The four kinds of place. From Helen Edgar's own grouping of the map in
 *  "Autism & The Map of Neuronormative Domination: Stuck States vs Flow States"
 *  (2025-02-05), which sorts the areas into stuck states, flow states, and
 *  monotropic socialising. `pressure` is the fourth: the areas that are not places
 *  you are but forces acting on everything else. */
export const STATES = new Map([
  ['flow',     { name: 'Flow',            blurb: 'Where monotropic attention does what it does well. These are not indulgences; they are how a monotropic bodymind refuels.' }],
  ['social',   { name: 'Connection',      blurb: 'Monotropic socialising, and the environments that make it possible.' }],
  ['stuck',    { name: 'Stuck',           blurb: 'States of inertia — unable to start, or unable to stop. Produced by conditions, not by character.' }],
  ['pressure', { name: 'Pressure',        blurb: 'Not places you are, but forces acting on everything else here. These come from outside and they are made by people.' }],
]);

export const AREAS = [
  {
    n: 1,
    slug: 'attention-tunnels',
    label: 'Attention Tunnels',
    title: 'Attention Tunnels',
    state: 'flow',
    hot: [30, 16],
    plain: "Your attention goes deep into one thing. The rest of the world fades out. It feels good, and it helps you think. Coming back out again is hard.",
    gloss: 'Entering flow states — or attention tunnels — is a necessary coping strategy for many of us. Flow states are the pinnacle of intrinsic motivation.',
    who: { name: 'Fergus Murray', url: 'https://oolong.medium.com/craft-flow-and-cognitive-styles-a47f827fcd6a' },
    stimpunks: 'https://stimpunks.org/glossary/flow/',
    helps: 'Time that is not interrupted, and a warning before it ends. A tunnel is cheap to stay in and expensive to re-enter, so the thing an environment can give is a long uninterrupted stretch and notice before the end of it.',
    borders: ['river-of-monotropic-flow-states', 'tendril-theory', 'sudden-storms-of-unexpected-events'],
    sibling: null,
  },
  {
    n: 2,
    slug: 'penguin-pebbling-cove-of-friendship',
    label: 'Penguin Pebbling Cove of Friendship',
    title: 'Penguin Pebbling Cove of Friendship',
    state: 'social',
    hot: [60, 16],
    plain: "You send someone a small thing you found. A link, a photo, a funny picture. It means: I was thinking about you. It is a way of saying love.",
    gloss: '“Penguin pebbling” is a little exchange between two people to show that they care and want to build a meaningful connection.',
    who: { name: 'Helen Edgar', url: 'https://autisticrealms.com/penguin-pebbling-an-autistic-love-language/' },
    stimpunks: 'https://stimpunks.org/glossary/penguin-pebbling/',
    helps: 'Somewhere to put the pebble, and people who know what one is. A link sent with no message is a whole sentence; an environment that reads it as noise is the thing that needs to change.',
    borders: ['rhizomatic-communities', 'forest-of-joy-awe-and-wonder', 'infodump-canyon'],
    sibling: { name: 'Penguin Pebbling', url: 'https://penguinpebbling.app/' },
  },
  {
    n: 3,
    slug: 'tendril-theory',
    label: 'Tendril Theory',
    title: 'Tendril Theory',
    state: 'flow',
    hot: [89, 27],
    plain: "When you focus, your mind reaches out like lots of vines. To stop, you have to pull every vine back in. That takes time. Being rushed hurts.",
    gloss: 'When I’m focused on something, my mind sends out a million tendrils of thought, expands into all of the thoughts &amp; feelings. When I need to switch tasks, I must retract all of the tendrils of my mind. This takes some time.',
    who: { name: 'Erin Human', url: 'https://eisforerin.com/2015/08/10/tendril-theory/' },
    stimpunks: 'https://stimpunks.org/glossary/tendril-theory/',
    helps: 'Transitions with a runway. The cost is in the retraction, not the task, so the change an environment can make is to stop treating “just switch to this quickly” as a small ask.',
    borders: ['attention-tunnels', 'river-banks-of-monotropic-time', 'sudden-storms-of-unexpected-events'],
    sibling: null,
  },
  {
    n: 4,
    slug: 'mountains-of-ruminating-thoughts',
    label: 'Mountains of Ruminating Thoughts',
    title: 'Mountains of Ruminating Thoughts',
    state: 'stuck',
    hot: [7, 19],
    plain: "The same thought goes round and round. You cannot put it down. It gets in the way, and it can leave you tired or cross.",
    gloss: 'When your thoughts are all swirly and you just keep chewing on the same thought over and over and you can’t stop thinking about it and it’s distracting you and sometimes even putting you in a really bad mood or making you irritable.',
    who: { name: 'Dusty Chipura', url: 'https://twitter.com/dustychipura/status/1303759000022908928' },
    stimpunks: 'https://stimpunks.org/glossary/rumination/',
    helps: 'Resolution, or permission to stop waiting for it. A great deal of rumination is an unanswered question held open by somebody else — a decision not made, a reply not sent, a rule nobody will state plainly.',
    borders: ['cyclones-of-unmet-needs', 'meerkat-mounds', 'burnout-whirlpools'],
    sibling: null,
  },
  {
    n: 5,
    slug: 'cyclones-of-unmet-needs',
    label: 'Cyclones of Unmet Needs',
    title: 'Cyclones of Unmet Needs',
    state: 'pressure',
    hot: [8, 33],
    plain: "You asked for help and did not get it. The gap between what you need and what you are given keeps growing.",
    gloss: 'Mismatch between the areas we actually receive support, compared to the areas we would ideally like support.',
    who: { name: 'Cassidy et al.', url: 'https://molecularautism.biomedcentral.com/articles/10.1186/s13229-018-0226-4' },
    stimpunks: 'https://stimpunks.org/glossary/unmet-needs/',
    helps: 'Meeting the need. This one is not a metaphor and it does not need reframing — it is a gap between support asked for and support given, and it closes from the side that holds the resources.',
    borders: ['shark-infested-waters', 'burnout-whirlpools', 'mountains-of-ruminating-thoughts'],
    sibling: null,
  },
  {
    n: 6,
    slug: 'rabbit-holes-of-research',
    label: 'Rabbit Holes of Research',
    title: 'Rabbit Holes of Research',
    state: 'flow',
    hot: [36, 31],
    plain: "You start looking one thing up. Hours later you are still going. You end up knowing a great deal about it.",
    gloss: '“Down the rabbit hole” is an English-language idiom or trope which refers to getting deep into something, or ending up somewhere strange.',
    who: null,
    stimpunks: 'https://stimpunks.org/glossary/rabbit-hole/',
    helps: 'Being allowed to go all the way down. Depth is the point, and an environment that rewards only breadth is asking a monotropic mind to work against its own grain and calling the result a focus problem.',
    borders: ['infodump-canyon', 'attention-tunnels', 'river-of-monotropic-flow-states'],
    sibling: null,
  },
  {
    n: 7,
    slug: 'infodump-canyon',
    label: 'Infodump Canyon',
    title: 'Infodump Canyon',
    state: 'social',
    hot: [64, 34],
    plain: "You tell someone everything about a thing you love. All of the detail. This is a gift, not a lecture.",
    gloss: 'Talking a lot about a topic in great detail.',
    who: null,
    stimpunks: 'https://stimpunks.org/glossary/infodump/',
    helps: 'Somewhere it lands as a gift. An infodump is an act of intimacy — it is how a lot of us say *I want you to have this* — and a room that hears it as domination will get less of everything, not just less talking.',
    borders: ['rabbit-holes-of-research', 'penguin-pebbling-cove-of-friendship', 'rhizomatic-communities'],
    sibling: null,
  },
  {
    n: 8,
    slug: 'rhizomatic-communities',
    label: 'Rhizomatic Communities',
    title: 'Rhizomatic Communities',
    state: 'social',
    hot: [23, 42],
    plain: "Lots of small Autistic groups, all joined up. Nobody is in charge. If one group stops, the rest carry on.",
    gloss: 'A growing and evolving network of Autistic communities with no hierarchy or dependence on anothers existence.',
    who: { name: 'Helen Edgar', url: 'https://autisticrealms.com/the-autistic-rhizome/' },
    stimpunks: 'https://stimpunks.org/glossary/autistic-rhizome/',
    helps: 'No single point of failure. A rhizome survives because nothing at its centre can be captured — which is also why it resists being organised into something legible by an institution.',
    borders: ['penguin-pebbling-cove-of-friendship', 'campsite-of-cavendish-spaces', 'forest-of-joy-awe-and-wonder'],
    sibling: { name: 'Star Stuff', url: 'https://starstuff.earth/' },
  },
  {
    n: 9,
    slug: 'river-of-monotropic-flow-states',
    label: 'River of Monotropic Flow States',
    title: 'River of Monotropic Flow States',
    state: 'flow',
    hot: [54, 46],
    plain: "You are deep in something and time goes soft. Your body settles. This is how a monotropic person gets energy back.",
    gloss: 'Entering flow states — or attention tunnels — is a necessary coping strategy for many of us. Flow states are the pinnacle of intrinsic motivation.',
    who: { name: 'Fergus Murray', url: 'https://oolong.medium.com/craft-flow-and-cognitive-styles-a47f827fcd6a' },
    stimpunks: 'https://stimpunks.org/glossary/flow/',
    helps: 'Let the river run. Flow is how a monotropic bodymind recharges, so time in it is not time off the work — and an environment that treats it as a reward to be earned after the real tasks has the arithmetic backwards.',
    borders: ['attention-tunnels', 'river-banks-of-monotropic-time', 'burnout-whirlpools'],
    sibling: null,
  },
  {
    n: 10,
    slug: 'campsite-of-cavendish-spaces',
    label: 'Campsite of Cavendish Spaces',
    title: 'Campsite of Cavendish Spaces',
    state: 'social',
    hot: [78, 46],
    plain: "A place that fits your body and your senses. Somewhere you can work, rest, or be with people without it costing you.",
    gloss: 'Psychologically and sensory safe spaces suited to zone work, flow states, intermittent collaboration, and collaborative niche construction.',
    who: { name: 'Ryan Boren', url: 'https://stimpunks.org/space/cavendish/' },
    stimpunks: 'https://stimpunks.org/space/cavendish/',
    helps: 'Cave, campfire, watering hole, library, habitat — and the ability to choose between them. The point is not one perfect room; it is that a person can move to the zone that fits what they are doing right now.',
    borders: ['rhizomatic-communities', 'beach-of-body-doubling', 'forest-of-joy-awe-and-wonder'],
    sibling: { name: 'Cavendish Cards', url: 'https://cavendish.app/' },
  },
  {
    n: 11,
    slug: 'meerkat-mounds',
    label: 'Meerkat Mounds',
    title: 'Meerkat Mounds',
    state: 'stuck',
    hot: [27, 52],
    plain: "You are watching for danger all the time. You cannot settle into anything. This happens when a place does not feel safe.",
    gloss: 'Heightened state of vigilance and arousal that involves constantly looking for danger and threat. It is more than hyper-arousal, it is an overwhelmed monotropic person desperately looking for a hook into a monotropic flow-state.',
    who: { name: 'Tanya Adkin &amp; David Gray-Hammond', url: 'https://emergentdivergence.com/2023/06/06/what-is-meerkat-mode-and-how-does-it-relate-to-audhd/' },
    stimpunks: 'https://stimpunks.org/glossary/meerkat-mode/',
    helps: 'Removing the threat, not the vigilance. Meerkat mode is an accurate reading of an unsafe room. It stops when the room is safe, and telling somebody to calm down inside it is asking them to stop perceiving correctly.',
    borders: ['mountains-of-ruminating-thoughts', 'shark-infested-waters', 'burnout-whirlpools'],
    sibling: null,
  },
  {
    n: 12,
    slug: 'river-banks-of-monotropic-time',
    label: 'River Banks of Monotropic Time',
    title: 'Riverbanks of Monotropic Time',
    state: 'flow',
    hot: [39, 48],
    plain: "Deep focus changes time. An hour can feel like ten minutes. The outside world melts away for a while.",
    gloss: 'When absorbed in our special interests or passions it can feel like entering a portal. Normal time can feel like it is dissolving, the outside world may feel like it is melting away. This can be really rejuvenating for the sensory system and help to recharge the bodymind.',
    who: { name: 'Helen Edgar', url: 'https://autisticrealms.com/monotropic-time/' },
    stimpunks: 'https://stimpunks.org/glossary/monotropic-time/',
    helps: 'Clocks that bend. Deadlines that arrive without warning, meetings that fragment a day into unusable pieces, and “it only takes five minutes” are all the same request: leave monotropic time and keep working anyway.',
    borders: ['river-of-monotropic-flow-states', 'tendril-theory', 'attention-tunnels'],
    sibling: null,
  },
  {
    n: 13,
    slug: 'shark-infested-waters',
    label: 'Shark Infested Waters of Neuronormativity and Behaviourism &amp; Double Empathy Problems',
    title: 'Shark Infested Waters',
    state: 'pressure',
    hot: [11, 91],
    plain: "The water around everything else. It is the idea that there is one right way to have a mind. It is in schools, jobs and doctors' rooms.",
    gloss: 'The water the whole map sits in: neuronormativity, behaviourism, and the double empathy problem. Neuronormativity is the assumption that there is a correct way to exist in this world. Behaviorism reduces human beings to simple inputs and outputs. The double empathy problem names the mutual incomprehension between people of different dispositional outlooks — mutual, and not the Autistic person’s fault.',
    who: { name: 'Damian Milton', url: 'https://www.autscape.org/2013/programme/handouts/Double%20empathy%20problem.pdf' },
    stimpunks: 'https://stimpunks.org/glossary/double-empathy-problem/',
    helps: 'Nothing a person does to themselves. These are the conditions the rest of the map sits in, and they are made and maintained by institutions. This is the area that has a politics rather than a coping strategy.',
    borders: ['cyclones-of-unmet-needs', 'meerkat-mounds', 'burnout-whirlpools'],
    sibling: null,
  },
  {
    n: 14,
    slug: 'beach-of-body-doubling',
    label: 'Beach of Body Doubling',
    title: 'Beach of Body Doubling',
    state: 'social',
    hot: [38, 81],
    plain: "Someone sits nearby while you work. They do not help you and they do not watch you. Having them there makes it easier to start.",
    gloss: 'A “body double” is a person or even pet who is present with us while we work. This provides a gentle form of accountability — their presence serves as a reminder of what we’re supposed to be doing so we’re less likely to get distracted.',
    who: { name: 'Jessica McCabe', url: 'https://www.youtube.com/watch?v=ni9biXNDZe0' },
    stimpunks: 'https://stimpunks.org/glossary/body-doubling/',
    helps: 'Company without supervision. The difference matters: a body double is present, not watching. The moment presence becomes monitoring it stops working and starts costing.',
    borders: ['campsite-of-cavendish-spaces', 'rhizomatic-communities', 'river-of-monotropic-flow-states'],
    sibling: null,
  },
  {
    n: 15,
    slug: 'burnout-whirlpools',
    label: 'Burnout Whirlpools',
    title: 'Burnout Whirlpools',
    state: 'stuck',
    hot: [53, 61],
    plain: "You have run on empty for years. Now things you used to do are too hard. Rest on its own does not fix it. The demands have to come down.",
    gloss: 'Autistic burnout is a state of physical and mental fatigue, heightened stress, and diminished capacity to manage life skills, sensory input, and/or social interactions, which comes from years of being severely overtaxed by the strain of trying to live up to demands that are out of sync with our needs.',
    who: { name: 'Dora Raymaker', url: 'https://pubmed.ncbi.nlm.nih.gov/32851204/' },
    stimpunks: 'https://stimpunks.org/burnout/',
    helps: 'Lowering the demands that caused it. Burnout is manufactured by years of mismatch, so it is not cured by resilience training, and a return to the same conditions is a return to the whirlpool.',
    borders: ['cyclones-of-unmet-needs', 'shark-infested-waters', 'meerkat-mounds'],
    sibling: null,
  },
  {
    n: 16,
    slug: 'panic-hills-of-low-object-permanence',
    label: 'Panic Hills of Low Object Permanence',
    title: 'Panic Hills of Low Object Permanence',
    state: 'stuck',
    hot: [81, 63],
    plain: "Out of sight, out of mind. Things, jobs and people you cannot see can drop away. Then you remember, and it is a shock.",
    gloss: 'Autistic children have difficulties with their understanding of: what’s here, what’s now, what is permanent, and so on.',
    who: { name: 'Wenn Lawson', url: 'https://www.researchgate.net/publication/319456203_Problems_with_Object_Permanence_Rethinking_Traditional_Beliefs_Associated_with_Poor_Theory_of_Mind_in_Autism' },
    stimpunks: 'https://stimpunks.org/glossary/object-permanence/',
    helps: 'Making things visible. Out of sight really is out of mind here — for objects, for tasks, and for people — so open shelving, a visible list, and a friend who does not read silence as rejection do more than any reminder to try harder.',
    borders: ['mountains-of-ruminating-thoughts', 'lake-of-limerence', 'tides-of-the-sensory-sea'],
    sibling: null,
  },
  {
    n: 17,
    slug: 'forest-of-joy-awe-and-wonder',
    label: 'Forest of Joy, Awe &amp; Wonder',
    title: 'Forest of Joy, Awe and Wonder',
    state: 'social',
    hot: [62, 84],
    plain: "Happiness so big that your body has to move. Flapping, bouncing, dancing. This is one of the best parts of being Autistic.",
    gloss: 'Autistic joy is one of our favorite things about being autistic. It can be intense as a meltdown, but filled with overwhelming happiness and excitement. When we experience joy, we feel the excited vibrations throughout our bodies. To release the energy, we do a “happy stim.”',
    who: { name: 'Blackwater', url: 'https://themighty.com/topic/autism-spectrum-disorder/how-i-experience-autistic-joy/' },
    stimpunks: 'https://stimpunks.org/glossary/autistic-joy/',
    helps: 'Room to show it. Autistic joy is loud in the body, and an environment that requires it to be performed quietly is asking for the joy without the person.',
    borders: ['rhizomatic-communities', 'penguin-pebbling-cove-of-friendship', 'campsite-of-cavendish-spaces'],
    sibling: { name: 'Star Stuff', url: 'https://starstuff.earth/' },
  },
  {
    n: 18,
    slug: 'lake-of-limerence',
    label: 'Lake of Limerence',
    title: 'Lake of Limerence',
    state: 'stuck',
    hot: [73, 88],
    plain: "You cannot stop thinking about one person. You do not know if they feel the same. The not knowing is what keeps it going.",
    gloss: 'Limerence is a state of involuntary obsession with another person. The experience of limerence is different from love or lust in that it is based on the uncertainty that the person you desire also desires you.',
    who: { name: 'Psychology Today', url: 'https://www.psychologytoday.com/us/basics/limerence' },
    coiner: 'Dorothy Tennov',
    stimpunks: 'https://stimpunks.org/glossary/limerence/',
    helps: 'Certainty, which is the thing limerence is missing. It is built out of not knowing, and it is a monotropic attention system running its ordinary depth on a person — not a character flaw and not a warning about you.',
    borders: ['panic-hills-of-low-object-permanence', 'mountains-of-ruminating-thoughts', 'forest-of-joy-awe-and-wonder'],
    sibling: null,
  },
  {
    n: 19,
    slug: 'tides-of-the-sensory-sea',
    label: 'Tides of the Sensory Sea',
    title: 'Tides of the Sensory Sea',
    state: 'stuck',
    hot: [91, 79],
    plain: "Sound, light, touch and smell come in strong. Some days much more than others. It is not a mood. It is your senses.",
    gloss: 'Neurodivergent people are hypersensitive to mindset and environment due to a greater number of neuronal connections. They have both a higher risk for trauma and a large capacity for sensing safety.',
    who: { name: 'Janae Elisabeth', url: 'https://medium.com/age-of-awareness/neuroception-and-the-3-part-brain-b38f482c34b0' },
    stimpunks: 'https://stimpunks.org/access/sensory-experience/',
    helps: 'Control over the inputs. Light you can dim, sound you can leave, fabric you chose — the tide is not a mood, and the lever is in the room rather than in the person.',
    borders: ['panic-hills-of-low-object-permanence', 'sudden-storms-of-unexpected-events', 'burnout-whirlpools'],
    sibling: { name: 'Cavendish Cards', url: 'https://cavendish.app/' },
  },
  {
    n: 20,
    slug: 'sudden-storms-of-unexpected-events',
    label: 'Sudden Storms of Unexpected Events',
    title: 'Sudden Storms of Unexpected Events',
    state: 'stuck',
    hot: [14, 6],
    plain: "Something changes with no warning. You get pulled out of what you were doing. Your body reacts before you can think.",
    gloss: 'If an autistic person is pulled out of monotropic flow too quickly, it causes our sensory systems to dysregulate. This in turn triggers us into emotional dysregulation, and we quickly find ourselves in a state ranging from uncomfortable, to grumpy, to angry, or even triggered into a meltdown or a shutdown.',
    who: { name: 'Kieran Rose', url: 'https://www.youtube.com/watch?v=qUFDAevkd3E&t=224s' },
    stimpunks: 'https://stimpunks.org/glossary/flow/#dont-dysregulate-me',
    helps: 'Warning. Almost all of the damage here is in the suddenness rather than the change, and notice is free to give.',
    borders: ['attention-tunnels', 'tendril-theory', 'tides-of-the-sensory-sea'],
    sibling: null,
  },
];

export const BY_SLUG = new Map(AREAS.map((a) => [a.slug, a]));

/** Every `borders` entry must name a real area, or the cross-links rot silently. */
export function validate() {
  const problems = [];
  if (AREAS.length !== 20) problems.push(`expected 20 areas, found ${AREAS.length}`);
  const seen = new Set();
  for (const a of AREAS) {
    if (seen.has(a.slug)) problems.push(`duplicate slug: ${a.slug}`);
    seen.add(a.slug);
    if (!STATES.has(a.state)) problems.push(`${a.slug}: unknown state "${a.state}"`);
    /* Plain language, held to ASAN's shape: short sentences, one idea each. A long
       sentence here is the failure mode — it is how a plain definition quietly turns
       back into the prose it was written to replace. */
    if (!a.plain) problems.push(`${a.slug}: no plain-language definition`);
    else {
      const sentences = a.plain.split(/(?<=[.!?])\s+/).filter(Boolean);
      const longest = Math.max(...sentences.map((x) => x.trim().split(/\s+/).length));
      const avg = a.plain.trim().split(/\s+/).length / sentences.length;
      if (longest > 18) problems.push(`${a.slug}: plain definition has an ${longest}-word sentence (max 18)`);
      if (avg > 15) problems.push(`${a.slug}: plain definition averages ${avg.toFixed(1)} words a sentence (max 15)`);
    }
    for (const b of a.borders) {
      if (!BY_SLUG.has(b)) problems.push(`${a.slug}: borders unknown area "${b}"`);
      if (b === a.slug) problems.push(`${a.slug}: borders itself`);
    }
    const [x, y] = a.hot;
    if (x < 0 || x > 100 || y < 0 || y > 100) problems.push(`${a.slug}: hotspot off the map`);
  }
  for (let i = 0; i < AREAS.length; i++) {
    if (AREAS[i].n !== i + 1) problems.push(`${AREAS[i].slug}: n is ${AREAS[i].n}, expected ${i + 1}`);
  }
  return problems;
}
