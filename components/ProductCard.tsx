"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Star, Heart } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const price = product.variants?.length ? product.variants[0].price : product.base_price;
  const comparePrice = product.variants?.length ? product.variants[0].compare_at_price : product.compare_at_price;
  const image = product.images?.[0] || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop";
  const hoverImage = product.images?.[1] || image;
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;
  
  const discountPercent = comparePrice
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : null;

  // Check wishlist state on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("dh_user_wishlist") || "[]");
      setIsWishlisted(saved.includes(product.id));
    } catch (_) {}
  }, [product.id]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nextState = !isWishlisted;
    setIsWishlisted(nextState);

    try {
      const saved: string[] = JSON.parse(localStorage.getItem("dh_user_wishlist") || "[]");
      const updated = nextState
        ? Array.from(new Set([...saved, product.id]))
        : saved.filter((id) => id !== product.id);

      localStorage.setItem("dh_user_wishlist", JSON.stringify(updated));

      // Sync with Supabase if logged in
      if (isSupabaseConfigured() && user?.id) {
        if (nextState) {
          await supabase.from("wishlists").insert({ user_id: user.id, product_id: product.id });
        } else {
          await supabase.from("wishlists").delete().eq("user_id", user.id).eq("product_id", product.id);
        }
      }
    } catch (err) {
      console.warn("Wishlist toggle error:", err);
    }
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block relative">
      <div className="glass-panel-interactive rounded-3xl overflow-hidden flex flex-col h-full bg-white/40 dark:bg-[#1C1C1E]/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-white/5">
        
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F5F7] dark:bg-[#000000]">
          
          <img
            src={image}
            alt={product.title}
            className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0 absolute inset-0 z-10 ${
              isOutOfStock ? "grayscale opacity-75" : ""
            }`}
          />
          <img
            src={hoverImage}
            alt={`${product.title} Alternate View`}
            className={`w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 absolute inset-0 z-0 ${
              isOutOfStock ? "grayscale opacity-75" : ""
            }`}
          />

          {/* Top Left Badges */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start">
            {isOutOfStock ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black text-white bg-neutral-900/90 backdrop-blur-md uppercase tracking-wider shadow-sm">
                Sold Out
              </span>
            ) : (
              <>
                {product.is_bestseller && (
                  <span className="apple-pill px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-stone-900 dark:text-white uppercase tracking-wider">
                    Bestseller
                  </span>
                )}
                {discountPercent && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white bg-[#FF5733] uppercase tracking-wider shadow-sm">
                    {discountPercent}% Off
                  </span>
                )}
              </>
            )}
          </div>

          {/* Top Right Wishlist Heart Button */}
          <button
            type="button"
            onClick={toggleWishlist}
            className={`absolute top-3 right-3 z-30 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
              isWishlisted
                ? "bg-rose-50 text-rose-500 shadow-md scale-110"
                : "bg-white/80 dark:bg-black/60 text-stone-500 dark:text-stone-300 hover:text-rose-500 hover:bg-white"
            }`}
            title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
          >
            <Heart className={`w-4 h-4 transition-transform ${isWishlisted ? "fill-rose-500 scale-110" : ""}`} />
          </button>
        </div>

        {/* Details */}
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
          <h3 className="font-semibold text-[15px] leading-tight text-stone-900 dark:text-white tracking-tight line-clamp-2 mb-2 group-hover:text-[#FF5733] transition-colors">
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

            {isOutOfStock && (
              <span className="text-[11px] font-bold text-rose-500">
                Out of Stock
              </span>
            )}
          </div>
        </div>

      </div>
    </Link>
  );
}
