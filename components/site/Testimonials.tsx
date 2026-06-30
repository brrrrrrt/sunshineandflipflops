const TESTIMONIALS = [
  {
    initials: 'JH',
    quote:
      '"Mary planned our 10-year anniversary in Saint Lucia down to the airport transfer. We didn\'t make a single decision once we landed, exactly what we needed."',
    name: 'Jenna & Hugh M.',
    trip: 'Sandals Grande St. Lucian · 7 nights',
  },
  {
    initials: 'RP',
    quote:
      '"She turned our chaotic Disney week with three kids into the calmest, most magical trip we\'ve taken. Park strategy, dining, the room, perfect."',
    name: 'The Patel Family',
    trip: 'Walt Disney World · Polynesian · 8 nights',
  },
  {
    initials: 'SK',
    quote:
      '"I needed a quiet wellness reset and didn\'t know where to begin. Mary asked the right questions and I came home a different person."',
    name: 'Susan K.',
    trip: 'Sedona retreat · 5 nights · solo',
  },
];

export default function Testimonials() {
  return (
    <section className="section testimonials" id="testimonials">
      <div className="container">
        <div className="testi-head reveal">
          <div className="eyebrow">Kind words</div>
          <h2>
            What travelers <span className="script">say.</span>
          </h2>
        </div>
        <div className="testi-grid reveal-stagger">
          {TESTIMONIALS.map((t) => (
            <article className="testi-card" key={t.initials}>
              <div className="testi-stars" aria-label="5 out of 5 stars">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="testi-quote">{t.quote}</p>
              <div className="testi-author">
                <div className="testi-avatar">{t.initials}</div>
                <div className="testi-meta">
                  <div className="name">{t.name}</div>
                  <div className="trip">{t.trip}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
