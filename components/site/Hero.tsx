const MARQUEE = [
  'Caribbean Sanctuaries',
  'Walt Disney World',
  'Aulani & Hawaii',
  'Global Cruises',
  'Wellness Retreats',
  'All-Inclusive Escapes',
  'Universal Studios',
  'Bermuda & Bahamas',
  'Saint Lucia',
];

function MarqueeRow({ hidden }: { hidden?: boolean }) {
  return (
    <span aria-hidden={hidden ? 'true' : undefined}>
      {MARQUEE.map((m, i) => (
        <span key={i}>
          {m} <i className="dot" />{' '}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div
        className="hero-bg active"
        id="heroBg"
        style={{ backgroundImage: "url('/assets/hero-sunset.jpg')" }}
      />
      <div className="hero-inner">
        <div className="hero-eyebrow">Travel, designed by Mary Augustine</div>
        <h1 id="heroHeadline">
          <span className="word">Don&apos;t</span>{' '}
          <span className="word">just</span>{' '}
          <span className="word">travel,</span>
          <br />
          <span className="word">
            <span className="script">live</span>
          </span>{' '}
          <span className="word">it.</span>
        </h1>
        <p className="hero-sub">
          Care meets luxury. A boutique travel service for the trips you&apos;ve been
          meaning to take, planned start to finish so all you have to do is show up.
        </p>
        <div className="hero-actions">
          <a href="#book" className="btn btn-primary">
            Schedule your trip <span className="arrow">→</span>
          </a>
          <a href="#specialties" className="btn btn-ghost">
            See specialties
          </a>
        </div>
      </div>
      <div className="hero-scroll">
        <span>Scroll</span>
        <span className="hero-scroll-line" />
      </div>

      <div className="hero-marquee" aria-hidden="true">
        <div className="hero-marquee-track">
          <MarqueeRow />
          <MarqueeRow hidden />
        </div>
      </div>
    </section>
  );
}
