"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import { getProducts, getCategories } from "@/lib/api";
import { Product, Category } from "@/lib/types";
import { Sparkles, Briefcase, Monitor, Home as HomeIcon, CalendarDays, Coffee, Key, LayoutGrid } from "lucide-react";
let cachedProducts: Product[] | null = null;
let cachedCategories: Category[] | null = null;

function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-stone-200 dark:border-stone-800 p-4 space-y-4 animate-pulse bg-white/45 dark:bg-[#1C1C1E]/45">
      <div className="aspect-[4/5] w-full rounded-2xl bg-stone-200/60 dark:bg-stone-800/60" />
      <div className="space-y-2">
        <div className="h-4 w-2/3 bg-stone-200/60 dark:bg-stone-800/60 rounded" />
        <div className="h-3 w-1/2 bg-stone-200/60 dark:bg-stone-800/60 rounded" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 w-1/4 bg-stone-200/60 dark:bg-stone-800/60 rounded" />
        <div className="h-8 w-8 rounded-full bg-stone-200/60 dark:bg-stone-800/60" />
      </div>
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-4 hide-scrollbar">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 flex flex-col items-center justify-center w-28 h-32 rounded-2xl border-2 border-transparent bg-stone-50/50 dark:bg-[#1C1C1E]/20 animate-pulse"
        >
          <div className="w-12 h-12 rounded-full bg-stone-200/60 dark:bg-stone-800/60 mb-3" />
          <div className="h-3 w-16 bg-stone-200/60 dark:bg-stone-800/60 rounded mx-auto" />
        </div>
      ))}
    </div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "all");
  const [sortOption, setSortOption] = useState<string>("featured");
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(12);
  }, [selectedCategory, searchParam, sortOption]);

  useEffect(() => {
    async function load() {
      if (cachedProducts && cachedCategories) {
        setProducts(cachedProducts);
        setCategories(cachedCategories);
        setLoading(false);
        return;
      }
      try {
        const [p, c] = await Promise.all([getProducts(), getCategories()]);
        cachedProducts = p;
        cachedCategories = c;
        setProducts(p);
        setCategories(c);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [categoryParam]);

  let filtered = products.filter((p) => {
    if (selectedCategory !== "all") {
      const matchCat = categories.find((c) => c.slug === selectedCategory);
      if (matchCat && p.category_id !== matchCat.id) return false;
    }
    if (searchParam) {
      const q = searchParam.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  if (sortOption === "price_asc") {
    filtered.sort((a, b) => a.base_price - b.base_price);
  } else if (sortOption === "price_desc") {
    filtered.sort((a, b) => b.base_price - a.base_price);
  }

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => prev + 12);
      }
    }, { threshold: 0.1, rootMargin: "200px" }); // trigger earlier before hitting absolute bottom
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loading, products.length, visibleCount, filtered.length]);

  const getIconForCategory = (slug: string, isActive: boolean) => {
    const className = `w-6 h-6 ${isActive ? "text-[#FF5733]" : "text-stone-600"}`;
    switch (slug) {
      case "corporate-premium-gifts": return <Briefcase className={className} />;
      case "desk-office-accessories": return <Monitor className={className} />;
      case "home-decor-keepsakes": return <HomeIcon className={className} />;
      case "calendars-planners": return <CalendarDays className={className} />;
      case "drinkware-mugs": return <Coffee className={className} />;
      case "keychains-accessories": return <Key className={className} />;
      default: return <LayoutGrid className={className} />;
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Catalog Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            {searchParam
              ? `Search Results for "${searchParam}"`
              : selectedCategory !== "all"
              ? categories.find((c) => c.slug === selectedCategory)?.name || "Personalized Gifts"
              : "All Personalized Gifts"}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Showing {filtered.length} customized handcrafted items
          </p>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-3 py-2 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300"
          >
            <option value="featured">Featured / Trending</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Horizontal Category Scroll Bar */}
      {loading ? (
        <CategorySkeleton />
      ) : (
        <div className="flex items-center gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {/* "All" Category Button */}
          <button
            onClick={() => setSelectedCategory("all")}
            className={`flex-shrink-0 flex flex-col items-center justify-center w-28 h-32 rounded-2xl border-2 transition-all duration-300 ${
              selectedCategory === "all" 
                ? "border-[#FF5733] bg-orange-50 shadow-md" 
                : "border-transparent bg-stone-50 hover:bg-stone-100"
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${selectedCategory === "all" ? "bg-white shadow-sm" : "bg-white shadow-sm"}`}>
              <LayoutGrid className={`w-6 h-6 ${selectedCategory === "all" ? "text-[#FF5733]" : "text-stone-600"}`} />
            </div>
            <span className={`text-xs font-bold text-center px-2 ${selectedCategory === "all" ? "text-[#FF5733]" : "text-stone-600"}`}>
              All Gifts
            </span>
          </button>

          {/* Dynamic Categories */}
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`flex-shrink-0 flex flex-col items-center justify-center w-28 h-32 rounded-2xl border-2 transition-all duration-300 ${
                  isActive 
                    ? "border-[#FF5733] bg-orange-50 shadow-md" 
                    : "border-transparent bg-stone-50 hover:bg-stone-100"
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${isActive ? "bg-white shadow-sm" : "bg-white shadow-sm"}`}>
                  {getIconForCategory(cat.slug, isActive)}
                </div>
                <span className={`text-xs font-bold text-center px-2 leading-tight ${isActive ? "text-[#FF5733]" : "text-stone-600"}`}>
                  {cat.name.replace('&', '\n&')}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-3">
          <Sparkles className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-bold text-base text-stone-900 dark:text-white">No personalized gifts found</h3>
          <p className="text-xs text-stone-500">Try changing your category or search query.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.slice(0, visibleCount).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Scroll Trigger for Infinite Loading */}
          {!loading && visibleCount < filtered.length && (
            <div ref={loadMoreRef} className="py-10 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-stone-200 border-t-[#FF5733] rounded-full animate-spin" />
            </div>
          )}
        </>
      )}

      <WhatsAppButton />
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50" />}>
      <ProductsContent />
    </Suspense>
  );
}
