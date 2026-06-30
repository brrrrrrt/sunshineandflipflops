import { unstable_cache } from 'next/cache';
import { createPublicClient, hasSupabaseEnv } from './supabase/public';
import { FALLBACK_POSTCARDS, FALLBACK_POSTS } from './fallback';
import type { Post, Postcard } from './types';

export const POSTS_TAG = 'posts';
export const POSTCARDS_TAG = 'postcards';
const REVALIDATE = 300;
const READ_TIMEOUT_MS = 3500;

/**
 * Resolves to `fallback` if the promise doesn't settle in time. Keeps the
 * public pages snappy even if the Supabase project is cold/paused, instead
 * of blocking the render on a hanging query.
 */
function withTimeout<T>(p: PromiseLike<T>, fallback: T): Promise<T> {
  return Promise.race([
    Promise.resolve(p),
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), READ_TIMEOUT_MS)),
  ]);
}

// ---------- Postcards (gallery / carousel) ----------
async function fetchPostcards(): Promise<Postcard[]> {
  if (!hasSupabaseEnv()) return FALLBACK_POSTCARDS;
  try {
    const sb = createPublicClient();
    const { data, error } = await withTimeout(
      sb.from('postcards').select('*').order('sort_order', { ascending: true }) as unknown as PromiseLike<{
        data: Postcard[] | null;
        error: { message: string } | null;
      }>,
      { data: null, error: { message: 'timeout' } },
    );
    if (error || !data || data.length === 0) return FALLBACK_POSTCARDS;
    return data as Postcard[];
  } catch {
    return FALLBACK_POSTCARDS;
  }
}

export const getPostcards = unstable_cache(fetchPostcards, ['postcards'], {
  tags: [POSTCARDS_TAG],
  revalidate: REVALIDATE,
});

// ---------- Posts (blog / journal) ----------
async function fetchPublishedPosts(): Promise<Post[]> {
  if (!hasSupabaseEnv()) return FALLBACK_POSTS;
  try {
    const sb = createPublicClient();
    const { data, error } = await withTimeout(
      sb
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false }) as unknown as PromiseLike<{
        data: Post[] | null;
        error: { message: string } | null;
      }>,
      { data: null, error: { message: 'timeout' } },
    );
    if (error || !data || data.length === 0) return FALLBACK_POSTS;
    return data as Post[];
  } catch {
    return FALLBACK_POSTS;
  }
}

export const getPublishedPosts = unstable_cache(
  fetchPublishedPosts,
  ['posts-published'],
  { tags: [POSTS_TAG], revalidate: REVALIDATE },
);

export async function getFeaturedPost(): Promise<Post | null> {
  const posts = await getPublishedPosts();
  return posts.find((p) => p.featured) ?? posts[0] ?? null;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPublishedPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
