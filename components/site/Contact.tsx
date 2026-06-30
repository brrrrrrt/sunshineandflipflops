import { SITE } from '@/lib/site';
import ContactForm from './ContactForm';

export default function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="container">
        <div className="contact-grid">
          <div className="reveal">
            <div className="eyebrow">Get in touch</div>
            <h2>
              Tell me about <span className="script">your trip.</span>
            </h2>
            <p className="section-lead" style={{ marginTop: 18 }}>
              Prefer to write it out? Send me the details and I&apos;ll follow up personally.
              No bots, no call center — your note comes straight to me.
            </p>
            <div className="book-contact" style={{ marginTop: 32 }}>
              <a href={SITE.phoneHref}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3.5 1.5h2l1.5 4-2 1c.7 1.7 2.1 3.1 3.8 3.8l1-2 4 1.5v2c0 .8-.7 1.5-1.5 1.5C7.5 13.3 2.7 8.5 2 2.5c0-.6.5-1 1-1z" stroke="#1d3e92" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
                {SITE.phone}
              </a>
              <span className="divider" />
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </div>
          </div>
          <div className="reveal">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
