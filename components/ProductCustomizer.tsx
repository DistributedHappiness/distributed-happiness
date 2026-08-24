"use client";

import React, { useState } from "react";
import { Product, ProductVariant, CustomizationSelection } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/utils";
import { uploadCustomizationImage } from "@/lib/supabase";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Type,
  Palette,
  CheckCircle2,
  Gift,
  ShoppingBag,
  RotateCcw,
} from "lucide-react";

interface ProductCustomizerProps {
  product: Product;
  selectedVariant?: ProductVariant;
  onVariantChange?: (variant: ProductVariant) => void;
}

export default function ProductCustomizer({
  product,
  selectedVariant,
  onVariantChange,
}: ProductCustomizerProps) {
  const { addItem } = useCart();
  const config = product.customization_config;

  // State for customization fields
  const [texts, setTexts] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    config.text_fields?.forEach((field) => {
      initial[field.id] = "";
    });
    return initial;
  });

  const [selectedFont, setSelectedFont] = useState<string>(
    config.fonts?.[0] || "Inter"
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    config.colors?.[0] || "#111827"
  );
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddedAnimation, setIsAddedAnimation] = useState<boolean>(false);

  // Default font fallback list if not configured
  const fontList = config.fonts || [
    "Dancing Script",
    "Playfair Display",
    "Inter",
    "Cinzel",
    "Pacifico",
    "Montserrat",
  ];

  // Default color palette
  const colorList = config.colors || [
    "#111827",
    "#FFFFFF",
    "#DC2626",
    "#2563EB",
    "#16A34A",
    "#D97706",
    "#9333EA",
    "#E11D48",
  ];

  // Handle image upload
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

  // Toggle Addon
  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  // Calculate dynamic current price
  const basePrice = selectedVariant ? selectedVariant.price : product.base_price;
  let addonsCost = 0;
  selectedAddons.forEach((id) => {
    const addon = config.addons?.find((a) => a.id === id);
    if (addon) addonsCost += addon.price;
  });
  if (uploadedImageUrl && config.image_upload?.price_addon) {
    addonsCost += config.image_upload.price_addon;
  }
  const unitPrice = basePrice + addonsCost;
  const totalPrice = unitPrice * quantity;

  // Add to cart handler
  const handleAddToCart = () => {
    const customizationData: CustomizationSelection = {
      texts,
      selected_font: selectedFont,
      selected_color: selectedColor,
      uploaded_image_url: uploadedImageUrl || undefined,
      selected_addons: selectedAddons,
    };

    addItem(product, customizationData, selectedVariant, quantity);

    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#f43f5e", "#d946ef", "#f59e0b", "#3b82f6"],
      });
    } catch {
      // safe fallback
    }

    setIsAddedAnimation(true);
    setTimeout(() => setIsAddedAnimation(false), 2000);
  };

  const mockupTemplate = config.template_mockup_url || product.images[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* ---------------- LIVE PREVIEW CANVAS (LEFT) ---------------- */}
      <div className="lg:col-span-7 sticky top-24">
        <div className="relative rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 shadow-xl aspect-square flex items-center justify-center select-none group">
          
          {/* Base Product Mockup */}
          <img
            src={mockupTemplate}
            alt={product.title}
            className="w-full h-full object-cover pointer-events-none transition-transform duration-700 group-hover:scale-105"
          />

          {/* CUSTOM UPLOADED PHOTO OVERLAY */}
          {config.image_upload?.enabled && uploadedImageUrl && (
            <div
              className="absolute overflow-hidden shadow-md rounded-xl border border-white/40 transition-all duration-300 pointer-events-none"
              style={{
                left: `${config.image_upload.x ?? 50}%`,
                top: `${config.image_upload.y ?? 55}%`,
                width: `${config.image_upload.width ?? 40}%`,
                height: `${config.image_upload.height ?? 40}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <img
                src={uploadedImageUrl}
                alt="Custom uploaded artwork"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* CUSTOM TEXT OVERLAYS */}
          {config.text_fields?.map((field) => {
            const userText = texts[field.id] || field.placeholder || "";
            return (
              <div
                key={field.id}
                className="absolute text-center max-w-[85%] px-3 py-1 pointer-events-none transition-all duration-300 drop-shadow-md"
                style={{
                  left: `${field.x ?? 50}%`,
                  top: `${field.y ?? 45}%`,
                  transform: "translate(-50%, -50%)",
                  fontFamily: selectedFont,
                  color: selectedColor,
                  fontSize: `${(field.font_size ?? 22) * 1.1}px`,
                  fontWeight: 600,
                  textShadow:
                    selectedColor === "#FFFFFF"
                      ? "0 2px 8px rgba(0,0,0,0.6)"
                      : "0 1px 3px rgba(255,255,255,0.4)",
                }}
              >
                {userText}
              </div>
            );
          })}

          {/* Live Preview Indicator Badge */}
          <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-700/50 text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Live Interactive Preview</span>
          </div>

          {/* Reset Customization Button */}
          <button
            onClick={() => {
              setTexts({});
              setUploadedImageUrl(null);
              setSelectedAddons([]);
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-700/50 text-neutral-600 dark:text-neutral-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors shadow-sm"
            title="Reset Preview"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Thumbnail gallery */}
        {product.images.length > 1 && (
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <div
                key={idx}
                className="w-16 h-16 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 flex-shrink-0 cursor-pointer hover:border-rose-500 transition-colors"
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------------- CUSTOMIZATION STUDIO CONTROLS (RIGHT) ---------------- */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Product Title & Pricing Header */}
        <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-full">
            ✨ Fully Customizable
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white mt-2">
            {product.title}
          </h1>

          <div className="flex items-baseline gap-3 mt-3">
            <span className="text-3xl font-black text-rose-600 dark:text-rose-500">
              {formatCurrency(unitPrice)}
            </span>
            {product.compare_at_price && (
              <span className="text-lg text-neutral-400 line-through">
                {formatCurrency(product.compare_at_price)}
              </span>
            )}
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              In Stock & Ready
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Inclusive of all custom printing, laser crafting & taxes.
          </p>
        </div>

        {/* VARIANTS PICKER (If applicable) */}
        {product.variants && product.variants.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-900 dark:text-white flex items-center justify-between">
              <span>Choose Variant / Size</span>
              {selectedVariant && (
                <span className="text-xs font-medium text-rose-600">{selectedVariant.title}</span>
              )}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {product.variants.map((variant) => {
                const isSelected = selectedVariant?.id === variant.id;
                return (
                  <button
                    key={variant.id}
                    onClick={() => onVariantChange?.(variant)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                      isSelected
                        ? "border-rose-500 bg-rose-50/60 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20"
                        : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    <div>{variant.title}</div>
                    <div className="text-neutral-500 mt-0.5">{formatCurrency(variant.price)}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 1. CUSTOM TEXT INPUTS */}
        {config.text_fields && config.text_fields.length > 0 && (
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/80 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white">
              <Type className="w-4 h-4 text-rose-500" />
              <span>1. Enter Your Custom Text / Message</span>
            </div>

            {config.text_fields.map((field) => {
              const currentVal = texts[field.id] || "";
              const maxChars = field.max_chars || 30;
              return (
                <div key={field.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">
                      {field.label}
                    </span>
                    <span className="text-neutral-400">
                      {currentVal.length}/{maxChars}
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={maxChars}
                    placeholder={field.placeholder || "Type here to preview..."}
                    value={currentVal}
                    onChange={(e) =>
                      setTexts({ ...texts, [field.id]: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all shadow-sm"
                  />
                </div>
              );
            })}

            {/* FONT SELECTOR */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Choose Typography Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {fontList.map((font) => (
                  <button
                    key={font}
                    onClick={() => setSelectedFont(font)}
                    style={{ fontFamily: font }}
                    className={`py-2 px-3 rounded-xl border text-sm transition-all ${
                      selectedFont === font
                        ? "border-rose-500 bg-white dark:bg-neutral-900 text-rose-600 ring-2 ring-rose-500/20 font-bold"
                        : "border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-neutral-900/50 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300"
                    }`}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>

            {/* COLOR PALETTE */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                <Palette className="w-3.5 h-3.5 text-rose-500" />
                <span>Choose Text Color</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {colorList.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-7 h-7 rounded-full border border-neutral-300 dark:border-neutral-600 shadow-sm transition-transform ${
                      selectedColor === color
                        ? "scale-125 ring-2 ring-rose-500 ring-offset-2 dark:ring-offset-neutral-900"
                        : "hover:scale-110"
                    }`}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. CUSTOM IMAGE / PHOTO UPLOADER */}
        {config.image_upload?.enabled && (
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/80 space-y-3">
            <div className="flex items-center justify-between text-sm font-bold text-neutral-900 dark:text-white">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-rose-500" />
                <span>2. {config.image_upload.label || "Upload Memory Photo"}</span>
              </div>
              {config.image_upload.price_addon ? (
                <span className="text-xs text-rose-500 font-semibold">
                  +{formatCurrency(config.image_upload.price_addon)}
                </span>
              ) : (
                <span className="text-xs text-emerald-600 font-medium">Free Inclusion</span>
              )}
            </div>

            <p className="text-xs text-neutral-500">
              {config.image_upload.helper_text || "Upload high-res JPG/PNG to see it live on the product."}
            </p>

            <label className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 hover:border-rose-500 dark:hover:border-rose-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white/60 dark:bg-neutral-900/60">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
              {isUploading ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 animate-pulse py-2">
                  <Upload className="w-4 h-4 animate-bounce" />
                  <span>Processing high-res image...</span>
                </div>
              ) : uploadedImageUrl ? (
                <div className="flex items-center gap-3 py-1">
                  <img
                    src={uploadedImageUrl}
                    alt="Uploaded preview"
                    className="w-12 h-12 rounded-lg object-cover border border-neutral-200 dark:border-neutral-700"
                  />
                  <div className="text-left">
                    <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Photo Attached Successfully
                    </p>
                    <span className="text-[11px] text-neutral-400">Click to change photo</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2">
                  <Upload className="w-6 h-6 mx-auto mb-1.5 text-neutral-400 group-hover:text-rose-500" />
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Click to browse or drop photo here
                  </span>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Supports PNG, JPG up to 10MB</p>
                </div>
              )}
            </label>
          </div>
        )}

        {/* 3. PREMIUM ADDONS (Gift box, Chocolates, Cards) */}
        {config.addons && config.addons.length > 0 && (
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/80 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white">
              <Gift className="w-4 h-4 text-rose-500" />
              <span>3. Joyful Add-ons & Packaging</span>
            </div>

            <div className="space-y-2">
              {config.addons.map((addon) => {
                const isChecked = selectedAddons.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isChecked
                        ? "border-rose-500 bg-rose-50/60 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200"
                        : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-neutral-300 text-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                          isChecked
                            ? "bg-rose-600 border-rose-600 text-white"
                            : "border-neutral-400 bg-transparent"
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <span className="text-xs font-semibold">{addon.label}</span>
                    </div>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      +{formatCurrency(addon.price)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* QUANTITY & ADD TO CART CTA */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center gap-3">
            
            {/* Quantity Selector */}
            <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl font-bold transition-colors"
              >
                -
              </button>
              <span className="w-10 text-center font-bold text-sm text-neutral-900 dark:text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl font-bold transition-colors"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-lg ${
                isAddedAnimation
                  ? "bg-emerald-600 text-white shadow-emerald-500/30 scale-95"
                  : "bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-[1.01]"
              }`}
            >
              {isAddedAnimation ? (
                <>
                  <CheckCircle2 className="w-5 h-5 animate-bounce" />
                  <span>Added with Customization!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart • {formatCurrency(totalPrice)}</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-neutral-500 pt-1">
            <span className="flex items-center gap-1">✨ 100% Handcrafted</span>
            <span>•</span>
            <span className="flex items-center gap-1">🚚 3-5 Days Express Delivery</span>
            <span>•</span>
            <span className="flex items-center gap-1">🔒 Safe Payment</span>
          </div>
        </div>

      </div>

    </div>
  );
}
