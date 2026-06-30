import PostsManager from '@/components/studio/PostsManager';
import { listAllPosts } from '@/lib/studio/queries';

export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  const posts = await listAllPosts();
  return <PostsManager initial={posts} />;
}
