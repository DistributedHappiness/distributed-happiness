import React from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = product.variants?.length ? product.variants[0].price : product.base_price;
  const comparePrice = product.variants?.length ? product.variants[0].compare_at_price : product.compare_at_price;
  const image = product.images?.[0] || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop";
  const hoverImage = product.images?.[1] || image;
  
  const discountPercent = comparePrice
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : null;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="glass-panel-interactive rounded-3xl overflow-hidden flex flex-col h-full bg-white/40 dark:bg-[#1C1C1E]/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-white/5">
        
        {/* Apple Style Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F5F7] dark:bg-[#000000]">
          
          <img
            src={image}
            alt={product.title}
            className="w-full h-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0 absolute inset-0 z-10"
          />
          <img
            src={hoverImage}
            alt={`${product.title} Alternate View`}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 absolute inset-0 z-0"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
            {product.is_bestseller && (
              <span className="apple-pill px-3 py-1 rounded-full text-[10px] font-semibold text-stone-900 dark:text-white uppercase tracking-wider">
                Bestseller
              </span>
            )}
            {discountPercent && (
              <span className="px-3 py-1 rounded-full text-[10px] font-semibold text-white bg-blue-500 uppercase tracking-wider shadow-sm">
                Save {discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Minimalist Details */}
        <div className="p-5 flex flex-col flex-1">
          
          {/* Reviews */}
          <div className="flex items-center gap-1.5 mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
              {product.rating || "4.9"}
            </span>
            <span className="text-[10px] text-stone-400 dark:text-stone-500">
              ({product.review_count || "142"})
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-[15px] leading-tight text-stone-900 dark:text-white tracking-tight line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.title}
          </h3>

          <div className="mt-auto pt-4 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-stone-900 dark:text-white">
                {formatCurrency(price)}
              </span>
              {comparePrice && (
                <span className="text-[11px] text-stone-400 line-through">
                  {formatCurrency(comparePrice)}
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}
