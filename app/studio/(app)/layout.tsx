import { redirect } from 'next/navigation';
import StudioChrome from '@/components/studio/StudioChrome';
import { createClient } from '@/lib/supabase/server';
import { isAllowedAdmin } from '@/lib/auth';
import { getStudioCounts } from '@/lib/studio/queries';

export const dynamic = 'force-dynamic';

export default async function StudioAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();

  // Belt and suspenders alongside middleware.
  if (!isAllowedAdmin(user?.email)) {
    redirect('/studio/login');
  }

  const counts = await getStudioCounts();

  return (
    <StudioChrome email={user!.email!} newLeads={counts.newLeads}>
      {children}
    </StudioChrome>
  );
}
