'use client';

import { useState } from 'react';

const TRIP_TYPES = [
  'All-Inclusive Escape',
  'Disney / Parks',
  'Caribbean',
  'Wellness Retreat',
  'Cruise',
  'Not sure yet',
];

type Status = 'idle' | 'sending' | 'ok' | 'err';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', trip_type: TRIP_TYPES[0], message: '' });
  const [status, setStatus] = useState<Status>('idle');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('ok');
      setForm({ name: '', email: '', trip_type: TRIP_TYPES[0], message: '' });
    } catch {
      setStatus('err');
    }
  }

  if (status === 'ok') {
    return (
      <div className="contact-form" role="status">
        <div className="eyebrow" style={{ marginBottom: 4 }}>Message sent</div>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, color: 'var(--primary-deep)' }}>
          Thank you — I&apos;ll be in touch soon.
        </h3>
        <p style={{ color: 'var(--ink-soft)' }}>
          Your note just landed in my inbox. I read every one personally and usually reply
          within a day.
        </p>
        <button type="button" className="btn btn-outline" onClick={() => setStatus('idle')}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="form-row">
        <div className="field">
          <label htmlFor="cf-name">Your name</label>
          <input id="cf-name" required value={form.name} onChange={set('name')} placeholder="Jane Traveler" />
        </div>
        <div className="field">
          <label htmlFor="cf-email">Email</label>
          <input id="cf-email" type="email" required value={form.email} onChange={set('email')} placeholder="you@email.com" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="cf-trip">What kind of trip?</label>
        <select id="cf-trip" value={form.trip_type} onChange={set('trip_type')}>
          {TRIP_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="cf-message">Tell me a little about it</label>
        <textarea id="cf-message" required value={form.message} onChange={set('message')} placeholder="Who's traveling, rough dates, and what you're dreaming of…" />
      </div>
      {status === 'err' ? (
        <div className="form-status err show">Something went wrong — please try again, or call {''}
          me directly.</div>
      ) : null}
      <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send my note'} <span className="arrow">→</span>
      </button>
    </form>
  );
}
