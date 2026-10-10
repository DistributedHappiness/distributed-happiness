"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Headphones,
  ArrowLeft,
  ExternalLink,
  Gift,
  CreditCard,
  AlertCircle,
  Printer,
} from "lucide-react";

// Map DB status to a step index (0-based)
const STATUS_STEP: Record<string, number> = {
  pending: 0,
  proof_review: 1,
  in_production: 2,
  shipped: 3,
  delivered: 4,
  cancelled: -1,
};

const TIMELINE_STEPS = [
  {
    label: "Order Received",
    desc: "Customisation specs logged & verified",
    icon: Package,
  },
  {
    label: "Proof Under Review",
    desc: "Design artwork sent for your approval",
    icon: Sparkles,
  },
  {
    label: "In Production",
    desc: "Laser engraving / thermal printing",
    icon: Gift,
  },
  {
    label: "Dispatched",
    desc: "Shipped with courier",
    icon: Truck,
  },
  {
    label: "Delivered",
    desc: "Arrived at your doorstep",
    icon: CheckCircle2,
  },
];

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending:       { label: "Order Received",   color: "text-amber-600 dark:text-amber-400",  bg: "bg-amber-50 dark:bg-amber-950/40",  border: "border-amber-200 dark:border-amber-800" },
  proof_review:  { label: "Proof Review",     color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/40", border: "border-indigo-200 dark:border-indigo-800" },
  in_production: { label: "In Production",   color: "text-rose-600 dark:text-rose-400",    bg: "bg-rose-50 dark:bg-rose-950/40",    border: "border-rose-200 dark:border-rose-800" },
  shipped:       { label: "Shipped",          color: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-950/40",    border: "border-blue-200 dark:border-blue-800" },
  delivered:     { label: "Delivered ✓",     color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-200 dark:border-emerald-800" },
  cancelled:     { label: "Cancelled",        color: "text-neutral-500",                    bg: "bg-neutral-50 dark:bg-neutral-800/40", border: "border-neutral-200 dark:border-neutral-700" },
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      setIsLoading(true);

      // 1. Try Supabase first
      if (isSupabaseConfigured()) {
        try {
          const { data } = await supabase
            .from("orders")
            .select("*, order_items(*)")
            .or(`order_number.eq.${orderId},id.eq.${orderId}`)
            .single();

          if (data) {
            setOrder({ ...data, items: data.order_items });
            setIsLoading(false);
            return;
          }
        } catch (_) {}
      }

      // 2. Fall back to localStorage
      try {
        const saved = localStorage.getItem("dh_user_orders");
        if (saved) {
          const orders = JSON.parse(saved);
          const match = orders.find(
            (o: any) => o.order_number === orderId || o.id === orderId
          );
          if (match) {
            setOrder(match);
            setIsLoading(false);
            return;
          }
        }
      } catch (_) {}

      // 3. Not found
      setNotFound(true);
      setIsLoading(false);
    }
    loadOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-700 rounded" />
        <div className="h-10 w-64 bg-neutral-200 dark:bg-neutral-700 rounded" />
        <div className="h-40 w-full bg-neutral-200 dark:bg-neutral-700 rounded-3xl" />
        <div className="h-64 w-full bg-neutral-200 dark:bg-neutral-700 rounded-3xl" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 mx-auto text-rose-400" />
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Order Not Found</h2>
        <p className="text-sm text-neutral-500">
          We couldn&apos;t find order <strong>{orderId}</strong>. Please check the order number and try again.
        </p>
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
      </div>
    );
  }

  const currentStep = STATUS_STEP[order.status] ?? 0;
  const isCancelled = order.status === "cancelled";
  const statusCfg = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
  const discount = Number(order.discount || 0);

  const handlePrintReceipt = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      window.print();
      return;
    }
    const itemsRows = (order.items || [])
      .map(
        (it: any) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>${it.product_title || "Custom Keepsake"}</strong>
            ${it.variant_title ? `<br><small style="color:#666;">Variant: ${it.variant_title}</small>` : ""}
            ${it.customization_data?.custom_texts?.length ? `<br><small style="color:#888;">Custom: ${it.customization_data.custom_texts.join(" / ")}</small>` : ""}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${it.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${Number(it.unit_price).toLocaleString("en-IN")}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">₹${(Number(it.unit_price) * it.quantity).toLocaleString("en-IN")}</td>
        </tr>
      `
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${order.order_number}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #111; max-width: 800px; margin: auto; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #FF5733; padding-bottom: 20px; }
            .brand { font-size: 24px; font-weight: 900; color: #FF5733; }
            .subtitle { font-size: 12px; color: #666; margin-top: 4px; }
            .meta { text-align: right; font-size: 13px; color: #444; }
            .grid { display: flex; justify-content: space-between; margin: 24px 0; }
            .col { font-size: 13px; line-height: 1.5; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
            th { background: #f8f8f8; text-align: left; padding: 10px; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #ddd; }
            .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
            .grand-total { border-top: 2px solid #222; margin-top: 10px; padding-top: 10px; font-size: 18px; font-weight: 900; color: #FF5733; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">🎁 Distribute Happiness</div>
              <div class="subtitle">Personalized Gifts & Custom Keepsakes</div>
            </div>
            <div class="meta">
              <h2 style="margin: 0; font-size: 18px;">Customer Receipt</h2>
              <div>Order: <strong>${order.order_number}</strong></div>
              <div>Date: ${new Date(order.created_at).toLocaleDateString("en-IN")}</div>
            </div>
          </div>
          <div class="grid">
            <div class="col">
              <strong>Delivered To:</strong><br>
              ${order.shipping_address?.full_name || order.customer_name || "Customer"}<br>
              ${order.shipping_address?.street_address || ""}<br>
              ${order.shipping_address?.city || ""}, ${order.shipping_address?.state || ""} - ${order.shipping_address?.postal_code || ""}<br>
              Phone: ${order.customer_phone || order.shipping_address?.phone || "N/A"}
            </div>
            <div class="col" style="text-align: right;">
              <strong>Payment Status:</strong> ${(order.payment_status || "PAID").toUpperCase()}<br>
              <strong>Payment Method:</strong> ${(order.payment_method || "Online").toUpperCase()}<br>
              <strong>Order Status:</strong> ${(order.status || "Pending").toUpperCase()}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsRows}</tbody>
          </table>
          <div style="margin-left: auto; width: 280px; margin-top: 20px;">
            <div class="total-row"><span>Subtotal:</span><span>₹${Number(order.subtotal || 0).toLocaleString("en-IN")}</span></div>
            ${order.discount ? `<div class="total-row" style="color: #10B981;"><span>Discount:</span><span>-₹${Number(order.discount).toLocaleString("en-IN")}</span></div>` : ""}
            <div class="total-row"><span>Shipping:</span><span>${order.shipping_fee ? `₹${order.shipping_fee}` : "FREE"}</span></div>
            <div class="total-row grand-total"><span>Total Paid:</span><span>₹${Number(order.total || 0).toLocaleString("en-IN")}</span></div>
          </div>
          <div style="text-align: center; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #777;">
            Thank you for choosing Distribute Happiness! For questions, WhatsApp us anytime.
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Back + Header */}
      <div className="space-y-4">
        <Link
          href="/orders"
          className="text-xs font-bold text-neutral-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors w-max"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Orders
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
              Placed on {formatDate(order.created_at)} · Payment:{" "}
              <b className={`uppercase ${order.payment_status === "paid" ? "text-emerald-600" : "text-amber-600"}`}>
                {order.payment_status}
              </b>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrintReceipt}
              className="px-3.5 py-2 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-750 text-neutral-700 dark:text-neutral-200 font-bold text-xs flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4 text-rose-500" />
              <span>Print Receipt</span>
            </button>
            <span className={`px-4 py-2 rounded-2xl ${statusCfg.bg} border ${statusCfg.border} ${statusCfg.color} font-bold text-xs flex items-center gap-2 w-max`}>
              <Clock className="w-4 h-4" />
              {statusCfg.label}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {!isCancelled && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-rose-500" />
            Live Production Timeline
          </h3>

          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-neutral-200 dark:bg-neutral-700 hidden sm:block" />

            <div className="space-y-4">
              {TIMELINE_STEPS.map((step, idx) => {
                const done = idx <= currentStep;
                const isActive = idx === currentStep;
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex items-start gap-4 relative">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                        done
                          ? isActive
                            ? "bg-rose-500 shadow-md shadow-rose-500/30 text-white ring-4 ring-rose-100 dark:ring-rose-900/40"
                            : "bg-emerald-500 text-white"
                          : "bg-neutral-200 dark:bg-neutral-700 text-neutral-400"
                      }`}
                    >
                      {done && !isActive ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Icon className={`w-4 h-4 ${isActive ? "animate-pulse" : ""}`} />
                      )}
                    </div>
                    <div className="pt-1">
                      <h4 className={`text-sm font-bold ${done ? "text-neutral-900 dark:text-white" : "text-neutral-400"}`}>
                        {step.label}
                        {isActive && (
                          <span className="ml-2 text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Current
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{step.desc}</p>
                      {/* Show tracking info on Shipped step */}
                      {idx === 3 && done && order.tracking_number && (
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400">
                            {order.shipping_carrier || "Courier"}: {order.tracking_number}
                          </span>
                          <ExternalLink className="w-3 h-3 text-blue-400" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Cancelled banner */}
      {isCancelled && (
        <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 flex items-center gap-4">
          <AlertCircle className="w-8 h-8 text-neutral-400 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white">Order Cancelled</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              This order was cancelled. If you believe this is a mistake, please contact support.
            </p>
          </div>
        </div>
      )}

      {/* Items + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Items */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-500" />
              Customised Items
            </h3>

            <div className="space-y-4 divide-y divide-neutral-100 dark:divide-neutral-700/60">
              {(order.items || []).map((item: any, idx: number) => (
                <div key={item.id || idx} className="pt-4 first:pt-0 flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-700 flex-shrink-0 border border-neutral-200 dark:border-neutral-600 relative">
                    {item.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        <Package className="w-8 h-8" />
                      </div>
                    )}
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-rose-500 text-[9px] font-bold text-white">
                      Custom
                    </span>
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white leading-snug">
                      {item.product_title}
                    </h4>
                    {item.variant_title && (
                      <p className="text-[11px] text-neutral-400">{item.variant_title}</p>
                    )}

                    {/* Customization specs */}
                    {item.customization_data && Object.keys(item.customization_data).length > 0 && (
                      <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 space-y-1 text-xs">
                        <span className="font-bold text-neutral-600 dark:text-neutral-300 block text-[10px] uppercase tracking-wide">
                          Customisation Specs
                        </span>
                        {item.customization_data.custom_texts &&
                          Object.entries(item.customization_data.custom_texts).map(([k, v]: any) => (
                            <div key={k} className="text-rose-600 dark:text-rose-400">
                              • {k}: &quot;{v}&quot;
                            </div>
                          ))}
                        {item.customization_data.font && (
                          <div className="text-neutral-500">• Font: {item.customization_data.font}</div>
                        )}
                        {item.customization_data.color && (
                          <div className="flex items-center gap-1.5 text-neutral-500">
                            • Colour:{" "}
                            <span
                              className="inline-block w-3 h-3 rounded-full border border-neutral-300"
                              style={{ background: item.customization_data.color }}
                            />
                            {item.customization_data.color}
                          </div>
                        )}
                        {item.customization_data.uploaded_image_url && (
                          <div className="text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> High-res photo attached for print
                          </div>
                        )}
                        {item.customization_data.addons?.length > 0 && (
                          <div className="text-neutral-500">
                            • Add-ons: {item.customization_data.addons.join(", ")}
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
                <span className="font-bold block mb-1">🎁 Gift Card Note:</span>
                <p className="italic">&quot;{order.gift_message}&quot;</p>
              </div>
            )}
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="p-5 rounded-3xl bg-white dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 shadow-sm">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-rose-500" />
                Delivery Address
              </h3>
              <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-0.5">
                <p className="font-bold text-neutral-900 dark:text-white">{order.shipping_address.full_name}</p>
                <p>{order.shipping_address.street_address}</p>
                {order.shipping_address.apartment && <p>{order.shipping_address.apartment}</p>}
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state} — {order.shipping_address.postal_code}
                </p>
                <p>{order.shipping_address.country}</p>
                <p className="text-neutral-400 pt-1">📞 {order.shipping_address.phone || order.customer_phone}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Payment + Support */}
        <div className="lg:col-span-4 space-y-5">
          {/* Payment Breakdown */}
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-rose-500" />
              Payment Summary
            </h3>

            <div className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Coupon {order.coupon_code ? `(${order.coupon_code})` : "Discount"}</span>
                  <span className="font-bold">−{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shipping_fee === 0 ? "FREE" : formatCurrency(order.shipping_fee)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-neutral-900 dark:text-white pt-2 border-t border-neutral-100 dark:border-neutral-700/60">
                <span>Total Paid</span>
                <span className="text-rose-600 dark:text-rose-400">{formatCurrency(order.total)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-700/60 text-xs text-neutral-500 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">Method:</span>
                <span className="uppercase font-mono">{order.payment_method}</span>
              </div>
            </div>
          </div>

          {/* Support Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-50 to-amber-50 dark:from-rose-950/30 dark:to-amber-950/20 border border-rose-200/60 dark:border-rose-800/40 text-center space-y-3">
            <Headphones className="w-6 h-6 mx-auto text-rose-500" />
            <div>
              <h5 className="text-sm font-bold text-neutral-900 dark:text-white">Need help?</h5>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Our artisans are available 24/7 on WhatsApp.
              </p>
            </div>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}?text=${encodeURIComponent(`Hi! I need help with order #${order.order_number}`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
