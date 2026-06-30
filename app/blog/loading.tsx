import Header from '@/components/site/Header';

/** Skeleton shown while the Journal data loads. */
export default function Loading() {
  return (
    <>
      <Header home={false} />
      <section className="page-hero">
        <div className="page-hero-inner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div className="skeleton sk-line" style={{ width: 120 }} />
          <div className="skeleton sk-title" style={{ width: 'min(520px, 80%)', height: 56 }} />
          <div className="skeleton sk-line" style={{ width: 'min(460px, 78%)' }} />
        </div>
      </section>
      <section className="blog-grid-section" style={{ paddingTop: 'clamp(48px,8vw,96px)' }}>
        <div className="blog-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="blog-card" key={i} style={{ pointerEvents: 'none' }}>
              <div className="skeleton" style={{ aspectRatio: '3 / 2', borderRadius: 0 }} />
              <div className="blog-card-body" style={{ gap: 12 }}>
                <div className="skeleton sk-line" style={{ width: 90 }} />
                <div className="skeleton sk-title" style={{ width: '90%' }} />
                <div className="skeleton sk-line" style={{ width: '100%' }} />
                <div className="skeleton sk-line" style={{ width: '70%' }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
