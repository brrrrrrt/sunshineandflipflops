import type { Postcard } from '@/lib/types';
import Filmstrip from './Filmstrip';

export default function Gallery({ postcards }: { postcards: Postcard[] }) {
  return (
    <section className="section gallery" id="gallery">
      <div className="container">
        <div className="reveal" style={{ maxWidth: 680 }}>
          <div className="eyebrow">Trip highlights</div>
          <h2>
            Postcards from <span className="script">recent journeys.</span>
          </h2>
          <p className="section-lead">
            Real moments from adventures I&apos;ve helped plan, and lived firsthand. Every
            place I send you, I&apos;ve been, or my trusted partners have.
          </p>
        </div>
        <Filmstrip postcards={postcards} />
      </div>
    </section>
  );
}
