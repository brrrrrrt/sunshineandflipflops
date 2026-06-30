# Sunshine & Flip Flops

Travel agency site for Mary Augustine — public marketing site + **Mary's Studio**,
a self-serve admin for the blog, the homepage postcard carousel, and inbound leads.

**Stack:** Next.js 15 (App Router) · Supabase (Postgres + Auth + Storage) · deployed on Vercel.

## Layout
```
app/                     Next.js routes
  page.tsx               Home (hero, about, specialties, postcards, FAQ, contact, book)
  blog/                  Journal index + post detail (+ skeleton loaders)
  studio/                Mary's Studio (gated): dashboard, posts, postcards, leads, login
  api/contact            Contact form -> leads (with spam/sales detection)
  api/studio/signup      Gated account creation (allowlisted emails only)
components/site/         Public UI (Header w/ mobile drawer, Filmstrip, ContactForm, …)
components/studio/       Studio UI (managers, editor, image upload, toasts)
lib/                     supabase clients, data (cached reads), auth allowlist, spam, types
supabase/migrations/     0001 schema + RLS + storage, 0002 seed content
legacy/                  Original pre-redesign site (kept for reference)
design-reference/        Static export of the new design (kept for reference)
public/assets/           Images
```

## Secrets / public-repo safety
Nothing secret is committed. All of it lives in `.env.local` (gitignored) and in
Vercel project settings — see `.env.example`:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public client config (RLS protects data)
- `SUPABASE_SERVICE_ROLE_KEY` — server-only, used solely by the gated signup route
- `ALLOWED_ADMIN_EMAILS` — server-only allowlist for Studio access
- `NEXT_PUBLIC_BOOKING_URL` — Google Calendar booking link (public business info, kept out of source)

The phone/email/legal SOT numbers are public business content (they render for every
visitor) and live in `lib/site.ts`.

## Security model (Mary's Studio)
- Only emails in `ALLOWED_ADMIN_EMAILS` can create an account, and only through the
  server `/api/studio/signup` route (service-role).
- That route also seeds the `admin_allowlist` table. Row Level Security grants write
  access via `is_admin()`, which checks that table — so a stray Supabase signup gets
  **zero** access even if open signups are left enabled.
- `middleware.ts` re-checks the email against the env allowlist on every Studio request
  (instant revoke by removing an email from env).

## One-time setup
1. `.env.local` is already populated (Supabase URL/keys, service role, admin emails, booking URL).
2. **Apply the database schema** (one of):
   - Supabase Dashboard → SQL Editor → paste `supabase/migrations/0001_init.sql`, run; then `0002_seed.sql`, run.
   - or authenticate the Supabase MCP (`claude /mcp`) and Claude applies them.
3. In Supabase → Authentication → Providers → Email, you may disable open sign-ups
   (not required for security — `is_admin()` already gates it — but tidy).
4. `npm run dev`, open `/studio`, choose **Set up your account** with an allowlisted
   email + password.

## Run
```
npm install
npm run dev      # http://localhost:3000   (Studio at /studio)
npm run build && npm run start
```
The public site renders with built-in fallback content even before the database is
seeded, so it never looks empty.
