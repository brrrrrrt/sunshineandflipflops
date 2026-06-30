'use client';

import { useEffect, useState } from 'react';
import { SITE } from '@/lib/site';

interface NavLink {
  href: string;
  label: string;
}

/**
 * Site header with a transparent→solid scroll transition and a mobile drawer.
 * `home` controls whether section links are in-page anchors or jump to the
 * homepage from a sub-page (the Journal).
 */
export default function Header({ home = true }: { home?: boolean }) {
  const [scrolled, setScrolled] = useState(!home);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!home) return; // sub-pages stay solid
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [home]);

  // Lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const p = (anchor: string) => (home ? anchor : `/${anchor}`);
  const links: NavLink[] = [
    { href: p('#about'), label: 'About' },
    { href: p('#specialties'), label: 'Specialties' },
    { href: p('#gallery'), label: 'Gallery' },
    { href: '/blog', label: 'Journal' },
    { href: p('#faq'), label: 'FAQ' },
    { href: p('#contact'), label: 'Contact' },
  ];

  return (
    <>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`} id="siteHeader">
        <a href={home ? '#top' : '/'} className="brand">
          <span className="brand-mark">
            <img src="/assets/logo.png" alt="Sunshine & Flip Flops" />
          </span>
          <span className="brand-text">
            <span className="sunshine">Sunshine</span>
            <span className="flip">&amp; Flip Flops</span>
          </span>
        </a>

        <nav className="nav" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href={SITE.bookingUrl || p('#book')}
          {...(SITE.bookingUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="btn btn-primary"
          style={{ marginLeft: 'auto' }}
        >
          Book a Call <span className="arrow">→</span>
        </a>

        <button
          className="menu-toggle"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <div className={`mobile-drawer${open ? ' open' : ''}`}>
        <div className="mobile-drawer-scrim" onClick={() => setOpen(false)} />
        <div className="mobile-drawer-panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="mobile-drawer-head">
            <span className="brand-text">
              <span className="sunshine" style={{ color: 'var(--primary-deep)' }}>Sunshine</span>
              <span className="flip" style={{ color: 'var(--gold-600)' }}>&amp; Flip Flops</span>
            </span>
            <button className="mobile-drawer-close" aria-label="Close menu" onClick={() => setOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          {links.map((l) => (
            <a key={l.href} href={l.href} className="m-link" onClick={() => setOpen(false)}>
              {l.label}
              <span className="arrow">→</span>
            </a>
          ))}
          <a
            href={SITE.bookingUrl || p('#book')}
            {...(SITE.bookingUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="btn btn-primary m-cta"
            onClick={() => setOpen(false)}
          >
            Book a Call <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </>
  );
}
