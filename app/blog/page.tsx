import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import ScrollReveal from '@/components/site/ScrollReveal';
import Newsletter from '@/components/site/Newsletter';
import FloatCall from '@/components/site/FloatCall';
import BlogIndex from '@/components/site/BlogIndex';
import { getPublishedPosts } from '@/lib/data';

export const revalidate = 300;

export const metadata = {
  title: 'The Journal | Sunshine & Flip Flops',
  description:
    'Travel notes, resort reviews, and planning tips from Mary Augustine of Sunshine & Flip Flops.',
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const featured = posts.find((p) => p.featured) ?? posts[0] ?? null;
  const rest = featured ? posts.filter((p) => p.id !== featured.id) : posts;

  return (
    <>
      <Header home={false} />
      <ScrollReveal />
      <BlogIndex featured={featured} posts={rest} />
      <Newsletter
        eyebrow="Travel notes, now and then"
        title="Get new posts in your inbox."
        text="A short note when I publish something worth reading: a resort review, a planning tip, or a deal worth jumping on. No spam, just useful travel notes."
        button="Subscribe"
        magnet=""
        success="Thanks! You are on the list."
      />
      <Footer home={false} />
      <FloatCall />
    </>
  );
}
