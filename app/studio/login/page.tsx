'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();

  // Already signed in? Skip the login screen.
  useEffect(() => {
    const sb = createClient();
    sb.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/studio');
    });
  }, [router]);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        const res = await fetch('/api/studio/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: pw }),
        });
        const j = await res.json().catch(() => ({}));
        if (!res.ok) {
          setErr(j.error || 'Could not create your account.');
          setLoading(false);
          return;
        }
      }
      const sb = createClient();
      const { error } = await sb.auth.signInWithPassword({ email, password: pw });
      if (error) {
        setErr(error.message);
        setLoading(false);
        return;
      }
      const next = new URLSearchParams(window.location.search).get('next') || '/studio';
      router.push(next);
      router.refresh();
    } catch {
      setErr('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="brandline">
          <span className="mark"><img src="/assets/logo.png" alt="" /></span>
          <span>
            <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-deep)', display: 'block', lineHeight: 1 }}>
              Mary&apos;s
            </span>
            <span style={{ fontFamily: 'var(--font-script)', color: 'var(--gold-600)', fontSize: 22, lineHeight: 1 }}>
              Studio
            </span>
          </span>
        </div>
        <h1>{mode === 'signin' ? 'Welcome back' : 'Set up your account'}</h1>
        <p className="sub">
          {mode === 'signin'
            ? 'Sign in to manage your journal, postcards, and inquiries.'
            : 'Create your password to get started. Your email must be on the approved list.'}
        </p>

        {err ? <div className="login-error">{err}</div> : null}

        <form onSubmit={onSubmit}>
          <div className="s-field">
            <label htmlFor="lg-email">Email</label>
            <input id="lg-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
          </div>
          <div className="s-field">
            <label htmlFor="lg-pw">Password</label>
            <input id="lg-pw" type="password" required autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={pw} onChange={(e) => setPw(e.target.value)} placeholder={mode === 'signup' ? 'At least 8 characters' : '••••••••'} />
          </div>
          <button type="submit" className="s-btn gold" disabled={loading}>
            {loading ? 'One moment…' : mode === 'signin' ? 'Sign in' : 'Create account & sign in'}
          </button>
        </form>

        <div className="login-toggle">
          {mode === 'signin' ? (
            <>First time here?{' '}
              <button onClick={() => { setMode('signup'); setErr(''); }}>Set up your account</button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button onClick={() => { setMode('signin'); setErr(''); }}>Sign in</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
