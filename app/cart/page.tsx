"use client";

import React, { useState } from "react";
import Link from "next/link";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/utils";
import { MOCK_COUPONS } from "@/lib/mock-data";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Truck,
  ShieldCheck,
} from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, totalItems } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  const freeDeliveryThreshold = 999;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");

    const coupon = MOCK_COUPONS.find(
      (c) => c.code.toLowerCase() === couponCode.trim().toLowerCase()
    );

    if (!coupon) {
      setCouponError("Invalid coupon code. Try HAPPINESS10");
      return;
    }

    if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
      setCouponError(`Min order amount for ${coupon.code} is ₹${coupon.min_order_amount}`);
      return;
    }

    let discountValue = 0;
    if (coupon.discount_type === "percentage") {
      discountValue = (subtotal * coupon.discount_value) / 100;
      if (coupon.max_discount_amount && discountValue > coupon.max_discount_amount) {
        discountValue = coupon.max_discount_amount;
      }
    } else {
      discountValue = coupon.discount_value;
    }

    setAppliedDiscount({ code: coupon.code, amount: discountValue });
  };

  const discountAmount = appliedDiscount?.amount || 0;
  const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 49;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full">
      {items.length === 0 ? (
        <div className="max-w-md mx-auto py-16 text-center space-y-4 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-stone-900 dark:text-white">Your Gifting Cart is Empty</h1>
          <p className="text-xs text-stone-500">
            Personalize mugs, Spotify plaques, couple hoodies, and LED signs with live instant preview.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="px-6 py-3 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Browse Best Sellers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
              🛍️ Your Gifting Bag
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-1">
              Shopping Cart ({totalItems} items)
            </h1>
          </div>

          {/* Free Delivery Meter (GiftKyaDe Signature) */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-950 dark:text-amber-200 space-y-2">
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                {remainingForFreeDelivery === 0
                  ? "🎉 Yay! You have unlocked FREE Delivery across India!"
                  : `Add ₹${remainingForFreeDelivery} more to unlock FREE Delivery!`}
              </span>
              <span>{freeDeliveryProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-amber-200/60 dark:bg-amber-900/60 overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Cart Items List (Left) */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => {
                const primaryImage = item.customization.uploaded_image_url || item.product.images[0];
                return (
                  <div
                    key={item.id}
                    className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 flex-shrink-0 border border-stone-200 dark:border-stone-700 relative">
                        <img
                          src={primaryImage}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                        {item.customization.uploaded_image_url && (
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-white">
                            Custom
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white leading-snug">
                          {item.product.title}
                        </h3>

                        {item.variant && (
                          <p className="text-[11px] font-semibold text-stone-500">
                            Option: {item.variant.title}
                          </p>
                        )}

                        {/* Customization values */}
                        {Object.keys(item.customization.texts || {}).length > 0 && (
                          <div className="text-[11px] text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg w-max font-medium">
                            {Object.entries(item.customization.texts).map(([k, v]) => (
                              <span key={k}>&quot;{v}&quot; </span>
                            ))}
                          </div>
                        )}

                        <div className="text-xs sm:text-sm font-black text-stone-900 dark:text-white pt-1">
                          {formatCurrency(item.unit_price)}
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Delete */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-stone-800">
                      <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-full px-2 py-1 bg-stone-50 dark:bg-stone-800">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:text-rose-600 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 font-bold text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-emerald-600 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Box (Right) */}
            <div className="lg:col-span-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-6 shadow-sm space-y-6">
              <h3 className="font-black text-base text-stone-900 dark:text-white pb-3 border-b border-stone-100 dark:border-stone-800">
                Order Summary
              </h3>

              {/* Coupon Box */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon (e.g. HAPPINESS10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs uppercase font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>}
                {appliedDiscount && (
                  <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Coupon {appliedDiscount.code} applied (-{formatCurrency(appliedDiscount.amount)})
                  </p>
                )}
              </form>

              {/* Pricing Breakdown */}
              <div className="space-y-2.5 text-xs text-stone-600 dark:text-stone-300 pt-2 border-t border-stone-100 dark:border-stone-800">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-bold text-stone-900 dark:text-white">{formatCurrency(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping Charges</span>
                  <span className="font-bold text-stone-900 dark:text-white">
                    {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatCurrency(shippingFee)}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-black text-stone-900 dark:text-white pt-3 border-t border-stone-100 dark:border-stone-800">
                  <span>Total Amount</span>
                  <span className="text-base text-emerald-800 dark:text-emerald-400">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 text-center"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-stone-400 text-[11px] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Encrypted & Safe Gifting Checkout</span>
              </div>
            </div>

          </div>
        </>
      )}

      <WhatsAppButton />
    </div>
  );
}
