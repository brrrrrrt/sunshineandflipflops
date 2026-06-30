import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import ScrollReveal from '@/components/site/ScrollReveal';
import FloatCall from '@/components/site/FloatCall';
import { getPostBySlug } from '@/lib/data';
import { CATEGORY_LABELS } from '@/lib/types';

export const revalidate = 300;

function monthYear(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Post not found | Sunshine & Flip Flops' };
  return { title: `${post.title} | Sunshine & Flip Flops`, description: post.excerpt };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = post.body.split('\n\n').filter(Boolean);

  return (
    <>
      <Header home={false} />
      <ScrollReveal />
      <article className="section" style={{ paddingTop: 150 }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <Link href="/blog" className="blog-read" style={{ marginBottom: 28 }}>
            <span className="arrow" style={{ transform: 'scaleX(-1)' }}>→</span> Back to the Journal
          </Link>
          <div className="meta" style={{ marginTop: 24 }}>
            <span className="cat">{CATEGORY_LABELS[post.category] ?? post.category}</span>
            <span className="dot" />
            <span>{monthYear(post.published_at)}</span>
            <span className="dot" />
            <span>{post.read_minutes} min read</span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontSize: 'clamp(34px, 5vw, 58px)',
              lineHeight: 1.08,
              color: 'var(--primary-deep)',
              margin: '14px 0 28px',
              letterSpacing: '-.01em',
            }}
          >
            {post.title}
          </h1>
          {post.cover_image ? (
            <div
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                aspectRatio: '16 / 9',
                marginBottom: 36,
                boxShadow: '0 40px 80px -50px rgba(14,34,87,.4)',
              }}
            >
              <img
                src={post.cover_image}
                alt={post.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ) : null}
          <div
            style={{
              fontSize: 18,
              lineHeight: 1.8,
              color: 'var(--ink-700)',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            {paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </article>
      <Footer home={false} />
      <FloatCall />
    </>
  );
}
