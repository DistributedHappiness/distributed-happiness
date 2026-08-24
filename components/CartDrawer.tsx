"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/utils";
import { X, Trash2, Plus, Minus, ArrowRight, Sparkles, ShoppingBag } from "lucide-react";

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, subtotal, totalItems } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-neutral-900 shadow-2xl flex flex-col border-l border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Your Joyful Cart</h2>
                <p className="text-xs text-neutral-500">{totalItems} {totalItems === 1 ? "item" : "items"} ready to ship</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-500">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">Your cart is empty</h3>
                <p className="text-sm text-neutral-500 mb-6">Discover personalized gifts that bring smiles to your loved ones.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm transition-all shadow-md shadow-rose-500/20"
                >
                  Explore Best Gifts
                </button>
              </div>
            ) : (
              items.map((item) => {
                const primaryImage = item.customization.uploaded_image_url || item.product.images[0];
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 flex gap-3.5"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 relative border border-neutral-200/60 dark:border-neutral-700/60">
                      <img
                        src={primaryImage}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                      {item.customization.uploaded_image_url && (
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-rose-500 text-[9px] font-bold text-white uppercase tracking-wider">
                          Custom
                        </span>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                            {item.product.title}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-neutral-400 hover:text-rose-500 p-1 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {item.variant && (
                          <p className="text-xs text-neutral-500 mt-0.5">
                            Variant: {item.variant.title}
                          </p>
                        )}

                        {/* Customization Summary */}
                        {item.customization && (
                          <div className="mt-1.5 space-y-0.5">
                            {Object.entries(item.customization.texts || {}).map(([key, val]) => (
                              <p key={key} className="text-xs text-rose-600 dark:text-rose-400 font-medium truncate">
                                ✏️ &quot;{val}&quot; ({item.customization.selected_font})
                              </p>
                            ))}
                            {item.customization.selected_addons?.length > 0 && (
                              <p className="text-[11px] text-neutral-400 truncate">
                                + {item.customization.selected_addons.length} Add-on(s)
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-200/40 dark:border-neutral-700/40">
                        <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-white dark:bg-neutral-900">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-neutral-900 dark:text-white">
                          {formatCurrency(item.total_price)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span className="text-base font-bold text-neutral-900 dark:text-white">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Taxes & shipping calculated at checkout. Custom items handcrafted upon order.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-center text-sm transition-colors"
                >
                  View Full Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold text-center text-sm transition-all shadow-md shadow-rose-500/25 flex items-center justify-center gap-1.5"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
