'use client';

import { useState } from 'react';

interface Spec {
  key: string;
  num: string;
  title: string;
  tag: string;
  desc: string;
  chips: string[];
  locTitle: string;
  locations: string[];
}

const SPECIALTIES: Spec[] = [
  {
    key: 'all-inclusive',
    num: '01',
    title: 'All-Inclusive Escapes',
    tag: 'Effortless',
    desc: "Resorts where everything is handled before you ask: adult-only retreats, family resorts with kids' clubs, and overwater bungalows with the dining, drinks, and activities already included.",
    chips: ['Unlimited dining', 'Top-shelf included', 'Premium suites', 'Butler service'],
    locTitle: 'Featured Resorts',
    locations: ['Sandals & Beaches, Caribbean-wide', 'Excellence Collection, Mexico', 'Hard Rock Hotels, Punta Cana', 'Secrets & Dreams Resorts'],
  },
  {
    key: 'parks',
    num: '02',
    title: 'Premier Parks & Resorts',
    tag: 'Family magic',
    desc: "Curated itineraries built around smart park-day timing, the right dining reservations, and a pace that fits your family. I plan every Disney trip in the detail I'd want for my own.",
    chips: ['Lightning Lane strategy', 'Hard-to-get dining', 'Park-day mapping', 'Memory Maker'],
    locTitle: 'Featured Destinations',
    locations: ['Walt Disney World, all resorts', 'Disney Cruise Line', 'Aulani, Disney Resort & Spa, Hawaii', 'Universal Orlando & Epic Universe'],
  },
  {
    key: 'caribbean',
    num: '03',
    title: 'Caribbean Sanctuaries',
    tag: 'Island time',
    desc: "Access to the finest resorts across the Caribbean, matched to the trip you have in mind: a quiet private cove, a room with the Pitons in view, or a honeymoon on Bermuda's pink sand.",
    chips: ['Adult-only', 'Private plunge pools', 'Catamaran days', 'Couples + honeymoon'],
    locTitle: 'Where I send people',
    locations: ['Saint Lucia, Pitons & Soufrière', 'Bermuda, pink-sand beaches', 'Turks & Caicos, Grace Bay', 'Antigua, Barbados, St. Vincent'],
  },
  {
    key: 'wellness',
    num: '04',
    title: 'Wellness & Rejuvenation Retreats',
    tag: 'Restorative',
    desc: 'Luxurious sanctuaries focused on spa treatments, mindful practices, and holistic relaxation, for solo resets, mother-daughter weeks, and the trip you take to actually rest.',
    chips: ['Spa & thermal', 'Mindfulness', 'Movement & yoga', 'Nutrition'],
    locTitle: 'Specialty Retreats',
    locations: ['Sedona & Tucson, desert wellness', 'Costa Rica, jungle & surf', 'Bali, restorative immersion', 'Iceland, thermal & sauna'],
  },
  {
    key: 'cruises',
    num: '05',
    title: 'Breathtaking Global Voyages',
    tag: 'By sea',
    desc: "Seamlessly orchestrated voyages, from serene river journeys through Europe's vineyard country to spectacular cruises along majestic coastlines, with private shore excursions arranged in advance.",
    chips: ['River cruising', 'Luxury ocean', 'Disney Cruise Line', 'Private excursions'],
    locTitle: 'Sample Voyages',
    locations: ['Viking & AmaWaterways, Rhine, Danube', 'Celebrity & Virgin Voyages', 'Disney Cruise Line, Caribbean & Alaska', 'Norwegian Fjords & Mediterranean'],
  },
];

export default function Specialties() {
  const [openKey, setOpenKey] = useState<string>('all-inclusive');

  return (
    <section className="section specialties" id="specialties">
      <div className="container">
        <div className="spec-head reveal">
          <div>
            <div className="eyebrow">What I specialize in</div>
            <h2>
              Five ways to <span className="script">go.</span>
            </h2>
          </div>
          <p className="section-lead">
            Every itinerary is custom, but most of what I plan falls into one of these
            worlds. Tap any specialty to explore where it can take you.
          </p>
        </div>

        <div className="spec-list reveal-stagger" id="specList">
          {SPECIALTIES.map((s) => {
            const open = openKey === s.key;
            return (
              <article className={`spec-card${open ? ' open' : ''}`} key={s.key}>
                <button
                  className="spec-trigger"
                  aria-expanded={open}
                  onClick={() => setOpenKey(open ? '' : s.key)}
                >
                  <span className="spec-num">{s.num}</span>
                  <span className="spec-title">{s.title}</span>
                  <span className="spec-tag">{s.tag}</span>
                  <span className="spec-plus">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1v12M1 7h12" stroke="#1d3e92" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                <div className="spec-body">
                  <div className="spec-body-inner">
                    <div className="spec-body-content">
                      <div className="spec-desc">
                        <p>{s.desc}</p>
                        <div className="spec-chips">
                          {s.chips.map((c) => (
                            <span key={c}>{c}</span>
                          ))}
                        </div>
                      </div>
                      <div className="spec-locations">
                        <h4>{s.locTitle}</h4>
                        <ul>
                          {s.locations.map((l) => (
                            <li key={l}>{l}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
