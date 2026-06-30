import { createClient } from '@supabase/supabase-js';

/**
 * Service-role client. SERVER ONLY — never import into a Client Component.
 * Used solely by the gated signup route to mint the allowlisted admin
 * accounts. Bypasses RLS, so its key must never reach the browser.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
