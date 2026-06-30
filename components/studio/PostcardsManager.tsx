'use client';

import { useState } from 'react';
import type { Postcard } from '@/lib/types';
import { deletePostcard, reorderPostcards, savePostcard } from '@/lib/studio/actions';
import ImageDrop from './ImageDrop';
import { useToasts, ToastList } from './toasts';

type Editing = { id?: string; destination: string; title: string; image: string | null } | null;

export default function PostcardsManager({ initial }: { initial: Postcard[] }) {
  const [cards, setCards] = useState(initial);
  const [editing, setEditing] = useState<Editing>(null);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const { toasts, ok, err } = useToasts();

  async function save() {
    if (!editing) return;
    if (!editing.image) {
      err('Please add a photo first.');
      return;
    }
    setBusy(true);
    const res = await savePostcard({
      id: editing.id,
      destination: editing.destination,
      title: editing.title,
      image: editing.image,
    });
    setBusy(false);
    if (!res.ok || !res.data) {
      err(res.ok ? 'Saved — refresh to see it.' : res.error || 'Could not save.');
      return;
    }
    const saved = res.data;
    setCards((cs) => (editing.id ? cs.map((c) => (c.id === saved.id ? saved : c)) : [...cs, saved]));
    ok(editing.id ? 'Postcard updated.' : 'Postcard added to the carousel.');
    setEditing(null);
  }

  async function remove(c: Postcard) {
    if (!confirm(`Remove “${c.destination} — ${c.title}” from the carousel?`)) return;
    const prev = cards;
    setPending(c.id);
    setCards((cs) => cs.filter((x) => x.id !== c.id));
    const res = await deletePostcard(c.id);
    setPending(null);
    if (!res.ok) {
      setCards(prev);
      err('Could not remove that postcard.');
    } else {
      ok('Postcard removed.');
    }
  }

  async function move(c: Postcard, dir: -1 | 1) {
    const idx = cards.findIndex((x) => x.id === c.id);
    const j = idx + dir;
    if (j < 0 || j >= cards.length) return;
    const prev = cards;
    const next = [...cards];
    [next[idx], next[j]] = [next[j], next[idx]];
    setCards(next);
    const res = await reorderPostcards(next.map((x) => x.id));
    if (!res.ok) {
      setCards(prev);
      err('Could not reorder.');
    }
  }

  return (
    <>
      <div className="studio-topbar">
        <div>
          <h1>Postcards</h1>
          <p>The photo carousel on your homepage. Add, edit, reorder, or remove.</p>
        </div>
        {!editing ? (
          <button className="s-btn gold" onClick={() => setEditing({ destination: '', title: '', image: null })}>
            + Add postcard
          </button>
        ) : null}
      </div>

      {editing ? (
        <div className="s-card s-enter" style={{ padding: 24, marginBottom: 22 }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--primary-deep)', marginBottom: 16 }}>
            {editing.id ? 'Edit postcard' : 'New postcard'}
          </h2>
          <div className="s-grid" style={{ gridTemplateColumns: 'minmax(0,1fr) 1fr', alignItems: 'start' }}>
            <ImageDrop value={editing.image} onChange={(url) => setEditing((s) => (s ? { ...s, image: url } : s))} label="Photo" />
            <div>
              <div className="s-field">
                <label>Destination</label>
                <input value={editing.destination} onChange={(e) => setEditing((s) => (s ? { ...s, destination: e.target.value } : s))} placeholder="Bermuda" />
              </div>
              <div className="s-field">
                <label>Caption</label>
                <input value={editing.title} onChange={(e) => setEditing((s) => (s ? { ...s, title: e.target.value } : s))} placeholder="Horseshoe Bay" />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                <button className="s-btn gold" disabled={busy} onClick={save}>
                  {busy ? 'Saving…' : editing.id ? 'Save changes' : 'Add postcard'}
                </button>
                <button className="s-btn ghost" disabled={busy} onClick={() => setEditing(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {cards.length === 0 && !editing ? (
        <div className="s-card s-empty">
          <div className="big">No postcards yet</div>
          <p>Add a few favorite photos to bring your homepage carousel to life.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {cards.map((c, i) => (
            <div className={`s-card${pending === c.id ? ' is-pending' : ''}`} key={c.id} style={{ overflow: 'hidden' }}>
              <div style={{ aspectRatio: '4 / 3', background: 'var(--sand-200)' }}>
                <img src={c.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontFamily: 'var(--font-script)', color: 'var(--accent-deep)', fontSize: 22, lineHeight: 1 }}>
                  {c.destination || '—'}
                </div>
                <div style={{ color: 'var(--primary-deep)', fontWeight: 500, marginTop: 2 }}>{c.title}</div>
                <div className="s-actions" style={{ marginTop: 12, flexWrap: 'wrap' }}>
                  <button className="s-btn ghost sm" onClick={() => move(c, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                  <button className="s-btn ghost sm" onClick={() => move(c, 1)} disabled={i === cards.length - 1} aria-label="Move down">↓</button>
                  <button className="s-btn ghost sm" onClick={() => setEditing({ id: c.id, destination: c.destination, title: c.title, image: c.image })}>Edit</button>
                  <button className="s-btn danger sm" onClick={() => remove(c)} disabled={pending === c.id}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastList toasts={toasts} />
    </>
  );
}
