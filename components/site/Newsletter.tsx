'use client';

import { useState } from 'react';

interface Props {
  eyebrow?: string;
  title?: string;
  text?: string;
  button?: string;
  magnet?: string;
  success?: string;
}

export default function Newsletter({
  eyebrow = 'Free planning checklist',
  title = 'The Disney week, demystified.',
  text = "Drop your email and I'll send you my Walt Disney World planning checklist, the exact framework I use with clients to lock in dining, Lightning Lanes, and rest days before the trip falls apart.",
  button = 'Send it over',
  magnet = '★ Bonus: my 10 most-requested resorts, ranked',
  success = 'Thanks! Check your inbox in a few minutes.',
}: Props) {
  const [sent, setSent] = useState(false);

  return (
    <section className="newsletter" id="newsletter">
      <div className="newsletter-card reveal">
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <form
          className={`newsletter-form${sent ? ' sent' : ''}`}
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="newsletter-input">
            <input type="email" required placeholder="you@email.com" aria-label="Your email" />
            <button type="submit" className="btn btn-primary">
              {button} <span className="arrow">→</span>
            </button>
          </div>
          {magnet ? <span className="magnet">{magnet}</span> : null}
          <span className="hint">{sent ? success : 'No spam. Unsubscribe anytime.'}</span>
        </form>
      </div>
    </section>
  );
}
