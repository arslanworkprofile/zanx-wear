import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import ProductSection from '@/components/home/ProductSection';
import SaleBanner from '@/components/home/SaleBanner';
import Testimonials from '@/components/home/Testimonials';
import InstagramFeed from '@/components/home/InstagramFeed';
import Newsletter from '@/components/home/Newsletter';
import { FEATURED_PRODUCTS, TRENDING_PRODUCTS, NEW_ARRIVALS } from '@/lib/mock-data';
import { getPublicCategories } from '@/lib/data/categories';
import { getHomeSections } from '@/lib/data/products';
import { getCommunityPosts } from '@/lib/data/community';

export default async function HomePage() {
  const [categories, homeSections, communityPosts] = await Promise.all([
    getPublicCategories(),
    getHomeSections(),
    getCommunityPosts(),
  ]);

  // Show real, admin-created products per section; only fall back to the
  // placeholder catalog for a section that has no real products tagged yet.
  const featured = homeSections.featured.length > 0 ? homeSections.featured : FEATURED_PRODUCTS;
  const trending = homeSections.trending.length > 0 ? homeSections.trending : TRENDING_PRODUCTS;
  const newArrivals = homeSections.newArrivals.length > 0 ? homeSections.newArrivals : NEW_ARRIVALS;

  return (
    <>
      <Hero />

      <ProductSection
        eyebrow="Featured Collection"
        title="This season's edit"
        viewAllHref="/shop?filter=featured"
        products={featured}
      />

      <Categories categories={categories} />

      <ProductSection
        eyebrow="Trending Now"
        title="What's moving fast"
        viewAllHref="/shop?filter=trending"
        products={trending}
      />

      <SaleBanner />

      <ProductSection
        eyebrow="Just Landed"
        title="New arrivals"
        viewAllHref="/shop?filter=new"
        products={newArrivals}
      />

      <Testimonials />
      <InstagramFeed posts={communityPosts} />
      <Newsletter />
    </>
  );
}
