import type { Post, Postcard } from './types';

/**
 * Default content mirroring the original design. Used when Supabase isn't
 * configured yet or the tables are empty, so the public site always renders
 * fully. Once Mary publishes through the Studio, live data takes over.
 * Image paths point at /public/assets so they work with zero setup.
 */

const now = '2026-06-01T12:00:00.000Z';

export const FALLBACK_POSTCARDS: Postcard[] = [
  { destination: 'Bermuda', title: 'Horseshoe Bay', image: '/assets/g-bermuda.jpg' },
  { destination: 'Saint Lucia', title: 'Sailing past the Pitons', image: '/assets/g-pitons.jpg' },
  { destination: 'Walt Disney World', title: 'Fireworks over Cinderella Castle', image: '/assets/g-disney.jpg' },
  { destination: 'The Caribbean', title: 'The last hour of light', image: '/assets/hero-sunset.jpg' },
  { destination: 'Saint Lucia', title: 'A horseback morning on the coast', image: '/assets/g-horse.jpg' },
  { destination: 'Caribbean cliffside', title: 'Nowhere to be', image: '/assets/g-hammock.jpg' },
  { destination: 'Anna Maria Island', title: 'Parasailing over the Gulf', image: '/assets/g-parasail.jpg' },
  { destination: 'EPCOT', title: 'The Mexico pavilion at night', image: '/assets/g-mexico.jpg' },
  { destination: "Animal Kingdom", title: 'The Tree of Life', image: '/assets/g-animal.jpg' },
  { destination: 'Sandals', title: 'A resort visit, firsthand', image: '/assets/mary.jpg' },
].map((p, i) => ({
  id: `fallback-postcard-${i}`,
  sort_order: i,
  created_at: now,
  updated_at: now,
  ...p,
}));

interface Seed {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover_image: string;
  read_minutes: number;
  featured?: boolean;
  body: string;
}

