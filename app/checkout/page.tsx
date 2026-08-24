"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { formatCurrency } from "@/lib/utils";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import confetti from "canvas-confetti";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Gift,
  Lock,
  ArrowRight,
  QrCode,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  // Form State
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [giftNote, setGiftNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "online" | "cod">("upi");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const shippingFee = subtotal >= 999 ? 0 : 49;
  const finalTotal = subtotal + shippingFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName || !email || !phone || !streetAddress || !city || !state || !postalCode) {
      setErrorMsg("Please fill in all required shipping address fields.");
      return;
    }

    if (items.length === 0) {
      setErrorMsg("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);

    const generatedOrderNumber = `DH-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    try {
      if (isSupabaseConfigured()) {
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .insert({
            order_number: generatedOrderNumber,
            user_id: user?.id || null,
            customer_name: fullName,
            customer_email: email,
            customer_phone: phone,
            shipping_address: {
              full_name: fullName,
              phone,
              street_address: streetAddress,
              city,
              state,
              postal_code: postalCode,
              country: "India",
            },
            status: "pending",
            payment_status: paymentMethod === "cod" ? "unpaid" : "paid",
            payment_method: paymentMethod,
            subtotal,
            shipping_fee: shippingFee,
            total: finalTotal,
            gift_message: giftNote,
          })
          .select()
          .single();

        if (orderError) throw orderError;

        if (orderData) {
          const orderItemsPayload = items.map((item) => ({
            order_id: orderData.id,
            product_id: item.product.id.length > 20 ? item.product.id : null,
            product_title: item.product.title,
            variant_title: item.variant?.title || null,
            unit_price: item.unit_price,
            quantity: item.quantity,
            total_price: item.unit_price * item.quantity,
            customization_details: item.customization,
            preview_image_url: item.customization.uploaded_image_url || item.product.images[0],
          }));

          await supabase.from("order_items").insert(orderItemsPayload);
        }
      }

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {}

      clearCart();
      router.push(`/orders/${generatedOrderNumber}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
          🔒 Express Gifting Checkout
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-1">
          Shipping & Payment Details
        </h1>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Shipping Form (Left) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Recipient Details */}
          <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-700" />
              <span>1. Recipient & Delivery Address (India)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-600 dark:text-stone-300">Recipient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-600 dark:text-stone-300">WhatsApp / Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-bold text-stone-600 dark:text-stone-300">Email Address (For Tracking & Invoice) *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. priya@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-bold text-stone-600 dark:text-stone-300">Flat / House No., Street, Landmark *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 402, Sunshine Heights, MG Road"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-600 dark:text-stone-300">City / District *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 dark:text-stone-300">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maharashtra"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 dark:text-stone-300">PIN Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 400001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* 2. Free Gift Greeting Card Note */}
          <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
              <Gift className="w-4 h-4 text-rose-600" />
              <span>2. Free Printed Gift Greeting Card Note (Optional)</span>
            </h3>
            <textarea
              rows={2}
              placeholder="Write a sweet heartfelt message to be printed on a luxury golden greeting card inside the parcel..."
              value={giftNote}
              onChange={(e) => setGiftNote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* 3. Payment Method */}
          <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-600" />
              <span>3. Select Payment Option</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                onClick={() => setPaymentMethod("upi")}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center cursor-pointer transition-all ${
                  paymentMethod === "upi"
                    ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200"
                    : "border-stone-200 dark:border-stone-700 hover:border-stone-300"
                }`}
              >
                <QrCode className="w-6 h-6 text-emerald-700 mb-2" />
                <span className="font-bold text-xs">UPI / QR Code</span>
                <span className="text-[10px] text-stone-400 mt-0.5">GPay, PhonePe, Paytm</span>
              </label>

              <label
                onClick={() => setPaymentMethod("online")}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center cursor-pointer transition-all ${
                  paymentMethod === "online"
                    ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200"
                    : "border-stone-200 dark:border-stone-700 hover:border-stone-300"
                }`}
              >
                <CreditCard className="w-6 h-6 text-emerald-700 mb-2" />
                <span className="font-bold text-xs">Cards / NetBanking</span>
                <span className="text-[10px] text-stone-400 mt-0.5">Visa, Master, RuPay</span>
              </label>

              <label
                onClick={() => setPaymentMethod("cod")}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200"
                    : "border-stone-200 dark:border-stone-700 hover:border-stone-300"
                }`}
              >
                <Banknote className="w-6 h-6 text-emerald-700 mb-2" />
                <span className="font-bold text-xs">Cash on Delivery</span>
                <span className="text-[10px] text-stone-400 mt-0.5">Pay upon parcel arrival</span>
              </label>
            </div>
          </div>

        </div>

        {/* Order Summary (Right) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-6 shadow-sm space-y-4">
            <h3 className="font-black text-base text-stone-900 dark:text-white pb-3 border-b border-stone-100 dark:border-stone-800">
              Order Review ({items.length} gifts)
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={it.customization.uploaded_image_url || it.product.images[0]}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-stone-900 dark:text-white truncate">{it.product.title}</h4>
                    <p className="text-[11px] text-stone-400">Qty: {it.quantity}</p>
                  </div>
                  <div className="font-bold text-stone-900 dark:text-white">
                    {formatCurrency(it.unit_price * it.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs pt-3 border-t border-stone-100 dark:border-stone-800">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900 dark:text-white">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Delivery Fee</span>
                <span className="font-bold text-stone-900 dark:text-white">
                  {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatCurrency(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-stone-900 dark:text-white pt-2 border-t border-stone-100 dark:border-stone-800">
                <span>Total Payable</span>
                <span className="text-base text-emerald-800 dark:text-emerald-400">{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Processing Handcrafted Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Order · {formatCurrency(finalTotal)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Handcrafted with Care · 100% Satisfaction Guarantee</span>
            </div>

          </div>
        </div>

      </form>

      <WhatsAppButton />
    </div>
  );
}
