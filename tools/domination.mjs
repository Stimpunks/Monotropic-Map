/**
 * domination.mjs — the nine zones of *Autism & The Map of Neuronormative Domination*.
 *
 * THE SECOND MAP, AND THE ONE THAT MAKES THE FIRST ONE HONEST. Helen Edgar made it
 * with Ryan Boren, Chelsea Adams and Norah Hobbs, and it exists because the map on
 * its own reads as a picture of a person.
 *
 * THESE ARE ANCHORS, NOT PAGES, and that is deliberate. Every zone here is a force
 * rather than a place you can be, and splitting nine forces across nine URLs would let
 * a reader meet one in isolation — which is exactly the move the map is arguing against.
 * They stay on one page, and the hotspots are `#fragment` links into it.
 *
 * `hot` is [x, y] as a percentage of the 1080x1080 artwork, measured from the label on
 * Helen's original, the same way `areas.mjs` does it. The artwork is never altered.
 */
export const ZONES = [
  {
    slug: 'mountains-of-misinformation',
    label: 'Mountains of Misinformation',
    hot: [10, 25],
    body: 'What a person has to climb before anybody will believe what they are telling them about their own mind. Decades of it, published, cited, and taught.',
    link: null,
  },
  {
    slug: 'disorder-framing-disaster-zone',
    label: '“Disorder” Framing Disaster Zone',
    hot: [65, 18],
    body: 'Autism as a disorder: the framing built into the diagnostic manual, the funding, and the first sentence of most things ever written about us. It puts the fault inside the person before a conversation has started.',
    link: { name: 'Pathology paradigm', url: 'https://stimpunks.org/glossary/pathology-paradigm/' },
  },
  {
    slug: 'harmful-highway',
    label: 'Harmful highway',
    hot: [45, 30],
    body: 'The one-way road running through the middle of the map, all of its arrows pointing the same way. Decades of research done from the outside, aimed at making Autistic people more normal rather than making the world more habitable.',
    link: null,
  },
  {
    slug: 'behaviourism-bay',
    label: 'Behaviourism Bay',
    hot: [12, 46],
    body: 'A theory of learning that reduces human beings to inputs and outputs, still running at scale in schools and clinics. Compliance is measured; the person is not asked.',
    link: { name: 'Behaviorism', url: 'https://stimpunks.org/glossary/behaviorism/' },
  },
  {
    slug: 'marsh-of-masking',
    label: 'Marsh of Masking',
    hot: [37, 57],
    body: 'It covers most of the landscape, and that is the point of putting it in the middle. Masking is a survival mechanism of suppressed needs that many Autistic people perform just to get through a day. It works, and it costs everything.',
    link: { name: 'Masking', url: 'https://stimpunks.org/glossary/masking/' },
  },
  {
    slug: 'sandstorm-of-stigma',
    label: 'Sandstorm of Stigma',
    hot: [72, 47],
    body: 'The weather that arrives with the label. It changes what a room assumes about a person before they have said anything, and it does not blow over.',
    link: { name: 'Stigma', url: 'https://stimpunks.org/glossary/stigma/' },
  },
  {
    slug: 'dunes-of-deficit-metaphors',
    label: 'Dunes of Deficit Metaphors',
    hot: [12, 68],
    body: 'The language itself. Deficit, impairment, symptom, severity, risk — vocabulary that turns a difference into a deficiency before the sentence has finished. The puzzle piece is here too.',
    link: { name: 'Deficit ideology', url: 'https://stimpunks.org/glossary/deficit-ideology/' },
  },
  {
    slug: 'canyon-of-cures-and-eugenics',
    label: 'Canyon of Cures &amp; Eugenics',
    hot: [68, 73],
    body: 'Where the money went. Vast sums invested in cures and in preventing Autistic people from existing at all, while the things Autistic people actually asked for went unfunded. This is the zone that is not a metaphor.',
    link: { name: 'Eugenics', url: 'https://stimpunks.org/glossary/eugenics/' },
  },
  {
    slug: 'destination-neurotypical-bay',
    label: 'Destination Neurotypical Bay',
    hot: [35, 83],
    body: 'Where the highway was always going. A person who has arrived is indistinguishable from their peers, and exhausted, and nobody is measuring the second part.',
    link: { name: 'Neuronormativity', url: 'https://stimpunks.org/glossary/neuronormativity/' },
  },
];

export function validate() {
  const problems = [];
  const seen = new Set();
  for (const z of ZONES) {
    if (seen.has(z.slug)) problems.push(`duplicate zone slug: ${z.slug}`);
    seen.add(z.slug);
    const [x, y] = z.hot;
    if (x < 0 || x > 100 || y < 0 || y > 100) problems.push(`${z.slug}: hotspot off the map`);
    if (!z.body || z.body.length < 40) problems.push(`${z.slug}: body too thin to be worth a hotspot`);
  }
  return problems;
}
