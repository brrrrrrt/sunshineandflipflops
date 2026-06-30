'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Post, PostStatus } from '@/lib/types';
import { CATEGORY_OPTIONS } from '@/lib/types';
import { savePost } from '@/lib/studio/actions';
import ImageDrop from './ImageDrop';
import { useToasts, ToastList } from './toasts';

export default function PostEditor({ post }: { post: Post | null }) {
  const router = useRouter();
  const { toasts, err } = useToasts();
  const [saving, setSaving] = useState<PostStatus | null>(null);

  const [f, setF] = useState({
    title: post?.title ?? '',
    slug: post?.slug ?? '',
    category: post?.category ?? 'caribbean',
    excerpt: post?.excerpt ?? '',
    body: post?.body ?? '',
    read_minutes: post?.read_minutes ?? 4,
    cover_image: post?.cover_image ?? null,
    featured: post?.featured ?? false,
  });
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) =>
    setF((s) => ({ ...s, [k]: v }));

  async function save(status: PostStatus) {
    if (!f.title.trim()) {
      err('Please add a title first.');
      return;
    }
    setSaving(status);
    const res = await savePost({
      id: post?.id,
      title: f.title,
      slug: f.slug,
      excerpt: f.excerpt,
      body: f.body,
      category: f.category,
      cover_image: f.cover_image,
      read_minutes: Number(f.read_minutes),
      featured: f.featured,
      status,
    });
    setSaving(null);
    if (!res.ok) {
      err(res.error || 'Could not save.');
      return;
    }
    router.push('/studio/posts');
    router.refresh();
  }

  return (
    <>
      <div className="studio-topbar">
        <div>
          <h1>{post ? 'Edit post' : 'New post'}</h1>
          <p>{post ? 'Update your journal entry.' : 'Write something worth reading.'}</p>
        </div>
        <button className="s-btn ghost" onClick={() => router.push('/studio/posts')}>← Back</button>
      </div>

      <div className="s-grid" style={{ gridTemplateColumns: 'minmax(0,1fr) 320px', alignItems: 'start' }}>
        <div className="s-card" style={{ padding: 24 }}>
          <div className="s-field">
            <label>Title</label>
            <input value={f.title} onChange={(e) => set('title', e.target.value)} placeholder="Saint Lucia, three ways…" />
          </div>
          <div className="s-field">
            <label>Excerpt</label>
            <textarea value={f.excerpt} onChange={(e) => set('excerpt', e.target.value)} style={{ minHeight: 80 }} placeholder="A one or two sentence teaser shown on the Journal." />
          </div>
          <div className="s-field">
            <label>Post</label>
            <textarea value={f.body} onChange={(e) => set('body', e.target.value)} style={{ minHeight: 320 }} placeholder="Write your post here. Leave a blank line between paragraphs." />
            <span className="help">Tip: leave a blank line between paragraphs.</span>
          </div>
        </div>

        <div className="s-card" style={{ padding: 22, position: 'sticky', top: 20 }}>
          <ImageDrop value={f.cover_image} onChange={(url) => set('cover_image', url)} label="Cover photo" />
          <div className="s-field">
            <label>Category</label>
            <select value={f.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="s-row">
            <div className="s-field">
              <label>Read time</label>
              <input type="number" min={1} max={60} value={f.read_minutes} onChange={(e) => set('read_minutes', Number(e.target.value))} />
            </div>
            <div className="s-field">
              <label>Slug</label>
              <input value={f.slug} onChange={(e) => set('slug', e.target.value)} placeholder="auto" />
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--ink-700)', margin: '6px 0 18px' }}>
            <input type="checkbox" checked={f.featured} onChange={(e) => set('featured', e.target.checked)} />
            Feature this at the top of the Journal
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="s-btn gold" disabled={saving !== null} onClick={() => save('published')}>
              {saving === 'published' ? 'Publishing…' : 'Publish'}
            </button>
            <button className="s-btn ghost" disabled={saving !== null} onClick={() => save('draft')}>
              {saving === 'draft' ? 'Saving…' : 'Save as draft'}
            </button>
          </div>
        </div>
      </div>
      <ToastList toasts={toasts} />
    </>
  );
}
