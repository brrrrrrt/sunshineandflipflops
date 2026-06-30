import { notFound } from 'next/navigation';
import PostEditor from '@/components/studio/PostEditor';
import { getPostById } from '@/lib/studio/queries';

export const dynamic = 'force-dynamic';

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();
  return <PostEditor post={post} />;
}
