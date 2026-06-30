import { SITE } from '@/lib/site';
import BookCall from './BookCall';

export default function Book() {
  return (
    <section className="section book" id="book">
      <div className="book-deco book-deco-1" aria-hidden="true" />
      <div className="book-deco book-deco-2" aria-hidden="true" />
      <div className="book-inner reveal">
        <div className="eyebrow">Let&apos;s start planning</div>
        <h2>
          Your next trip<br />begins with a <span className="script">conversation.</span>
        </h2>
        <p>
          Book a free, no-pressure call. Tell me a little about who&apos;s traveling and
          what you&apos;re dreaming of, I&apos;ll take it from there.
        </p>
        <div className="book-actions">
          <a href={SITE.phoneHref} className="btn btn-primary">
            Book a free call <span className="arrow">→</span>
          </a>
          <a href={`mailto:${SITE.email}`} className="btn btn-outline">
            Send a quick note
          </a>
        </div>

        <BookCall />

        <div className="book-contact">
          <a href={SITE.phoneHref}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3.5 1.5h2l1.5 4-2 1c.7 1.7 2.1 3.1 3.8 3.8l1-2 4 1.5v2c0 .8-.7 1.5-1.5 1.5C7.5 13.3 2.7 8.5 2 2.5c0-.6.5-1 1-1z" stroke="#1d3e92" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
            {SITE.phone}
          </a>
          <span className="divider" />
          <a href={`mailto:${SITE.email}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3.5" width="12" height="9" rx="1" stroke="#1d3e92" strokeWidth="1.4" />
              <path d="M2.5 4.5l5.5 4 5.5-4" stroke="#1d3e92" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
            {SITE.email}
          </a>
        </div>
      </div>
    </section>
  );
}
