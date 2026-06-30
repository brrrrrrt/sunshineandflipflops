import PostcardsManager from '@/components/studio/PostcardsManager';
import { listPostcards } from '@/lib/studio/queries';

export const dynamic = 'force-dynamic';

export default async function PostcardsPage() {
  const cards = await listPostcards();
  return <PostcardsManager initial={cards} />;
}
