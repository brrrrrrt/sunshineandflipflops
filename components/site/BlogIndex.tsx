'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Post } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/types';

const FILTERS = [
  { cat: 'all', label: 'All' },
  { cat: 'caribbean', label: 'Caribbean' },
  { cat: 'disney', label: 'Disney & Parks' },
  { cat: 'cruise', label: 'Cruises' },
  { cat: 'wellness', label: 'Wellness' },
  { cat: 'tips', label: 'Planning Tips' },
];

function monthYear(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

const cover = (p: Post) => p.cover_image || '/assets/hero-sunset.jpg';
const label = (c: string) => CATEGORY_LABELS[c] ?? c;

export default function BlogIndex({
  featured,
  posts,
}: {
  featured: Post | null;
  posts: Post[];
}) {
  const [cat, setCat] = useState('all');
  const showFeatured = featured && (cat === 'all' || featured.category === cat);
  const grid = posts.filter((p) => cat === 'all' || p.category === cat);

  return (
    <>
      <section className="page-hero">
        <div className="page-hero-inner reveal">
          <div className="eyebrow">The Journal</div>
          <h1>
            Notes from the <span className="script">road.</span>
          </h1>
          <p>
            Resort reviews, planning tips, and honest takes from the trips I take and the
            ones I plan for clients. Everything here, I&apos;ve seen firsthand or vetted
            closely before recommending it.
          </p>
          <div className="blog-filter">
            {FILTERS.map((f) => (
              <button
                key={f.cat}
                className={cat === f.cat ? 'active' : ''}
                onClick={() => setCat(f.cat)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {showFeatured && featured ? (
        <section className="blog-featured">
          <article className="blog-featured-card reveal">
            <Link href={`/blog/${featured.slug}`} className="blog-featured-media">
              <span className="blog-pill">Featured</span>
              <img src={cover(featured)} alt={featured.title} />
            </Link>
            <div className="blog-featured-body">
              <div className="meta">
                <span className="cat">{label(featured.category)}</span>
                <span className="dot" />
                <span>{monthYear(featured.published_at)}</span>
                <span className="dot" />
                <span>{featured.read_minutes} min read</span>
              </div>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <Link href={`/blog/${featured.slug}`} className="blog-read">
                Read the post <span className="arrow">→</span>
              </Link>
            </div>
          </article>
        </section>
      ) : null}

      <section className="blog-grid-section">
        <div className="blog-grid reveal-stagger">
          {grid.map((p) => (
            <article className="blog-card" key={p.id}>
              <Link href={`/blog/${p.slug}`} className="blog-card-media">
                <img src={cover(p)} alt={p.title} />
              </Link>
              <div className="blog-card-body">
                <div className="meta">
                  <span className="cat">{label(p.category)}</span>
                  <span className="dot" />
                  <span>{p.read_minutes} min read</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
                <Link href={`/blog/${p.slug}`} className="blog-read">
                  Read <span className="arrow">→</span>
                </Link>
              </div>
            </article>
          ))}
          {grid.length === 0 ? (
            <p style={{ color: 'var(--ink-soft)' }}>No posts in this category yet.</p>
          ) : null}
        </div>
      </section>
    </>
  );
}
