-- ============================================================
-- Seed: initial postcards + journal posts mirroring the launch design,
-- so Mary's Studio opens already populated and she can edit the existing
-- carousel photos/captions and posts. Images point at /public/assets.
-- Idempotent: only seeds when the table is still empty.
-- ============================================================

insert into public.postcards (destination, title, image, sort_order)
select v.destination, v.title, v.image, v.sort_order
from (values
  ('Bermuda',            'Horseshoe Bay',                    '/assets/g-bermuda.jpg',   0),
  ('Saint Lucia',        'Sailing past the Pitons',          '/assets/g-pitons.jpg',    1),
  ('Walt Disney World',  'Fireworks over Cinderella Castle', '/assets/g-disney.jpg',    2),
  ('The Caribbean',      'The last hour of light',           '/assets/hero-sunset.jpg', 3),
  ('Saint Lucia',        'A horseback morning on the coast', '/assets/g-horse.jpg',     4),
  ('Caribbean cliffside','Nowhere to be',                    '/assets/g-hammock.jpg',   5),
  ('Anna Maria Island',  'Parasailing over the Gulf',        '/assets/g-parasail.jpg',  6),
  ('EPCOT',              'The Mexico pavilion at night',     '/assets/g-mexico.jpg',    7),
  ('Animal Kingdom',     'The Tree of Life',                 '/assets/g-animal.jpg',    8),
  ('Sandals',            'A resort visit, firsthand',        '/assets/mary.jpg',        9)
) as v(destination, title, image, sort_order)
where not exists (select 1 from public.postcards);

insert into public.posts (slug, title, excerpt, body, category, cover_image, read_minutes, featured, status, published_at)
select v.slug, v.title, v.excerpt, v.body, v.category, v.cover_image, v.read_minutes, v.featured, 'published', now()
from (values
  ('saint-lucia-three-ways',
   'Saint Lucia, three ways: which side of the island is right for you',
   'The north is easy and lively, the west has the Pitons and the romance, and the wild Atlantic side is for travelers who want quiet. Here''s how I match each one to the trip my clients describe.',
   E'Saint Lucia is really three islands wearing one name, and picking the right side is the difference between a good trip and a perfect one.\n\nThe north around Rodney Bay is lively and easy: marinas, restaurants, the shortest transfer from the airport. The west, around Soufrière, is where the Pitons rise straight out of the sea — this is the honeymoon side, all drama and quiet luxury. The wild Atlantic east is for travelers who want nothing but waves and space.\n\nWhen we talk, I listen for what you actually want your mornings to feel like, and match the coast to that.',
   'caribbean', '/assets/g-pitons.jpg', 6, true),
  ('disney-dining-reservations',
   'The dining reservations worth waking up at 6am for',
   'A short list of Walt Disney World tables that are genuinely hard to get, and the ones you can safely skip.',
   E'Not every hard-to-book Disney table is worth the 6am alarm. A few genuinely are.\n\nI keep a running short list of the reservations that consistently make a trip — and just as importantly, the ones you can skip without missing anything. I book these for clients so you never have to set the alarm yourself.',
   'disney', '/assets/g-disney.jpg', 5, false),
  ('river-vs-ocean-cruise',
   'River vs. ocean: how to pick your first cruise',
   'They''re two completely different trips. A simple way to decide which one fits the way you actually like to travel.',
   E'River and ocean cruising share a word and almost nothing else.\n\nRiver is intimate, slow, and culture-forward — you wake up in a new town and walk off the ship into it. Ocean is big, social, and amenity-rich. Here''s the simplest way I help clients choose between them.',
   'cruise', '/assets/g-bermuda.jpg', 4, false),
  ('real-wellness-reset',
   'What a real wellness reset looks like',
   'Spa days are nice, but a restorative trip is built differently. What to look for before you book.',
   E'A spa day is a treat. A wellness reset is a different kind of trip entirely.\n\nThe restorative trips that actually work are built around sleep, movement, and unhurried time — not a packed itinerary. Here''s what I look for in a property before I send anyone for a genuine reset.',
   'wellness', '/assets/g-hammock.jpg', 3, false),
  ('adult-only-or-family',
   'Adult-only or family resort? An honest comparison',
   'The trade-offs nobody mentions, and how to choose the right one for your group without regret.',
   E'Adult-only versus family resort is the question I get most, and the honest answer depends on details people forget to mention.\n\nGroup size, ages, whether you want a kids'' club or a quiet pool, how much togetherness you actually want — these decide it. I''ll walk you through the trade-offs nobody puts in the brochure.',
   'caribbean', '/assets/g-horse.jpg', 5, false),
  ('when-to-book-guide',
   'When to book: a month-by-month planning guide',
   'The booking windows I work backward from for Disney, Caribbean peak weeks, and last-minute getaways.',
   E'Most trips have a quiet ideal booking window, and missing it costs money and choice.\n\nI plan backward from your travel dates: Disney and peak Caribbean weeks 9–12 months out, most Caribbean trips 4–6 months, last-minute getaways about a week if you''re flexible. Here''s the month-by-month version.',
   'tips', '/assets/g-parasail.jpg', 4, false),
  ('calmer-epcot-with-kids',
   'A calmer way to do EPCOT with kids',
   'A pace and a route that keeps everyone happy, including the adults who came for the food and wine.',
   E'EPCOT with kids can be a meltdown or a highlight — it mostly comes down to pace and route.\n\nThere''s an order that keeps the little ones moving and still leaves the adults time around World Showcase. I map it out so the day works for everyone.',
   'disney', '/assets/g-mexico.jpg', 6, false),
  ('five-resorts-for-family',
   'Five resorts I''d send my own family to',
   'The properties that consistently get it right, from the welcome to the last morning''s coffee.',
   E'I only recommend places I''d send my own family, and a handful clear that bar every single time.\n\nThese are the resorts that get the whole arc right — the welcome, the rooms, the staff who remember your name, the last morning''s coffee. Here''s my current shortlist.',
   'caribbean', '/assets/hero-sunset.jpg', 4, false),
  ('slow-travel-case',
   'Slow travel: the case for staying put',
   'Why one resort for a week often beats three stops in the same time, and who it suits best.',
   E'The instinct to see everything in one trip usually backfires.\n\nOne resort for a week, done well, often beats three stops in the same time — you unpack once, the staff learn your preferences, and you actually rest. Here''s who slow travel suits best.',
   'wellness', '/assets/g-animal.jpg', 3, false),
  ('what-to-ask-advisor',
   'What to ask a travel advisor before you commit',
   'A few questions that quickly tell you whether someone will actually look after your trip.',
   E'A good travel advisor is worth their weight; a passive one is just a middleman.\n\nA few pointed questions tell you which you''re dealing with fast — about availability during the trip, who handles problems, and how they get paid. Ask these before you commit to anyone, including me.',
   'tips', '/assets/mary.jpg', 5, false)
) as v(slug, title, excerpt, body, category, cover_image, read_minutes, featured)
where not exists (select 1 from public.posts);
