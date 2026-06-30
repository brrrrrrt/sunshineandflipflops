'use client';

import { useState } from 'react';
import type { Lead, LeadStatus } from '@/lib/types';
import { deleteLead, setLeadStatus } from '@/lib/studio/actions';
import { useToasts, ToastList } from './toasts';

const FILTERS = [
  { k: 'all', l: 'All' },
  { k: 'new', l: 'New' },
  { k: 'flagged', l: 'Possible spam' },
  { k: 'archived', l: 'Archived' },
];

function when(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function LeadsInbox({ initial }: { initial: Lead[] }) {
  const [leads, setLeads] = useState(initial);
  const [filter, setFilter] = useState('all');
  const [pending, setPending] = useState<string | null>(null);
  const { toasts, ok, err } = useToasts();

  const shown = leads.filter((l) =>
    filter === 'all' ? true : filter === 'flagged' ? l.flagged : l.status === filter,
  );

  async function changeStatus(l: Lead, s: LeadStatus) {
    const prev = leads;
    setPending(l.id);
    setLeads((ls) => ls.map((x) => (x.id === l.id ? { ...x, status: s } : x)));
    const res = await setLeadStatus(l.id, s);
    setPending(null);
    if (!res.ok) {
      setLeads(prev);
      err('Could not update that inquiry.');
    } else {
      ok(s === 'archived' ? 'Archived.' : s === 'read' ? 'Marked as read.' : 'Updated.');
    }
  }

  async function remove(l: Lead) {
    if (!confirm(`Delete this inquiry from ${l.name}? This can’t be undone.`)) return;
    const prev = leads;
    setPending(l.id);
    setLeads((ls) => ls.filter((x) => x.id !== l.id));
    const res = await deleteLead(l.id);
    setPending(null);
    if (!res.ok) {
      setLeads(prev);
      err('Could not delete that inquiry.');
    } else {
      ok('Inquiry deleted.');
    }
  }

  return (
    <>
      <div className="studio-topbar">
        <div>
          <h1>Inquiries</h1>
          <p>Messages from your contact form. Suspected sales pitches are flagged for you.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {FILTERS.map((f) => {
          const count =
            f.k === 'all'
              ? leads.length
              : f.k === 'flagged'
                ? leads.filter((l) => l.flagged).length
                : leads.filter((l) => l.status === f.k).length;
          return (
            <button
              key={f.k}
              className={`s-btn sm ${filter === f.k ? 'gold' : 'ghost'}`}
              onClick={() => setFilter(f.k)}
            >
              {f.l} ({count})
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <div className="s-card s-empty">
          <div className="big">Nothing here</div>
          <p>No inquiries in this view.</p>
        </div>
      ) : (
        <div className="s-list">
          {shown.map((l) => (
            <div className={`s-card lead${l.flagged ? ' flagged' : ''}${pending === l.id ? ' is-pending' : ''}`} key={l.id}>
              <div className="lead-head">
                <div>
                  <span className="who">{l.name}</span>
                  <div className="meta">
                    <a href={`mailto:${l.email}`} style={{ color: 'var(--accent-deep)' }}>{l.email}</a>
                    {' · '}{l.trip_type || 'General'}{' · '}{when(l.created_at)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {l.flagged ? <span className="pill flag">Possible spam</span> : null}
                  {l.status === 'new' ? <span className="pill new">New</span> : null}
                  {l.status === 'archived' ? <span className="pill draft">Archived</span> : null}
                </div>
              </div>

              {l.flagged && l.flag_reason ? (
                <div className="flag-reason">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 5.5v3M8 11h.01M8 1.8 1.5 13.5h13L8 1.8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"/></svg>
                  {l.flag_reason}
                </div>
              ) : null}

              <div className="msg">{l.message}</div>

              <div className="s-actions" style={{ marginTop: 14, flexWrap: 'wrap' }}>
                <a className="s-btn sm" href={`mailto:${l.email}?subject=Re:%20your%20travel%20inquiry`}>Reply</a>
                {l.status === 'new' ? (
                  <button className="s-btn ghost sm" disabled={pending === l.id} onClick={() => changeStatus(l, 'read')}>Mark read</button>
                ) : null}
                {l.status !== 'archived' ? (
                  <button className="s-btn ghost sm" disabled={pending === l.id} onClick={() => changeStatus(l, 'archived')}>Archive</button>
                ) : (
                  <button className="s-btn ghost sm" disabled={pending === l.id} onClick={() => changeStatus(l, 'new')}>Restore</button>
                )}
                <button className="s-btn danger sm" disabled={pending === l.id} onClick={() => remove(l)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastList toasts={toasts} />
    </>
  );
}
