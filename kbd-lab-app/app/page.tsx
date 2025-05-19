import { HeroSection } from '@/components/home/hero-section';
import { AboutSection } from '@/components/home/about-section';
import { NewsSection } from '@/components/home/news-section';
import { FeaturedProductsSection } from '@/components/home/featured-products-section';
import { RankingSection } from '@/components/home/ranking-section';
import { FooterSection } from '@/components/home/footer-section';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center'>
      <HeroSection />
      <AboutSection />
      <NewsSection />
      <FeaturedProductsSection />
      <RankingSection />
      <FooterSection />
    </main>
  );
}
