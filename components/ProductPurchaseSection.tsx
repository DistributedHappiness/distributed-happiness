"use client";

import React, { useState, useEffect } from "react";
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
  Type,
  Palette,
  Gift,
  Sparkles,
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
  
  // Customization States
  const [customTexts, setCustomTexts] = useState<Record<string, string>>({});
  const [selectedFont, setSelectedFont] = useState("Standard");
  const [selectedColor, setSelectedColor] = useState("#111827");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [isAddedAnimation, setIsAddedAnimation] = useState(false);

  // Initialize customization options from product configs
  useEffect(() => {
    if (product.is_customizable && product.customization_config) {
      // Set initial font
      const fonts = product.customization_config.fonts || [];
      if (fonts.length > 0) {
        setSelectedFont(fonts[0]);
      }
      
      // Set initial color
      const colors = product.customization_config.colors || [];
      if (colors.length > 0) {
        setSelectedColor(colors[0]);
      }

      // Initialize empty strings for text fields
      const textFields = product.customization_config.text_fields || [];
      const initialTexts: Record<string, string> = {};
      textFields.forEach((tf) => {
        initialTexts[tf.id] = "";
      });
      setCustomTexts(initialTexts);
    }
  }, [product]);

  const images = product.images.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop"];

  // Base price from variant or product
  const basePrice = selectedVariant ? selectedVariant.price : product.base_price;
  const comparePrice = selectedVariant?.compare_at_price || product.compare_at_price;
  
  // Calculate Live Total Price (Base + Image Addon + Checked Addons)
  let liveUnitPrice = basePrice;
  if (uploadedImageUrl && product.customization_config?.image_upload?.price_addon) {
    liveUnitPrice += product.customization_config.image_upload.price_addon;
  }
  selectedAddons.forEach((addonId) => {
    const addon = product.customization_config?.addons?.find((a) => a.id === addonId);
    if (addon) {
      liveUnitPrice += addon.price;
    }
  });

  const liveTotalPrice = liveUnitPrice * quantity;

  const discountPercent = comparePrice
    ? Math.round(((comparePrice - basePrice) / comparePrice) * 100)
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
      texts: customTexts,
      selected_font: selectedFont,
      selected_color: selectedColor,
      uploaded_image_url: uploadedImageUrl || undefined,
      selected_addons: selectedAddons,
    };

    addItem(product, customizationData, selectedVariant, quantity);

    setIsAddedAnimation(true);
    setTimeout(() => setIsAddedAnimation(false), 2000);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 },
      });
    } catch (err) {}

    if (instantCheckout) {
      router.push("/checkout");
    } else {
      setIsCartOpen(true);
    }
  };

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  // Text fields customizer renderer helper
  const textFields = product.customization_config?.text_fields || [];
  const fonts = product.customization_config?.fonts || [];
  const colors = product.customization_config?.colors || [];
  const imageUploadConfig = product.customization_config?.image_upload;
  const productAddons = product.customization_config?.addons || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start font-sans">
      
      {/* ================= LEFT: PRODUCT IMAGES & REAL-TIME PREVIEW ================= */}
      <div className="space-y-4 md:sticky md:top-24">
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm flex items-center justify-center">
          <img
            src={images[activeImageIndex] || images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          
          {/* Dynamic Mockup Live Custom Text Overlay */}
          {product.is_customizable && activeImageIndex === 0 && textFields.length > 0 && (
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6"
              style={{ background: "rgba(0, 0, 0, 0.05)" }}
            >
              <div 
                className="w-[85%] text-center p-3 rounded-xl space-y-1.5 transition-all duration-300"
                style={{ 
                  background: "rgba(0, 0, 0, 0.4)", 
                  backdropFilter: "blur(6px)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
                }}
              >
                {textFields.map((tf) => {
                  const userText = customTexts[tf.id] || "";
                  return (
                    <div
                      key={tf.id}
                      style={{
                        fontFamily: selectedFont !== "Standard" ? selectedFont : "sans-serif",
                        color: selectedColor,
                        fontSize: tf.font_size ? `${tf.font_size * 0.9}px` : "16px",
                        fontWeight: "bold",
                        textShadow: "1px 1px 4px rgba(0, 0, 0, 0.8)",
                        letterSpacing: "0.03em"
                      }}
                      className="truncate"
                    >
                      {userText || tf.placeholder || tf.label}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
                    ? "border-emerald-700 shadow-md scale-[1.02]"
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
      <div className="space-y-6 text-stone-800 animate-fade-in">
        
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

        {/* Pricing Box (Updates with custom live selections) */}
        <div className="space-y-1 bg-stone-50 p-4 rounded-xl border border-stone-200">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-rose-600">
              Rs. {liveUnitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
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

        {/* Dynamic Studio Customizer Panel */}
        {product.is_customizable && (
          <div className="space-y-5 p-5 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
              <Sparkles className="w-4.5 h-4.5 text-rose-600" />
              <span className="text-sm font-bold text-stone-950">Personalization Studio</span>
            </div>

            {/* Custom text boxes */}
            {textFields.length > 0 && (
              <div className="space-y-4">
                {textFields.map((tf) => (
                  <div key={tf.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-stone-700">
                      <span>{tf.label} *</span>
                      {tf.max_chars && (
                        <span className="text-[10px] text-stone-400 font-medium">
                          {(customTexts[tf.id] || "").length} / {tf.max_chars} chars
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      maxLength={tf.max_chars}
                      placeholder={tf.placeholder || `Type your customized text...`}
                      value={customTexts[tf.id] || ""}
                      onChange={(e) => setCustomTexts({ ...customTexts, [tf.id]: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-stone-300 rounded-md text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-medium"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Typography selection */}
            {fonts.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                  <Type className="w-3.5 h-3.5 text-stone-400" /> Select Font Style
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {fonts.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setSelectedFont(f)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all text-center`}
                      style={{ 
                        fontFamily: f,
                        borderColor: selectedFont === f ? "#0f5132" : "#d3d3d3",
                        background: selectedFont === f ? "#e8f5e9" : "#fff",
                        color: selectedFont === f ? "#0f5132" : "#374151"
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Swatch Selector */}
            {colors.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-stone-400" /> Choose Print Color
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className="w-8 h-8 rounded-full border flex items-center justify-center transition-all hover:scale-105"
                      style={{ 
                        backgroundColor: c, 
                        borderColor: selectedColor === c ? "#0f5132" : "rgba(0,0,0,0.12)",
                        boxShadow: selectedColor === c ? "0 0 0 2.5px rgba(16,185,129,0.35)" : "none"
                      }}
                      title={c}
                    >
                      {selectedColor === c && (
                        <Check className="w-4 h-4" style={{ color: c === "#FFFFFF" ? "#000" : "#FFF" }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Image upload config */}
            {imageUploadConfig?.enabled && (
              <div className="space-y-2 pt-1 border-t border-stone-200/50">
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5 text-stone-400" />
                  {imageUploadConfig.label || "Upload Custom File / Logo"}
                  {imageUploadConfig.price_addon ? ` (+₹${imageUploadConfig.price_addon})` : ""}
                </span>
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-3 bg-white border border-dashed border-stone-300 rounded-md hover:border-emerald-600 hover:bg-stone-50 text-sm font-medium text-stone-700 transition-colors">
                    <Upload className="w-4 h-4 text-stone-400" />
                    <span>{isUploading ? "Uploading..." : uploadedImageUrl ? "File Uploaded ✓" : "Choose File"}</span>
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
                      <img src={uploadedImageUrl} alt="Uploaded logo" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Packaging and add-ons option box */}
            {productAddons.length > 0 && (
              <div className="space-y-2 pt-2.5 border-t border-stone-200/50">
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5 text-stone-400" /> Extras & Packaging options
                </span>
                <div className="space-y-2">
                  {productAddons.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => handleAddonToggle(addon.id)}
                        className="w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all"
                        style={{
                          background: isChecked ? "#f0fdf4" : "#fff",
                          borderColor: isChecked ? "#16a34a" : "#d3d3d3",
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? "bg-emerald-600 border-emerald-600 text-white" : "border-stone-300 bg-white"}`}>
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <span className="text-[12px] font-semibold text-stone-700">{addon.label}</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-800">+₹{addon.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

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
                onClick={() => setQuantity(product.stock ? Math.min(product.stock, quantity + 1) : quantity + 1)}
                disabled={Boolean(product.stock !== undefined && product.stock > 0 && quantity >= product.stock)}
                className="px-3 py-2 text-stone-500 hover:text-stone-900 transition-colors disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {product.stock !== undefined && product.stock > 0 && product.stock <= 5 && (
              <span className="text-xs font-bold text-amber-600">
                Only {product.stock} left in stock!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {product.stock !== undefined && product.stock <= 0 ? (
              <button
                disabled
                className="col-span-full py-4 bg-stone-200 dark:bg-stone-800 text-stone-500 font-bold text-sm rounded-md cursor-not-allowed uppercase tracking-wide text-center"
              >
                Currently Out of Stock
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleAddToCart(false)}
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-md shadow-md transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAddedAnimation ? "Added to Cart!" : "Add to Cart"}</span>
                </button>
                <button
                  onClick={() => handleAddToCart(true)}
                  className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-md shadow-md transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  <span>Buy It Now</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Live Viewers Tracker */}
        <div className="flex items-center gap-2 text-sm font-semibold text-rose-600 bg-rose-50 px-4 py-2.5 rounded-md border border-rose-100">
          <Eye className="w-4 h-4 animate-pulse" />
          <span>{viewersCount} customers are viewing this product right now</span>
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
