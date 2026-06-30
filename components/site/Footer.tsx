import Link from 'next/link';
import { SITE } from '@/lib/site';

/** Site footer including the required legal/licensing line + Cornerstone badge. */
export default function Footer({ home = true }: { home?: boolean }) {
  const p = (anchor: string) => (home ? anchor : `/${anchor}`);

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <a href={home ? '#top' : '/'} className="brand">
            <span className="brand-mark">
              <img src="/assets/logo.png" alt="Sunshine & Flip Flops" />
            </span>
            <span className="brand-text">
              <span className="sunshine" style={{ color: '#fff' }}>Sunshine</span>
              <span className="flip">&amp; Flip Flops</span>
            </span>
          </a>
          <p>A boutique travel concierge designing journeys where care meets luxury.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li><a href={p('#about')}>About Mary</a></li>
            <li><a href={p('#specialties')}>Specialties</a></li>
            <li><a href={p('#gallery')}>Gallery</a></li>
            <li><a href="/blog">Journal</a></li>
            <li><a href={p('#faq')}>FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li><a href={SITE.phoneHref}>{SITE.phone}</a></li>
            <li><a href={`mailto:${SITE.email}`}>Email Mary</a></li>
            <li><a href={p('#book')}>Book a call</a></li>
          </ul>
        </div>
        <div>
          <h4>Follow</h4>
          <ul>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Pinterest</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-base">
        <span>© 2026 Sunshine &amp; Flip Flops · Travel by {SITE.owner}</span>
        <span className="footer-legal">
          {SITE.legal.californiaSot} · {SITE.legal.floridaSot}
        </span>
        <img
          src="/assets/affiliate.png"
          alt={SITE.legal.affiliate}
          className="footer-affiliate"
          width={128}
        />
        <Link href="/studio" className="footer-studio" aria-label="Studio sign in">
          Studio
        </Link>
      </div>
    </footer>
  );
}
