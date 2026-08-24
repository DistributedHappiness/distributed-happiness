"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Product, ProductVariant, CustomizationSelection } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/utils";
import { uploadCustomizationImage } from "@/lib/supabase";
import confetti from "canvas-confetti";
import {
  ShoppingBag,
  Star,
  Upload,
  Minus,
  Plus,
  Eye,
  Check,
  Leaf,
} from "lucide-react";

interface ProductPurchaseSectionProps {
  product: Product;
  selectedVariant?: ProductVariant;
  onVariantChange?: (variant: ProductVariant) => void;
}

export default function ProductPurchaseSection({
  product,
  selectedVariant,
  onVariantChange,
}: ProductPurchaseSectionProps) {
  const router = useRouter();
  const { addItem, setIsCartOpen } = useCart();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [isAddedAnimation, setIsAddedAnimation] = useState(false);

  const images = product.images.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop"];

  const currentPrice = selectedVariant ? selectedVariant.price : product.base_price;
  const comparePrice = selectedVariant?.compare_at_price || product.compare_at_price;
  const discountPercent = comparePrice
    ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100)
    : null;
    
  const viewersCount = Math.floor(Math.random() * 40) + 10;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadCustomizationImage(file);
      setUploadedImageUrl(url);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length < 6) {
      setPincodeStatus("Please enter a valid 6-digit PIN code.");
      return;
    }
    const daysAhead = Math.floor(Math.random() * 2) + 3;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + daysAhead);
    const dateStr = deliveryDate.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    setPincodeStatus(`Available. Expected delivery by ${dateStr}.`);
  };

  const handleAddToCart = (instantCheckout: boolean = false) => {
    const customizationData: CustomizationSelection = {
      texts: customText ? { custom_name: customText } : {},
      selected_font: "Standard",
      selected_color: "#111827",
      uploaded_image_url: uploadedImageUrl || undefined,
      selected_addons: [],
    };

    addItem(product, customizationData, selectedVariant, quantity);

    setIsAddedAnimation(true);
    setTimeout(() => setIsAddedAnimation(false), 2000);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err) {}

    if (instantCheckout) {
      router.push("/checkout");
    } else {
      setIsCartOpen(true);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start font-sans">
      
      {/* ================= LEFT: PRODUCT IMAGES ================= */}
      <div className="space-y-4 md:sticky md:top-24">
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
          <img
            src={images[activeImageIndex] || images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          {discountPercent && (
            <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-sm shadow-sm">
              -{discountPercent}%
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                  idx === activeImageIndex
                    ? "border-emerald-700"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ================= RIGHT: PRODUCT DETAILS & PURCHASE ================= */}
      <div className="space-y-6 text-stone-800">
        
        {/* Title & Badges */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
            {product.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              <Leaf className="w-4 h-4" />
              Eco-friendly product
            </span>
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-stone-600">5.0 ({product.review_count || "142"} ratings)</span>
            </div>
          </div>
          
          <div className="text-xs text-stone-500 font-medium">
            Product Code | GKD-DH-{product.id.substring(0, 8).toUpperCase()}
          </div>
        </div>

        {/* Pricing Box */}
        <div className="space-y-1 bg-stone-50 p-4 rounded-xl border border-stone-200">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-rose-600">
              Rs. {currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
            {comparePrice && (
              <span className="text-lg text-stone-400 line-through">
                Rs. {comparePrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 pt-1">
            <Check className="w-4 h-4" />
            <span>Free Shipping & Tax Included</span>
          </div>
        </div>

        {/* Variants Selection */}
        {product.variants && product.variants.length > 0 && (
          <div className="space-y-3">
            <label className="text-sm font-bold text-stone-900">
              Variant / Size *
            </label>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => onVariantChange?.(v)}
                  className={`px-4 py-2 text-sm font-medium transition-all border ${
                    selectedVariant?.id === v.id
                      ? "border-emerald-700 bg-emerald-700 text-white shadow-md"
                      : "border-stone-300 bg-white text-stone-700 hover:border-emerald-700"
                  }`}
                >
                  {v.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Customization Inputs */}
        <div className="space-y-4 pt-2">
          <label className="text-sm font-bold text-stone-900 flex flex-col">
            <span>• Custom Name & Logo Printing •</span>
            <span className="text-xs text-stone-500 font-normal mt-0.5">(Upload HD/DSLR Only)</span>
          </label>
          
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Add Your Custom Text (e.g. Name, Date, Quote)"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-stone-300 rounded-md text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
            />
            
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-3 bg-stone-100 border border-dashed border-stone-400 rounded-md hover:border-emerald-600 hover:bg-stone-50 text-sm font-medium text-stone-700 transition-colors">
                <Upload className="w-4 h-4" />
                <span>{isUploading ? "Uploading..." : uploadedImageUrl ? "Image Selected" : "Upload File / Logo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              {uploadedImageUrl && (
                <div className="w-12 h-12 rounded-md overflow-hidden border border-emerald-600 flex-shrink-0 bg-white">
                  <img src={uploadedImageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quantity & Action Buttons */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-bold text-stone-900">
              Quantity *
            </label>
            <div className="flex items-center border border-stone-300 rounded-md bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-stone-500 hover:text-stone-900 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 font-bold text-sm w-12 text-center border-x border-stone-300 py-2">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-stone-500 hover:text-stone-900 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handleAddToCart(false)}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-md shadow-md transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={() => handleAddToCart(true)}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-md shadow-md transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
            >
              <span>Buy It Now</span>
            </button>
          </div>
        </div>

        {/* Live Viewers Tracker */}
        <div className="flex items-center gap-2 text-sm font-semibold text-rose-600 bg-rose-50 px-4 py-2.5 rounded-md border border-rose-100">
          <Eye className="w-4 h-4" />
          <span>{viewersCount} customers are viewing this product</span>
        </div>

        {/* Check Product Availability */}
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
          <label className="text-sm font-bold text-stone-900">
            Check Product Availability
          </label>
          <form onSubmit={handlePincodeCheck} className="flex gap-2">
            <input
              type="text"
              maxLength={6}
              placeholder="Enter Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
              className="flex-1 px-4 py-2.5 bg-white border border-stone-300 rounded-md text-sm focus:outline-none focus:border-emerald-600 transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-stone-900 text-white font-bold text-sm rounded-md hover:bg-stone-800 transition-colors"
            >
              Check Now
            </button>
          </form>
          {pincodeStatus && (
            <p className="text-xs font-semibold text-emerald-700">
              {pincodeStatus}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
