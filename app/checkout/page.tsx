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
  Tag,
  CheckCircle2,
  X,
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

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [isCouponLoading, setIsCouponLoading] = useState(false);

  const shippingFee = subtotal >= 999 ? 0 : 49;

  // Coupon discount calculation
  const couponDiscount = appliedCoupon
    ? appliedCoupon.discount_type === "percentage"
      ? Math.min(
          (subtotal * appliedCoupon.discount_value) / 100,
          appliedCoupon.max_discount_amount || Infinity
        )
      : appliedCoupon.discount_value
    : 0;

  const finalTotal = Math.max(0, subtotal - couponDiscount + shippingFee);

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponError("");
    setAppliedCoupon(null);
    setIsCouponLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from("coupons")
          .select("*")
          .eq("code", code)
          .eq("is_active", true)
          .single();
        if (error || !data) {
          setCouponError("Invalid or expired coupon code.");
        } else if (data.expires_at && new Date(data.expires_at) < new Date()) {
          setCouponError("This coupon has expired.");
        } else if (data.min_order_amount && subtotal < data.min_order_amount) {
          setCouponError(`Minimum order of ${formatCurrency(data.min_order_amount)} required.`);
        } else if (data.usage_limit && data.times_used >= data.usage_limit) {
          setCouponError("This coupon has reached its usage limit.");
        } else {
          setAppliedCoupon(data);
        }
      } else {
        // Demo mode — accept any code as 10% off
        setAppliedCoupon({ code, discount_type: "percentage", discount_value: 10 });
      }
    } catch (err) {
      setCouponError("Could not validate coupon. Try again.");
    } finally {
      setIsCouponLoading(false);
    }
  };

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

    // Build the order object we'll save everywhere
    const newOrder = {
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
      discount: couponDiscount,
      shipping_fee: shippingFee,
      total: finalTotal,
      coupon_code: appliedCoupon?.code || null,
      gift_message: giftNote,
      created_at: new Date().toISOString(),
      items: items.map((item) => ({
        product_title: item.product.title,
        variant_title: item.variant?.title || null,
        unit_price: item.unit_price,
        quantity: item.quantity,
        total_price: item.unit_price * item.quantity,
        image_url: item.customization.uploaded_image_url || item.product.images[0],
        customization_data: {
          custom_texts: item.customization.texts,
          font: item.customization.selected_font,
          color: item.customization.selected_color,
          uploaded_image_url: item.customization.uploaded_image_url,
          addons: item.customization.selected_addons,
        },
      })),
    };

    try {
      if (isSupabaseConfigured()) {
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .insert({
            order_number: newOrder.order_number,
            user_id: newOrder.user_id,
            customer_name: newOrder.customer_name,
            customer_email: newOrder.customer_email,
            customer_phone: newOrder.customer_phone,
            shipping_address: newOrder.shipping_address,
            status: newOrder.status,
            payment_status: newOrder.payment_status,
            payment_method: newOrder.payment_method,
            subtotal: newOrder.subtotal,
            discount: newOrder.discount,
            shipping_fee: newOrder.shipping_fee,
            total: newOrder.total,
            coupon_code: newOrder.coupon_code,
            gift_message: newOrder.gift_message,
          })
          .select()
          .single();

        if (orderError) throw orderError;

        if (orderData) {
          // FIX: Use correct DB column names (customization_data + image_url)
          const orderItemsPayload = items.map((item) => ({
            order_id: orderData.id,
            product_id: item.product.id.length > 20 ? item.product.id : null,
            product_title: item.product.title,
            variant_title: item.variant?.title || null,
            unit_price: item.unit_price,
            quantity: item.quantity,
            total_price: item.unit_price * item.quantity,
            image_url: item.customization.uploaded_image_url || item.product.images[0],
            customization_data: {
              custom_texts: item.customization.texts,
              font: item.customization.selected_font,
              color: item.customization.selected_color,
              uploaded_image_url: item.customization.uploaded_image_url,
              addons: item.customization.selected_addons,
            },
          }));
          await supabase.from("order_items").insert(orderItemsPayload);

          // Decrement inventory stock in Supabase
          for (const item of items) {
            if (item.product.id && item.product.id.length > 20) {
              try {
                const { data: prodData } = await supabase
                  .from("products")
                  .select("stock")
                  .eq("id", item.product.id)
                  .single();

                if (prodData && prodData.stock !== null) {
                  await supabase
                    .from("products")
                    .update({ stock: Math.max(0, prodData.stock - item.quantity) })
                    .eq("id", item.product.id);
                }
              } catch (_) {}
            }
          }

          // Increment coupon usage if applied
          if (appliedCoupon?.id) {
            await supabase
              .from("coupons")
              .update({ times_used: (appliedCoupon.times_used || 0) + 1 })
              .eq("id", appliedCoupon.id);
          }
        }
      }

      // Save to localStorage so orders page & detail page always work,
      // even before Supabase auth or when offline
      try {
        const existing = JSON.parse(localStorage.getItem("dh_user_orders") || "[]");
        localStorage.setItem(
          "dh_user_orders",
          JSON.stringify([newOrder, ...existing].slice(0, 50))
        );
      } catch (_) {}

      // Trigger Celebration Confetti
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (_) {}

      // Trigger Order Confirmation Notification (Email/Concierge) in background
      try {
        fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "order_confirmation",
            payload: {
              orderNumber: generatedOrderNumber,
              customerName: fullName,
              customerEmail: email,
              items: items.map((it) => ({
                product_title: it.product.title,
                variant_title: it.variant?.title,
                quantity: it.quantity,
                unit_price: it.unit_price,
              })),
              total: finalTotal,
              shippingAddress: {
                street_address: streetAddress,
                city,
                state,
                postal_code: postalCode,
              },
            },
          }),
        }).catch(() => {});
      } catch (_) {}

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

          {/* 2b. Coupon Code */}
          <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>Have a Coupon Code?</span>
            </h3>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      {appliedCoupon.code} applied!
                    </span>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                      You save {formatCurrency(couponDiscount)} 🎉
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setAppliedCoupon(null); setCouponInput(""); }}
                  className="p-1.5 rounded-full text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code (e.g. SAVE20)"
                    value={couponInput}
                    onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                    className="flex-1 px-3.5 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-mono focus:ring-2 focus:ring-emerald-600 uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={!couponInput.trim() || isCouponLoading}
                    className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold disabled:opacity-50 transition-colors whitespace-nowrap"
                  >
                    {isCouponLoading ? "Checking..." : "Apply"}
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">{couponError}</p>
                )}
              </div>
            )}
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

            {/* Payment Method Details Box */}
            {paymentMethod === "upi" && (
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row items-center gap-4 text-xs">
                <div className="w-24 h-24 bg-white p-2 rounded-xl border border-emerald-200 shadow-sm flex items-center justify-center shrink-0">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=distributehappiness@okhdfcbank&pn=DistributeHappiness"
                    alt="UPI QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <span className="font-bold text-emerald-900 dark:text-emerald-300 block">
                    Instant UPI Payment (Scan & Pay)
                  </span>
                  <p className="text-stone-600 dark:text-stone-400 text-[11px]">
                    Scan using Google Pay, PhonePe, Paytm, or BHIM.
                  </p>
                  <p className="font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    UPI ID: distributehappiness@okhdfcbank
                  </p>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-500 font-medium">
                    ✓ Verified Merchant & Instant Order Confirmation
                  </span>
                </div>
              </div>
            )}

            {paymentMethod === "online" && (
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 dark:text-white">Credit / Debit Card & NetBanking</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    🔒 256-Bit SSL Encrypted
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                    className="col-span-2 px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-mono outline-none"
                  />
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="MM/YY"
                    className="px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-mono outline-none"
                  />
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="CVV"
                    className="px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-mono outline-none"
                  />
                </div>
              </div>
            )}

            {paymentMethod === "cod" && (
              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Cash on Delivery selected. Please keep ₹{finalTotal} ready at the time of delivery.
                </span>
              </div>
            )}
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
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Coupon ({appliedCoupon?.code})</span>
                  <span className="font-bold">−{formatCurrency(couponDiscount)}</span>
                </div>
              )}
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
