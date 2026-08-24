"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Package, Truck, CheckCircle2, Clock, ArrowRight, Search, Sparkles } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [trackNumberInput, setTrackNumberInput] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dh_user_orders");
      if (saved) {
        setOrders(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-full">
          📦 Order Tracking & History
        </span>
        <h1 className="text-3xl font-black text-neutral-900 dark:text-white mt-2">
          Your Customized Orders
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Track production proofs, laser crafting progress, and doorstep courier status in real-time.
        </p>
      </div>

      {/* Quick Search Order Number */}
      <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-700/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (trackNumberInput.trim()) {
              window.location.href = `/orders/${trackNumberInput.trim()}`;
            }
          }}
          className="flex flex-col sm:flex-row gap-3 items-center"
        >
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Enter Order Number (e.g. DH-123456-789)"
              value={trackNumberInput}
              onChange={(e) => setTrackNumberInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-neutral-900 dark:bg-neutral-700 hover:bg-rose-600 dark:hover:bg-rose-600 text-white font-bold text-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Track Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-neutral-800/40 rounded-3xl border border-neutral-200/80 dark:border-neutral-700/80 p-8 space-y-4">
            <Package className="w-12 h-12 mx-auto text-rose-400" />
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              No recent orders found
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              You haven&apos;t placed any custom orders yet. Browse our personalized catalog to create memorable gifts.
            </p>
            <div>
              <Link
                href="/products"
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-1.5"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.order_number || order.id}
              className="p-6 rounded-3xl bg-white dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 shadow-sm space-y-4 hover:border-rose-500/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-700/60 pb-3">
                <div>
                  <span className="text-xs font-bold text-neutral-400">Order ID</span>
                  <h4 className="text-base font-black text-neutral-900 dark:text-white">
                    {order.order_number}
                  </h4>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-400">
                    {formatDate(order.created_at || new Date().toISOString())}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 uppercase">
                    {order.status || "In Production"}
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="space-y-2">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image_url || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop"}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover border border-neutral-200 dark:border-neutral-700"
                      />
                      <div>
                        <p className="font-bold text-neutral-900 dark:text-white">
                          {item.product_title}
                        </p>
                        <p className="text-neutral-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-neutral-900 dark:text-white">
                      {formatCurrency(item.total_price || item.unit_price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total & Action */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-700/60">
                <div className="text-xs text-neutral-500">
                  Total Paid: <b className="text-sm font-black text-neutral-900 dark:text-white">{formatCurrency(order.total)}</b>
                </div>

                <Link
                  href={`/orders/${order.order_number || order.id}`}
                  className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-700 hover:bg-rose-50 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white hover:text-rose-600 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <span>View Timeline & Proof</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
