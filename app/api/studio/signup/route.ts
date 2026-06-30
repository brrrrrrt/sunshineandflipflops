import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAllowedAdmin } from '@/lib/auth';

/**
 * Gated account creation. Only emails in ALLOWED_ADMIN_EMAILS can create an
 * account, and only through this server route (open signups must be disabled
 * in Supabase Auth). Creates the user with the service-role key and confirms
 * the email so they can sign in immediately.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? '').trim().toLowerCase();
  const password = String(body?.password ?? '');

  if (!isAllowedAdmin(email)) {
    return NextResponse.json(
      { error: 'This email is not authorized to create an account.' },
      { status: 403 },
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Please choose a password of at least 8 characters.' },
      { status: 400 },
    );
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) {
      const msg = /already.*registered|exists/i.test(error.message)
        ? 'An account with this email already exists — try signing in.'
        : error.message;
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // Seed the DB allowlist so RLS (is_admin) grants this account write access.
    await admin.from('admin_allowlist').upsert({ email }, { onConflict: 'email' });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Account service is not configured yet.' },
      { status: 500 },
    );
  }
}
