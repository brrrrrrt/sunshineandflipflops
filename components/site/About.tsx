export default function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-photo reveal">
            <img src="/assets/mary.jpg" alt="Mary Augustine on a beach in the Caribbean" />
          </div>

          <div className="about-copy reveal">
            <div className="eyebrow">Meet your planner</div>
            <h2>
              A career in care, <br />a calling to <span className="script">adventure.</span>
            </h2>
            <p className="lead">
              Life&apos;s most precious luxury is not a possession, it is time. A bucket
              list isn&apos;t for someday; it&apos;s a calling to embrace happiness and
              adventure now.
            </p>
            <p>
              After many years in healthcare I learned that the moments that matter most
              are the ones we don&apos;t get back. The journeys I design turn those fleeting
              moments into vibrant, lasting memories, where impeccable hospitality meets
              thoughtful, personal care.
            </p>
            <p>
              From your first inquiry until you return home, every detail of your adventure
              is crafted with attention. Don&apos;t just travel, live it.
            </p>
            <div className="about-signature" aria-hidden="true">Mary</div>

            <div className="about-stats reveal-stagger">
              <div className="stat">
                <div className="num">15+</div>
                <div className="lbl">Years in client care</div>
              </div>
              <div className="stat">
                <div className="num">40+</div>
                <div className="lbl">Destinations curated</div>
              </div>
              <div className="stat">
                <div className="num">100%</div>
                <div className="lbl">Personally planned</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
