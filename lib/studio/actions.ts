'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { isAllowedAdmin } from '@/lib/auth';
import { POSTS_TAG, POSTCARDS_TAG } from '@/lib/data';
import type { LeadStatus, Postcard, PostStatus } from '@/lib/types';

type Result<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

async function requireAdmin() {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!isAllowedAdmin(user?.email)) {
    throw new Error('Not authorized');
  }
  return sb;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80) || `post-${Date.now()}`;
}

function revalidatePosts() {
  revalidateTag(POSTS_TAG);
  revalidatePath('/blog');
  revalidatePath('/studio/posts');
}
function revalidatePostcards() {
  revalidateTag(POSTCARDS_TAG);
  revalidatePath('/');
  revalidatePath('/studio/postcards');
}

// ---------------- Posts ----------------
export interface PostInput {
  id?: string;
  title: string;
  slug?: string;
  excerpt: string;
  body: string;
  category: string;
  cover_image: string | null;
  read_minutes: number;
  featured: boolean;
  status: PostStatus;
}

export async function savePost(input: PostInput): Promise<Result<{ slug: string }>> {
  try {
    const sb = await requireAdmin();
    const slug = (input.slug && input.slug.trim()) || slugify(input.title);
    const row = {
      title: input.title.trim(),
      slug,
      excerpt: input.excerpt.trim(),
      body: input.body,
      category: input.category,
      cover_image: input.cover_image,
      read_minutes: Math.max(1, Math.min(60, Math.round(input.read_minutes) || 4)),
      featured: input.featured,
      status: input.status,
      published_at:
        input.status === 'published' ? new Date().toISOString() : null,
    };

    // Only one featured post at a time.
    if (input.featured) {
      await sb.from('posts').update({ featured: false }).neq('id', input.id ?? '');
    }

    if (input.id) {
      const { error } = await sb.from('posts').update(row).eq('id', input.id);
      if (error) return { ok: false, error: error.message };
    } else {
      const { error } = await sb.from('posts').insert(row);
      if (error) return { ok: false, error: error.message };
    }
    revalidatePosts();
    return { ok: true, data: { slug } };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deletePost(id: string): Promise<Result> {
  try {
    const sb = await requireAdmin();
    const { error } = await sb.from('posts').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidatePosts();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function setPostStatus(id: string, status: PostStatus): Promise<Result> {
  try {
    const sb = await requireAdmin();
    const { error } = await sb
      .from('posts')
      .update({
        status,
        published_at: status === 'published' ? new Date().toISOString() : null,
      })
      .eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidatePosts();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

// ---------------- Postcards ----------------
export interface PostcardInput {
  id?: string;
  destination: string;
  title: string;
  image: string;
  sort_order?: number;
}

export async function savePostcard(input: PostcardInput): Promise<Result<Postcard>> {
  try {
    const sb = await requireAdmin();
    const row = {
      destination: input.destination.trim(),
      title: input.title.trim(),
      image: input.image,
    };
    if (input.id) {
      const { data, error } = await sb
        .from('postcards')
        .update(row)
        .eq('id', input.id)
        .select()
        .single();
      if (error) return { ok: false, error: error.message };
      revalidatePostcards();
      return { ok: true, data: data as Postcard };
    }
    const { count } = await sb
      .from('postcards')
      .select('*', { count: 'exact', head: true });
    const { data, error } = await sb
      .from('postcards')
      .insert({ ...row, sort_order: count ?? 0 })
      .select()
      .single();
    if (error) return { ok: false, error: error.message };
    revalidatePostcards();
    return { ok: true, data: data as Postcard };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deletePostcard(id: string): Promise<Result> {
  try {
    const sb = await requireAdmin();
    const { error } = await sb.from('postcards').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidatePostcards();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function reorderPostcards(orderedIds: string[]): Promise<Result> {
  try {
    const sb = await requireAdmin();
    await Promise.all(
      orderedIds.map((id, i) =>
        sb.from('postcards').update({ sort_order: i }).eq('id', id),
      ),
    );
    revalidatePostcards();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

// ---------------- Leads ----------------
export async function setLeadStatus(id: string, status: LeadStatus): Promise<Result> {
  try {
    const sb = await requireAdmin();
    const { error } = await sb.from('leads').update({ status }).eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidatePath('/studio/leads');
    revalidatePath('/studio');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteLead(id: string): Promise<Result> {
  try {
    const sb = await requireAdmin();
    const { error } = await sb.from('leads').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidatePath('/studio/leads');
    revalidatePath('/studio');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

// ---------------- Session ----------------
export async function signOutAction(): Promise<void> {
  const sb = await createClient();
  await sb.auth.signOut();
}
