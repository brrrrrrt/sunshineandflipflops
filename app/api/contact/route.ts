import { NextResponse } from 'next/server';
import { createPublicClient, hasSupabaseEnv } from '@/lib/supabase/public';
import { detectSalesLead } from '@/lib/spam';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const clamp = (v: unknown, n: number) => String(v ?? '').trim().slice(0, n);

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const name = clamp(body.name, 200);
  const email = clamp(body.email, 200);
  const trip_type = clamp(body.trip_type, 120);
  const message = clamp(body.message, 5000);

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const { flagged, reason } = detectSalesLead({ name, email, message, trip_type });

  // In local/dev without Supabase configured, accept the submission so the
  // form still works; the lead simply isn't persisted.
  if (!hasSupabaseEnv()) {
    return NextResponse.json({ ok: true, stored: false });
  }

  const sb = createPublicClient();
  const { error } = await sb
    .from('leads')
    .insert({ name, email, trip_type, message, flagged, flag_reason: reason });

  if (error) {
    return NextResponse.json({ error: 'Could not save your message' }, { status: 500 });
  }
  return NextResponse.json({ ok: true, stored: true });
}
