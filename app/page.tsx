import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import ScrollReveal from '@/components/site/ScrollReveal';
import Hero from '@/components/site/Hero';
import About from '@/components/site/About';
import Specialties from '@/components/site/Specialties';
import Gallery from '@/components/site/Gallery';
import Testimonials from '@/components/site/Testimonials';
import Newsletter from '@/components/site/Newsletter';
import Faq from '@/components/site/Faq';
import Contact from '@/components/site/Contact';
import Book from '@/components/site/Book';
import FloatCall from '@/components/site/FloatCall';
import { getPostcards } from '@/lib/data';

export const revalidate = 300;

export default async function Home() {
  const postcards = await getPostcards();

  return (
    <>
      <Header home />
      <ScrollReveal />
      <Hero />
      <main className="main-content">
        <About />
        <Specialties />
        <Gallery postcards={postcards} />
        <Testimonials />
        <Newsletter />
        <Faq />
        <Contact />
        <Book />
      </main>
      <Footer home />
      <FloatCall />
    </>
  );
}
