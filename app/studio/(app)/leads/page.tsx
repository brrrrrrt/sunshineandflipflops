import LeadsInbox from '@/components/studio/LeadsInbox';
import { listLeads } from '@/lib/studio/queries';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const leads = await listLeads();
  return <LeadsInbox initial={leads} />;
}
