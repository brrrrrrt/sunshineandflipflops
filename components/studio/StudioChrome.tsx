'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOutAction } from '@/lib/studio/actions';

const ICONS: Record<string, React.ReactNode> = {
  dash: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2.5 7.5L9 2l6.5 5.5V15a1 1 0 0 1-1 1h-3v-4h-5v4h-3a1 1 0 0 1-1-1V7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
  ),
  journal: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 2.5h7l5 5V15a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 3 15V2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 2.5V7h4.5M6 10h6M6 12.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
  ),
  postcards: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2.5" y="4" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M2.5 11l3.5-3 3 2.5 2.5-2 3.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="6" cy="7" r="1" fill="currentColor"/></svg>
  ),
  leads: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2.5 5.5 9 10l6.5-4.5M2.5 4.5h13v9h-13z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
  ),
  out: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 2.5H3.5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1H6M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
};

interface Props {
  email: string;
  newLeads: number;
  children: React.ReactNode;
}

const NAV = [
  { href: '/studio', label: 'Dashboard', icon: 'dash', exact: true },
  { href: '/studio/posts', label: 'Journal', icon: 'journal' },
  { href: '/studio/postcards', label: 'Postcards', icon: 'postcards' },
  { href: '/studio/leads', label: 'Leads', icon: 'leads' },
];

export default function StudioChrome({ email, newLeads, children }: Props) {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  async function handleSignOut() {
    await signOutAction();
    window.location.href = '/studio/login';
  }

  return (
    <div className="studio">
      <aside className="studio-side">
        <div className="studio-brand">
          <span className="mark"><img src="/assets/logo.png" alt="" /></span>
          <span>
            <span className="t1" style={{ display: 'block' }}>Mary&apos;s</span>
            <span className="t2">Studio</span>
          </span>
        </div>
        <nav className="studio-nav">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={isActive(n.href, n.exact) ? 'active' : ''}>
              {ICONS[n.icon]}
              {n.label}
              {n.icon === 'leads' && newLeads > 0 ? <span className="badge">{newLeads}</span> : null}
            </Link>
          ))}
        </nav>
        <div className="studio-side-foot">
          <div className="studio-user">Signed in as<br />{email}</div>
          <button className="studio-signout" onClick={handleSignOut}>
            {ICONS.out} Sign out
          </button>
        </div>
      </aside>

      <main className="studio-main">
        <div className="studio-mobile-bar">
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="t1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-deep)' }}>Mary&apos;s</span>
            <span className="t2">Studio</span>
          </span>
          <button className="s-btn ghost sm" onClick={handleSignOut}>{ICONS.out}</button>
        </div>
        {children}
      </main>

      <nav className="studio-tabs">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className={isActive(n.href, n.exact) ? 'active' : ''}>
            {ICONS[n.icon]}
            <span>{n.label}</span>
            {n.icon === 'leads' && newLeads > 0 ? <span className="badge">{newLeads}</span> : null}
          </Link>
        ))}
      </nav>
    </div>
  );
}