const SEEDS: Seed[] = [
  {
    slug: 'saint-lucia-three-ways',
    title: 'Saint Lucia, three ways: which side of the island is right for you',
    excerpt:
      'The north is easy and lively, the west has the Pitons and the romance, and the wild Atlantic side is for travelers who want quiet. Here’s how I match each one to the trip my clients describe.',
    category: 'caribbean',
    cover_image: '/assets/g-pitons.jpg',
    read_minutes: 6,
    featured: true,
    body: 'Saint Lucia is really three islands wearing one name, and picking the right side is the difference between a good trip and a perfect one.\n\nThe north around Rodney Bay is lively and easy: marinas, restaurants, the shortest transfer from the airport. The west, around Soufrière, is where the Pitons rise straight out of the sea — this is the honeymoon side, all drama and quiet luxury. The wild Atlantic east is for travelers who want nothing but waves and space.\n\nWhen we talk, I listen for what you actually want your mornings to feel like, and match the coast to that.',
  },
  {
    slug: 'disney-dining-reservations',
    title: 'The dining reservations worth waking up at 6am for',
    excerpt:
      'A short list of Walt Disney World tables that are genuinely hard to get, and the ones you can safely skip.',
    category: 'disney',
    cover_image: '/assets/g-disney.jpg',
    read_minutes: 5,
    body: 'Not every hard-to-book Disney table is worth the 6am alarm. A few genuinely are.\n\nI keep a running short list of the reservations that consistently make a trip — and just as importantly, the ones you can skip without missing anything. I book these for clients so you never have to set the alarm yourself.',
  },
  {
    slug: 'river-vs-ocean-cruise',
    title: 'River vs. ocean: how to pick your first cruise',
    excerpt:
      'They’re two completely different trips. A simple way to decide which one fits the way you actually like to travel.',
    category: 'cruise',
    cover_image: '/assets/g-bermuda.jpg',
    read_minutes: 4,
    body: 'River and ocean cruising share a word and almost nothing else.\n\nRiver is intimate, slow, and culture-forward — you wake up in a new town and walk off the ship into it. Ocean is big, social, and amenity-rich. Here’s the simplest way I help clients choose between them.',
  },
  {
    slug: 'real-wellness-reset',
    title: 'What a real wellness reset looks like',
    excerpt:
      'Spa days are nice, but a restorative trip is built differently. What to look for before you book.',
    category: 'wellness',
    cover_image: '/assets/g-hammock.jpg',
    read_minutes: 3,
    body: 'A spa day is a treat. A wellness reset is a different kind of trip entirely.\n\nThe restorative trips that actually work are built around sleep, movement, and unhurried time — not a packed itinerary. Here’s what I look for in a property before I send anyone for a genuine reset.',
  },
  {
    slug: 'adult-only-or-family',
    title: 'Adult-only or family resort? An honest comparison',
    excerpt:
      'The trade-offs nobody mentions, and how to choose the right one for your group without regret.',
    category: 'caribbean',
    cover_image: '/assets/g-horse.jpg',
    read_minutes: 5,
    body: 'Adult-only versus family resort is the question I get most, and the honest answer depends on details people forget to mention.\n\nGroup size, ages, whether you want a kids’ club or a quiet pool, how much togetherness you actually want — these decide it. I’ll walk you through the trade-offs nobody puts in the brochure.',
  },
  {
    slug: 'when-to-book-guide',
    title: 'When to book: a month-by-month planning guide',
    excerpt:
      'The booking windows I work backward from for Disney, Caribbean peak weeks, and last-minute getaways.',
    category: 'tips',
    cover_image: '/assets/g-parasail.jpg',
    read_minutes: 4,
    body: 'Most trips have a quiet ideal booking window, and missing it costs money and choice.\n\nI plan backward from your travel dates: Disney and peak Caribbean weeks 9–12 months out, most Caribbean trips 4–6 months, last-minute getaways about a week if you’re flexible. Here’s the month-by-month version.',
  },
  {
    slug: 'calmer-epcot-with-kids',
    title: 'A calmer way to do EPCOT with kids',
    excerpt:
      'A pace and a route that keeps everyone happy, including the adults who came for the food and wine.',
    category: 'disney',
    cover_image: '/assets/g-mexico.jpg',
    read_minutes: 6,
    body: 'EPCOT with kids can be a meltdown or a highlight — it mostly comes down to pace and route.\n\nThere’s an order that keeps the little ones moving and still leaves the adults time around World Showcase. I map it out so the day works for everyone.',
  },
  {
    slug: 'five-resorts-for-family',
    title: "Five resorts I'd send my own family to",
    excerpt:
      'The properties that consistently get it right, from the welcome to the last morning’s coffee.',
    category: 'caribbean',
    cover_image: '/assets/hero-sunset.jpg',
    read_minutes: 4,
    body: 'I only recommend places I’d send my own family, and a handful clear that bar every single time.\n\nThese are the resorts that get the whole arc right — the welcome, the rooms, the staff who remember your name, the last morning’s coffee. Here’s my current shortlist.',
  },
  {
    slug: 'slow-travel-case',
    title: 'Slow travel: the case for staying put',
    excerpt:
      'Why one resort for a week often beats three stops in the same time, and who it suits best.',
    category: 'wellness',
    cover_image: '/assets/g-animal.jpg',
    read_minutes: 3,
    body: 'The instinct to see everything in one trip usually backfires.\n\nOne resort for a week, done well, often beats three stops in the same time — you unpack once, the staff learn your preferences, and you actually rest. Here’s who slow travel suits best.',
  },
  {
    slug: 'what-to-ask-advisor',
    title: 'What to ask a travel advisor before you commit',
    excerpt:
      'A few questions that quickly tell you whether someone will actually look after your trip.',
    category: 'tips',
    cover_image: '/assets/mary.jpg',
    read_minutes: 5,
    body: 'A good travel advisor is worth their weight; a passive one is just a middleman.\n\nA few pointed questions tell you which you’re dealing with fast — about availability during the trip, who handles problems, and how they get paid. Ask these before you commit to anyone, including me.',
  },
];

export const FALLBACK_POSTS: Post[] = SEEDS.map((s, i) => ({
  id: `fallback-post-${i}`,
  slug: s.slug,
  title: s.title,
  excerpt: s.excerpt,
  body: s.body,
  category: s.category,
  cover_image: s.cover_image,
  read_minutes: s.read_minutes,
  featured: Boolean(s.featured),
  status: 'published',
  published_at: now,
  created_at: now,
  updated_at: now,
}));
