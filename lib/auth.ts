/**
 * Admin allowlist. The permitted emails live ONLY in the server-side
 * ALLOWED_ADMIN_EMAILS env var — never in source, never shipped to the
 * browser. Used by the gated signup route and the studio middleware gate.
 */
export function getAllowedAdminEmails(): string[] {
  return (process.env.ALLOWED_ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdmin(email?: string | null): boolean {
  if (!email) return false;
  return getAllowedAdminEmails().includes(email.toLowerCase());
}
