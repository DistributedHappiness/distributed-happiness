import React from "react";
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import PromoBanners from "@/components/PromoBanners";
import TrustBar from "@/components/TrustBar";
import CategoryGrid from "@/components/CategoryGrid";
import ProductCard from "@/components/ProductCard";
import GiftFinder from "@/components/GiftFinder";
import ReviewsSection from "@/components/ReviewsSection";
import ScrollReveal from "@/components/ScrollReveal";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getProducts, getCategories } from "@/lib/api";
import { Sparkles, ArrowRight, Flame } from "lucide-react";

export default async function HomePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const bestsellers = products.filter((p) => p.is_bestseller).slice(0, 4);

  const featured = products.filter((p) => p.is_featured).slice(0, 4);

  return (
    <div className="space-y-4">
      {/* 1. Main Promotional Hero Banner */}
      <HeroSlider />

      {/* Promo Banners */}
      <ScrollReveal delay={0.1}>
        <PromoBanners />
      </ScrollReveal>

      {/* 2. 4-Pillar Trust Bar */}
      <ScrollReveal delay={0.2}>
        <TrustBar />
      </ScrollReveal>

      {/* 3. Category Grid Collections */}
      <ScrollReveal delay={0.1}>
        <CategoryGrid categories={categories} />
      </ScrollReveal>

      {/* 4. Trending / Best Sellers Section */}
      <ScrollReveal delay={0.1}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-full flex items-center gap-1 w-max">
                <Flame className="w-3.5 h-3.5" />
                <span>Most Loved Right Now</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-1">
                Trending Personalized Best Sellers
              </h2>
            </div>

            <Link
              href="/products"
              className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View All Best Sellers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {(bestsellers.length > 0 ? bestsellers : products.slice(0, 4)).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* 5. Interactive Gift Finder (Occasion & Recipient) */}
      <ScrollReveal delay={0.1}>
        <GiftFinder />
      </ScrollReveal>

      {/* 6. Featured Gifts Section */}
      <ScrollReveal delay={0.1}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full flex items-center gap-1 w-max">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured Masterpieces</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-1">
                Handmade Gifts For Every Celebration
              </h2>
            </div>

            <Link
              href="/products"
              className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Explore Entire Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {(featured.length > 0 ? featured : products.slice(0, 4)).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* 8. Verified Customer Reviews */}
      <ScrollReveal delay={0.1}>
        <ReviewsSection />
      </ScrollReveal>

      {/* Floating WhatsApp Support Button */}
      <WhatsAppButton />
    </div>
  );
}
