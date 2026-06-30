'use client';

import { useState } from 'react';

const FAQS = [
  {
    q: 'How much does it cost to work with you?',
    a: "For most leisure trips (Caribbean, Disney, all-inclusive, cruises) my services are complimentary. I'm compensated by the resorts and cruise lines I book through, at no extra cost to you. For complex custom itineraries (multi-country, private guides, special-occasion logistics) I charge a flat planning fee, quoted before we start.",
  },
  {
    q: "Can you really get a better price than I'd find online?",
    a: "Often yes, I have access to advisor-only promotions, resort credits, room upgrades, and stacked perks that don't show up on public booking sites. And if a price drops between your booking and your trip, I'll rebook it for you.",
  },
  {
    q: 'What happens after I book a call?',
    a: "We spend 20–30 minutes on a friendly, no-pressure call so I can learn what you love (and what you don't). Within a few days I'll send you 2–3 thoughtful options with rooms, perks, and pricing. You pick one. I handle the rest.",
  },
  {
    q: 'Do you work with families, couples, solo travelers?',
    a: 'All of the above, and multi-generational groups, milestone birthdays, honeymoons, mother-daughter trips, and reunions. The more people, the more useful it is to have someone keeping the plates spinning.',
  },
  {
    q: 'What if something goes wrong on the trip?',
    a: "You have my number. A cancelled flight, a room mix-up, a sudden change in weather: I'm your first call, and I'll work the problem while you stay on vacation. That's the point of having a real person instead of a website.",
  },
  {
    q: 'How far in advance should I plan?',
    a: "Disney and peak Caribbean (Christmas, spring break, July), 9 to 12 months out. Most Caribbean weeks, 4 to 6 months. Last-minute getaways, I can usually find something good with a week's notice if you're flexible.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section faq" id="faq">
      <div className="container">
        <div className="faq-grid">
          <div className="faq-head reveal">
            <div className="eyebrow">Common questions</div>
            <h2>
              Before you <span className="script">book.</span>
            </h2>
            <p className="section-lead" style={{ marginTop: 20 }}>
              A few things travelers ask before our first call. Don&apos;t see your
              question? Send a quick note, I&apos;m easy to reach.
            </p>
          </div>
          <div className="faq-list reveal" id="faqList">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div className={`faq-item${isOpen ? ' open' : ''}`} key={i}>
                  <button
                    className="faq-trigger"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    {f.q}
                    <span className="faq-icon">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 4l4 4 4-4" stroke="#1d3e92" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                  <div className="faq-body">
                    <div>
                      <p>{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
