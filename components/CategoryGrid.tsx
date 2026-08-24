import React from "react";
import Link from "next/link";
import { Category } from "@/lib/types";

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  // We'll take up to 6 categories for a beautiful Apple-style Bento grid.
  const displayCats = categories.slice(0, 6);

  if (displayCats.length === 0) return null;

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-gradient-apple">
            Shop by Category.
          </h2>
          <p className="text-sm sm:text-base text-stone-500 dark:text-stone-400 font-light mt-2">
            Curated collections designed for your special moments.
          </p>
        </div>
        <Link
          href="/products"
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 transition-colors"
        >
          Browse all categories &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {displayCats.map((cat, idx) => {
          // Make the first one span wider on large screens for a bento effect
          const isLarge = idx === 0 || idx === 3;
          
          return (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`group relative overflow-hidden rounded-[32px] glass-panel-interactive flex flex-col justify-end aspect-[4/3] ${
                isLarge ? "md:col-span-2 lg:col-span-2" : "col-span-1"
              }`}
            >
              {/* Image Background */}
              <div className="absolute inset-0 z-0">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Text Content */}
              <div className="relative z-10 p-8 sm:p-10 flex flex-col justify-end h-full">
                <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-white mb-2">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-sm text-white/80 font-light max-w-md line-clamp-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    {cat.description}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

    </section>
  );
}
