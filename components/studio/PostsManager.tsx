'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Post } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/types';
import { deletePost, setPostStatus } from '@/lib/studio/actions';
import { useToasts, ToastList } from './toasts';

export default function PostsManager({ initial }: { initial: Post[] }) {
  const [posts, setPosts] = useState(initial);
  const [pending, setPending] = useState<string | null>(null);
  const { toasts, ok, err } = useToasts();

  async function togglePublish(p: Post) {
    const next = p.status === 'published' ? 'draft' : 'published';
    setPending(p.id);
    setPosts((ps) => ps.map((x) => (x.id === p.id ? { ...x, status: next } : x)));
    const res = await setPostStatus(p.id, next);
    setPending(null);
    if (!res.ok) {
      setPosts((ps) => ps.map((x) => (x.id === p.id ? { ...x, status: p.status } : x)));
      err('Could not update that post.');
    } else {
      ok(next === 'published' ? 'Published — it’s live on your site.' : 'Moved back to drafts.');
    }
  }

  async function remove(p: Post) {
    if (!confirm(`Delete “${p.title}”? This permanently removes it from your site.`)) return;
    const prev = posts;
    setPending(p.id);
    setPosts((ps) => ps.filter((x) => x.id !== p.id));
    const res = await deletePost(p.id);
    setPending(null);
    if (!res.ok) {
      setPosts(prev);
      err('Could not delete that post.');
    } else {
      ok('Post deleted.');
    }
  }

  return (
    <>
      <div className="studio-topbar">
        <div>
          <h1>The Journal</h1>
          <p>Write, publish, and manage your travel posts.</p>
        </div>
        <Link href="/studio/posts/new" className="s-btn gold">+ New post</Link>
      </div>

      {posts.length === 0 ? (
        <div className="s-card s-empty">
          <div className="big">No posts yet</div>
          <p style={{ marginBottom: 18 }}>Your first journal entry is a click away.</p>
          <Link href="/studio/posts/new" className="s-btn gold">Write your first post</Link>
        </div>
      ) : (
        <div className="s-list">
          {posts.map((p) => (
            <div className={`s-card s-rowcard${pending === p.id ? ' is-pending' : ''}`} key={p.id}>
              <div className="s-thumb">
                {p.cover_image ? <img src={p.cover_image} alt="" /> : null}
              </div>
              <div>
                <h3>{p.title || 'Untitled'}</h3>
                <div className="sub">
                  <span className={`pill ${p.status}`}>{p.status}</span>
                  <span>{CATEGORY_LABELS[p.category] ?? p.category}</span>
                  {p.featured ? <span className="pill new">Featured</span> : null}
                  <span>{p.read_minutes} min</span>
                </div>
              </div>
              <div className="s-actions">
                <Link href={`/studio/posts/${p.id}`} className="s-btn ghost sm">Edit</Link>
                <button className="s-btn sm" disabled={pending === p.id} onClick={() => togglePublish(p)}>
                  {p.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
                <button className="s-btn danger sm" disabled={pending === p.id} onClick={() => remove(p)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastList toasts={toasts} />
    </>
  );
}
