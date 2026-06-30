import { createClient } from '@/lib/supabase/server';
import type { Lead, Post, Postcard } from '@/lib/types';

/** Server-side reads for the Studio (authenticated; includes drafts + leads). */

export async function listAllPosts(): Promise<Post[]> {
  const sb = await createClient();
  const { data } = await sb
    .from('posts')
    .select('*')
    .order('updated_at', { ascending: false });
  return (data as Post[]) ?? [];
}

export async function getPostById(id: string): Promise<Post | null> {
  const sb = await createClient();
  const { data } = await sb.from('posts').select('*').eq('id', id).maybeSingle();
  return (data as Post) ?? null;
}

export async function listPostcards(): Promise<Postcard[]> {
  const sb = await createClient();
  const { data } = await sb
    .from('postcards')
    .select('*')
    .order('sort_order', { ascending: true });
  return (data as Postcard[]) ?? [];
}

export async function listLeads(): Promise<Lead[]> {
  const sb = await createClient();
  const { data } = await sb
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
  return (data as Lead[]) ?? [];
}

export interface StudioCounts {
  posts: number;
  drafts: number;
  postcards: number;
  newLeads: number;
  flaggedLeads: number;
}

export async function getStudioCounts(): Promise<StudioCounts> {
  const sb = await createClient();
  const head = { count: 'exact' as const, head: true };
  const [posts, drafts, postcards, newLeads, flagged] = await Promise.all([
    sb.from('posts').select('*', head),
    sb.from('posts').select('*', head).eq('status', 'draft'),
    sb.from('postcards').select('*', head),
    sb.from('leads').select('*', head).eq('status', 'new'),
    sb.from('leads').select('*', head).eq('flagged', true),
  ]);
  return {
    posts: posts.count ?? 0,
    drafts: drafts.count ?? 0,
    postcards: postcards.count ?? 0,
    newLeads: newLeads.count ?? 0,
    flaggedLeads: flagged.count ?? 0,
  };
}
