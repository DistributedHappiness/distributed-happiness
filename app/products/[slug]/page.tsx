"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MOCK_PRODUCTS, MOCK_REVIEWS } from "@/lib/mock-data";
import ProductPurchaseSection from "@/components/ProductPurchaseSection";
import ProductCard from "@/components/ProductCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ProductVariant } from "@/lib/types";
import { Star, ShieldCheck, Truck, Earth, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<"description" | "shipping">("description");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const { getProductBySlug, getProducts } = await import("@/lib/api");
        const data = await getProductBySlug(slug);
        if (data) {
          setProduct(data);
          setSelectedVariant(data.variants?.find((v: any) => v.is_default) || data.variants?.[0]);
          
          const allProducts = await getProducts();
          setRelatedProducts(allProducts.filter((p: any) => p.id !== data.id).slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen bg-stone-50 flex items-center justify-center">Loading product...</div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-stone-50 flex items-center justify-center font-bold text-2xl">Product not found</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 w-full font-sans">
      
      {/* Sleek Back Button */}
      <div className="flex items-center">
        <Link 
          href="/products" 
          className="inline-flex items-center gap-2 text-sm font-bold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 hover:border-stone-300 px-4 py-2 rounded-full transition-all shadow-sm hover:shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>

      {/* ---------------- PRODUCT PURCHASE SECTION ---------------- */}
      <section>
        <ProductPurchaseSection
          product={product}
          selectedVariant={selectedVariant}
          onVariantChange={setSelectedVariant}
        />
      </section>

      {/* ---------------- GOOGLE REVIEWS SECTION (GiftKyaDe Style) ---------------- */}
      <section className="pt-10 border-t border-stone-200">
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-stone-50 p-6 rounded-2xl border border-stone-200 mb-8">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1 border-b sm:border-b-0 sm:border-r border-stone-300 pb-4 sm:pb-0 sm:pr-8">
            <span className="text-2xl font-black text-stone-900">Excellent</span>
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-500" />
              ))}
            </div>
            <span className="text-xs text-stone-500 font-medium mt-1">Based on 41 Reviews</span>
            <div className="mt-2 text-xl font-bold tracking-tighter">
              <span className="text-blue-500">G</span>
              <span className="text-rose-500">o</span>
              <span className="text-amber-500">o</span>
              <span className="text-blue-500">g</span>
              <span className="text-emerald-500">l</span>
              <span className="text-rose-500">e</span>
            </div>
          </div>
          
          <div className="flex overflow-x-auto gap-4 flex-1 w-full pb-4 sm:pb-0 no-scrollbar snap-x">
            {MOCK_REVIEWS.map((review) => (
              <div key={review.id} className="min-w-[280px] bg-white p-4 rounded-xl border border-stone-200 shadow-sm snap-center">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-bold text-sm text-stone-900">{review.user_name}</h5>
                    <span className="text-[10px] text-stone-400">May 13, 2026</span>
                  </div>
                  <div className="flex text-amber-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  "{review.comment}"
                </p>
                <button className="text-[10px] font-bold text-emerald-700 mt-2 hover:underline">Read More</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- ECO CONSCIOUS BANNER ---------------- */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-center gap-3 text-emerald-800 text-sm font-bold">
        <Earth className="w-5 h-5" />
        <span>🌍 Eco-Conscious Choice — Loved by Sustainable Shoppers</span>
      </div>

      {/* ---------------- CUSTOMER REVIEWS (ON SITE) ---------------- */}
      <section className="pt-8">
        <h2 className="text-2xl font-black text-stone-900 mb-6">Customer Reviews</h2>
        <div className="flex flex-col sm:flex-row gap-8 items-start">
          <div className="w-full sm:w-1/3 space-y-4">
            <div className="text-4xl font-black text-stone-900 flex items-center gap-3">
              5.00 <span className="text-base text-stone-500 font-medium">out of 5</span>
            </div>
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-500" />
              ))}
            </div>
            <p className="text-sm text-stone-500 font-medium">Based on 2 reviews</p>
            <button className="w-full py-3 bg-stone-900 text-white font-bold text-sm rounded-md hover:bg-stone-800 transition-colors">
              Write a review
            </button>
          </div>
          
          <div className="w-full sm:w-2/3 space-y-6">
            <div className="flex justify-end border-b border-stone-200 pb-2">
              <select className="text-sm bg-transparent font-medium text-stone-600 focus:outline-none">
                <option>Sort by: Most Recent</option>
                <option>Sort by: Highest Rating</option>
              </select>
            </div>
            {/* Reviews List */}
            <div className="space-y-6">
              <div className="border-b border-stone-100 pb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-bold text-sm text-stone-900">HR Shivam</h5>
                    <div className="flex text-amber-500 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-stone-400 font-medium">07/04/2026</span>
                </div>
                <p className="text-sm text-stone-600 mt-2">Quality 10/10 liked the feel and quality of the product.</p>
              </div>
              <div className="border-b border-stone-100 pb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-bold text-sm text-stone-900">Ritika Sharma</h5>
                    <div className="flex text-amber-500 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-stone-400 font-medium">07/02/2026</span>
                </div>
                <p className="text-sm text-stone-600 mt-2">loved the product A must buy, got all 10pc customized with my friend's name.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- PRODUCT DETAILS (Tabs) ---------------- */}
      <section className="pt-12 border-t border-stone-200">
        <h2 className="text-2xl font-black text-stone-900 mb-6">Product details</h2>
        
        <div className="flex border-b border-stone-200 gap-8 text-sm font-bold uppercase tracking-wider mb-8">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-4 transition-colors relative ${
              activeTab === "description"
                ? "text-stone-900"
                : "text-stone-400 hover:text-stone-900"
            }`}
          >
            Description
            {activeTab === "description" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("shipping")}
            className={`pb-4 transition-colors relative ${
              activeTab === "shipping"
                ? "text-stone-900"
                : "text-stone-400 hover:text-stone-900"
            }`}
          >
            Shipping Information
            {activeTab === "shipping" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="text-sm text-stone-700 leading-relaxed space-y-8 max-w-4xl">
          {activeTab === "description" && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-stone-900">{product.title} – Crafted Just for You</h3>
                <p>
                  Capture your thoughts, dreams, ideas, and memories in a product that's uniquely yours. This customized piece makes for a timeless keepsake and a thoughtful gift for anyone special in your life.
                </p>
                <p>
                  Designed with premium finishing and high-quality materials, this piece blends elegance, durability, and personalization into one beautiful creation.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-stone-900">Why You'll Love It</h3>
                <ul className="space-y-2">
                  <li>✨ <strong>Personalized</strong> with your Initial & Name</li>
                  <li>🌿 <strong>Premium</strong> Eco-friendly material</li>
                  <li>🖋️ <strong>Elegant</strong> Custom Engraving & Printing</li>
                  <li>💼 <strong>Strong</strong> Durable finishing for daily use</li>
                  <li>🎁 <strong>Perfect Gift</strong> for Every Occasion</li>
                  <li>🇮🇳 <strong>Proudly Made in India</strong></li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-stone-900">Product Features</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Custom engraved alphabet with personalized name</li>
                  <li>Premium natural finish</li>
                  <li>High-quality HD printing / laser engraving</li>
                  <li>Lightweight, elegant and easy to carry</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-stone-900">Product Specifications</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Product:</strong> {product.title}</li>
                  <li><strong>Material:</strong> Premium Build</li>
                  <li><strong>Customization:</strong> Alphabet & Name / Photo Upload</li>
                  <li><strong>Country of Origin:</strong> India</li>
                </ul>
              </div>
            </>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-4">
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span><strong>Quality Assured:</strong> Checked securely before packaging.</span>
                </li>
                <li className="flex gap-3">
                  <Truck className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span><strong>Fast Dispatch:</strong> Handcrafted and shipped within 24-48 working hours.</span>
                </li>
              </ul>
              <p className="mt-4">
                We use premium courier partners like BlueDart, Delhivery, and DTDC. Delivery within metro cities usually takes 2-4 days, while rest of India deliveries take 4-7 days depending on the pin code.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ---------------- RELATED PRODUCTS ---------------- */}
      <section className="pt-16">
        <h2 className="text-2xl font-black text-stone-900 mb-8 text-center sm:text-left">Related Products</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <WhatsAppButton />
    </div>
  );
}
