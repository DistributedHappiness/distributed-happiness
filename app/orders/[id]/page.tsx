"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  FileText,
  ArrowLeft,
  Headphones,
} from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dh_user_orders");
      if (saved) {
        const orders = JSON.parse(saved);
        const match = orders.find(
          (o: any) => o.order_number === orderId || o.id === orderId
        );
        if (match) {
          setOrder(match);
          return;
        }
      }

      // Default mock fallback for direct navigation
      setOrder({
        order_number: orderId || "DH-98214-412",
        customer_name: "Priya Sharma",
        customer_email: "priya@example.com",
        customer_phone: "+91 98765 43210",
        status: "in_production",
        payment_status: "paid",
        payment_method: "Online UPI",
        subtotal: 799,
        shipping_fee: 0,
        total: 799,
        gift_message: "Happy Anniversary to the most wonderful parents! ❤️",
        created_at: new Date().toISOString(),
        items: [
          {
            product_title: "Custom Spotify Acrylic Song Plaque with LED Wooden Base",
            unit_price: 799,
            quantity: 1,
            total_price: 799,
            image_url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop",
            customization_data: {
              custom_texts: {
                song_title: "Perfect",
                artist_name: "Ed Sheeran",
              },
              font: "Playfair Display",
              color: "#FFFFFF",
            },
          },
        ],
      });
    } catch (e) {
      console.error(e);
    }
  }, [orderId]);

  if (!order) {
    return <div className="p-12 text-center text-sm text-neutral-500">Loading order timeline...</div>;
  }

  const steps = [
    { label: "Order Received", done: true, desc: "Custom specs logged & verified" },
    { label: "Design Proof Approved", done: true, desc: "Artwork rasterized at 1200 DPI" },
    { label: "Handcrafted in Studio", done: true, desc: "Laser engraving / Thermal printing" },
    { label: "Dispatched with Carrier", done: false, desc: "BlueDart Express Courier" },
    { label: "Delivered to Doorstep", done: false, desc: "Estimated in 2-3 business days" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Back & Header */}
      <div className="space-y-4">
        <Link
          href="/orders"
          className="text-xs font-bold text-neutral-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-full">
              ✨ Live Production Status
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white mt-2">
              Order #{order.order_number}
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Placed on {formatDate(order.created_at)} • Payment: <b className="uppercase text-emerald-600">{order.payment_status}</b>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Status: In Artisan Production</span>
            </span>
          </div>
        </div>
      </div>

      {/* ---------------- PRODUCTION & DELIVERY TIMELINE ---------------- */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Truck className="w-5 h-5 text-rose-500" />
          <span>Live Tracking Progress</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="flex sm:flex-col items-start gap-3 sm:gap-2 relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors flex-shrink-0 ${
                  step.done
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                    : "bg-neutral-200 dark:bg-neutral-700 text-neutral-400"
                }`}
              >
                {step.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>

              <div>
                <h4
                  className={`text-xs font-bold ${
                    step.done
                      ? "text-neutral-900 dark:text-white"
                      : "text-neutral-400"
                  }`}
                >
                  {step.label}
                </h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- CUSTOMIZED ITEMS & PROOFS ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Items List (Left) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-500" />
              <span>Customized Items & Production Proofs</span>
            </h3>

            <div className="space-y-4 divide-y divide-neutral-100 dark:divide-neutral-700/60">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="pt-4 first:pt-0 flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-700 relative flex-shrink-0 border border-neutral-200 dark:border-neutral-700">
                    <img
                      src={item.image_url || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop"}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-rose-500 text-[9px] font-bold text-white uppercase">
                      Customized
                    </span>
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                      {item.product_title}
                    </h4>

                    {/* Custom specifications breakdown */}
                    {item.customization_data && (
                      <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 space-y-1 text-xs">
                        <span className="font-bold text-neutral-700 dark:text-neutral-300 block">
                          Verified Customization Specs:
                        </span>
                        {item.customization_data.custom_texts &&
                          Object.entries(item.customization_data.custom_texts).map(([k, v]: any) => (
                            <div key={k} className="text-rose-600 dark:text-rose-400 font-medium">
                              • Text ({k}): &quot;{v}&quot;
                            </div>
                          ))}
                        {item.customization_data.font && (
                          <div className="text-neutral-500">
                            • Typography: {item.customization_data.font}
                          </div>
                        )}
                        {item.customization_data.uploaded_image_url && (
                          <div className="text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> High-res photo attached for print
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-neutral-500">Qty: {item.quantity}</span>
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {formatCurrency(item.total_price || item.unit_price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {order.gift_message && (
              <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/60 text-xs text-rose-900 dark:text-rose-200">
                <span className="font-bold block mb-1">🎁 Handwritten Greeting Card Note:</span>
                <p className="italic">&quot;{order.gift_message}&quot;</p>
              </div>
            )}
          </div>
        </div>

        {/* Invoice & Support (Right) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              Payment Breakdown
            </h3>

            <div className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shipping_fee === 0 ? "FREE" : formatCurrency(order.shipping_fee)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-neutral-900 dark:text-white pt-2 border-t border-neutral-100 dark:border-neutral-700/60">
                <span>Total Paid</span>
                <span className="text-rose-600 dark:text-rose-500">{formatCurrency(order.total)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-700/60">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>Recipient: {order.customer_name}</span>
              </div>
              <p className="text-[11px] text-neutral-400 pl-6 mt-0.5">
                Contact: {order.customer_phone}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 text-center space-y-2">
              <Headphones className="w-5 h-5 mx-auto text-rose-500" />
              <h5 className="text-xs font-bold text-neutral-900 dark:text-white">
                Need Help with Your Custom Order?
              </h5>
              <p className="text-[11px] text-neutral-400">
                Our design artisans are available on WhatsApp 24/7.
              </p>
              <a
                href="mailto:support@distributehappiness.com"
                className="inline-block px-4 py-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-rose-600 hover:bg-neutral-50"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
