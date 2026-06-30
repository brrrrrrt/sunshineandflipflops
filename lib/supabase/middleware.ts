import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

type CookieToSet = { name: string; value: string; options?: CookieOptions };
import { isAllowedAdmin } from '@/lib/auth';

/**
 * Refreshes the Supabase auth session on every request and gates Mary's
 * Studio. Access requires BOTH a valid session AND an allowlisted email,
 * so removing an email from ALLOWED_ADMIN_EMAILS revokes access instantly.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isStudio = path.startsWith('/studio');
  const isLoginRoute = path === '/studio/login';
  const allowed = isAllowedAdmin(user?.email);

  // Protect every Studio route except the login page.
  if (isStudio && !isLoginRoute && !allowed) {
    const url = request.nextUrl.clone();
    url.pathname = '/studio/login';
    url.searchParams.set('next', path);
    return NextResponse.redirect(url);
  }

  // Already signed in and allowlisted? Skip the login page.
  if (isLoginRoute && allowed) {
    const url = request.nextUrl.clone();
    url.pathname = '/studio';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return response;
}
