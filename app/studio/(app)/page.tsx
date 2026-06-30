import Link from 'next/link';
import { getStudioCounts, listLeads } from '@/lib/studio/queries';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const [counts, leads] = await Promise.all([getStudioCounts(), listLeads()]);
  const recent = leads.slice(0, 4);
  const published = Math.max(0, counts.posts - counts.drafts);

  const stats = [
    { n: published, l: 'Published posts' },
    { n: counts.drafts, l: 'Drafts' },
    { n: counts.postcards, l: 'Postcards' },
    { n: counts.newLeads, l: 'New inquiries' },
  ];

  return (
    <>
      <div className="studio-topbar">
        <div>
          <h1>Welcome back</h1>
          <p>Here&apos;s what&apos;s happening across your site.</p>
        </div>
        <Link href="/studio/posts/new" className="s-btn gold">+ New journal post</Link>
      </div>

      <div className="s-grid s-stats" style={{ marginBottom: 22 }}>
        {stats.map((s) => (
          <div className="s-card s-stat" key={s.l}>
            <div className="n">{s.n}</div>
            <div className="l">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="s-card" style={{ padding: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--primary-deep)' }}>
            Latest inquiries
          </h2>
          <Link href="/studio/leads" className="s-btn ghost sm">View all</Link>
        </div>
        {recent.length === 0 ? (
          <p style={{ color: 'var(--ink-soft)' }}>No inquiries yet — they’ll appear here the moment someone reaches out.</p>
        ) : (
          <div className="s-list">
            {recent.map((l) => (
              <div className="s-card lead" key={l.id} style={{ padding: 14 }}>
                <div className="lead-head">
                  <div>
                    <span className="who">{l.name}</span>
                    <div className="meta">{l.trip_type || 'General inquiry'} · {l.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {l.flagged ? <span className="pill flag">Possible spam</span> : null}
                    {l.status === 'new' ? <span className="pill new">New</span> : null}
                  </div>
                </div>
                <div className="msg" style={{ marginTop: 8 }}>
                  {l.message.length > 140 ? l.message.slice(0, 140) + '…' : l.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
