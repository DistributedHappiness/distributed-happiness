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

      {/* 7. Corporate & Wholesale Bulk Orders Banner */}
      <ScrollReveal delay={0.1}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-6 sm:p-10 border border-stone-800 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF5733]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center lg:text-left max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5733]/20 border border-[#FF5733]/30 text-[#FF5733] text-[11px] font-extrabold uppercase tracking-wider">
                  <span>🏢 B2B & Wholesale Division</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-black">
                  Corporate Gifting & Bulk Orders for Retailers
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Looking for 25 to 5,000+ customized pieces? Enjoy tiered wholesale pricing, free digital 3D mockup proofs, custom laser engraving/printing, GST invoices, and pan-India doorstep dispatch.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[11px] text-stone-400 pt-1">
                  <span>✓ MOQ from 25 units</span>
                  <span>✓ Up to 45% wholesale discount</span>
                  <span>✓ Multi-city employee dropshipping</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}?text=${encodeURIComponent(
                    "Hello Distribute Happiness! I want a custom quote for a bulk corporate / retailer order."
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105"
                >
                  <span>Chat on WhatsApp</span>
                </a>

                <Link
                  href="/bulk"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#FF5733] hover:bg-[#e04826] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105"
                >
                  <span>Explore Bulk Pricing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
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
