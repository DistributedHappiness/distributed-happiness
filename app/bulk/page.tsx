"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Phone,
  MessageCircle,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Package,
  Layers,
  Award,
  Users,
  Clock,
  Send,
  HelpCircle,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const TIERS = [
  {
    range: "25 – 50 units",
    discount: "15% Off",
    badge: "Starter",
    features: [
      "Custom logo printing / engraving",
      "Standard branded packaging",
      "Free digital 3D mockup",
      "Standard delivery (5-7 days)",
    ],
  },
  {
    range: "51 – 200 units",
    discount: "25% Off",
    badge: "Most Popular",
    highlight: true,
    features: [
      "Full custom branding & personalization",
      "Premium gift packaging with ribbon",
      "Free physical sample proof",
      "Priority production (3-5 days)",
      "Dedicated account manager",
    ],
  },
  {
    range: "201 – 500 units",
    discount: "35% Off",
    badge: "Corporate",
    features: [
      "All VIP custom branding options",
      "Custom branded box & greeting cards",
      "Individual multi-city doorstep dropship",
      "Express 3-day turnaround",
      "GST input tax invoice",
    ],
  },
  {
    range: "500+ units",
    discount: "Up to 45% Off",
    badge: "Enterprise & Retail",
    features: [
      "Maximum wholesale tier pricing",
      "100% bespoke design & bespoke tooling",
      "Dedicated design team support",
      "Free doorstep shipping pan-India",
      "Scheduled batches & flexible inventory",
    ],
  },
];

const CATEGORIES = [
  {
    title: "Employee Welcome & Swag Kits",
    desc: "Custom diary, engraved pen, stainless steel bottle, premium tee & welcome card.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600",
    moq: "25 pcs",
  },
  {
    title: "Laser Engraved Drinkware",
    desc: "Thermal flasks, matte coffee mugs, and frosted glass tumblers with individual names.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600",
    moq: "30 pcs",
  },
  {
    title: "Festive & Diwali Gift Hampers",
    desc: "Curated gift boxes with brass diyas, dry fruits, personalized keepsake and sweet box.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600",
    moq: "25 pcs",
  },
  {
    title: "Custom Wooden & Acrylic Merch",
    desc: "Keychains, desktop calendars, customized awards & premium plaques for retailers.",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=600",
    moq: "50 pcs",
  },
  {
    title: "Executive Desk Accessories",
    desc: "Wireless charger stands, vegan leather mousepads, organizer trays with company branding.",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=600",
    moq: "20 pcs",
  },
  {
    title: "Bespoke Packaging & Gift Boxes",
    desc: "Rigid magnetic closure boxes, velvet foam inserts, foil-stamped logos and wax seals.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600",
    moq: "50 pcs",
  },
];

const FAQS = [
  {
    q: "Can we get a sample before ordering in bulk?",
    a: "Yes! For orders above 50 units, we provide a free digital 3D proof within 24 hours. For orders of 100+ units, we can also dispatch an actual physical pre-production sample to your office for approval.",
  },
  {
    q: "Do you provide official GST invoices?",
    a: "Absolutely. All bulk and B2B orders receive a tax invoice with your company's GSTIN, allowing you to claim 100% Input Tax Credit (ITC).",
  },
  {
    q: "Can you ship individually to employees across multiple cities?",
    a: "Yes! We specialize in Pan-India multi-location fulfillment. Simply share an address spreadsheet, and we will package, label, and courier individual gift boxes directly to each recipient's doorstep with live tracking.",
  },
  {
    q: "Can individual names be personalized on each item in a bulk order?",
    a: "Yes! In addition to your company logo, we can laser-engrave or print each employee or client's individual name on items like bottles, diaries, mugs, and badges.",
  },
  {
    q: "What is your typical turnaround time?",
    a: "Standard bulk production is 4 to 7 business days depending on quantity. Express production (within 48-72 hours) is available for urgent events.",
  },
];

export default function BulkPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";
  const displayPhone = "+91 98765 43210";

  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState("50-100");
  const [category, setCategory] = useState("Corporate Welcome Kits");
  const [targetDate, setTargetDate] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const generateWhatsAppMessage = () => {
    return encodeURIComponent(
      `Hello Distribute Happiness! 👋\n` +
      `I would like a Bulk / Corporate Quote:\n\n` +
      `🏢 Company: ${companyName || "N/A"}\n` +
      `👤 Contact: ${contactName || "N/A"}\n` +
      `📞 Phone: ${phone || "N/A"}\n` +
      `📧 Email: ${email || "N/A"}\n` +
      `📦 Category: ${category}\n` +
      `🔢 Quantity: ${quantity}\n` +
      `📅 Target Date: ${targetDate || "Flexible"}\n` +
      `📝 Requirements: ${notes || "Standard customization"}`
    );
  };

  const handleSubmitLead = async (e: React.FormEvent, openWhatsApp: boolean = false) => {
    e.preventDefault();
    setErrorMsg("");

    if (!contactName.trim() || !phone.trim()) {
      setErrorMsg("Please provide your name and phone/WhatsApp number.");
      return;
    }

    setIsSubmitting(true);

    const leadPayload = {
      id: `lead_${Date.now()}`,
      company_name: companyName.trim() || "Independent Retailer / Individual",
      contact_person: contactName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      quantity_range: quantity,
      product_category: category,
      target_date: targetDate,
      notes: notes.trim(),
      status: "new",
      created_at: new Date().toISOString(),
    };

    try {
      // Try saving to Supabase if table exists
      if (isSupabaseConfigured()) {
        try {
          await supabase.from("bulk_enquiries").insert({
            company_name: leadPayload.company_name,
            contact_person: leadPayload.contact_person,
            email: leadPayload.email,
            phone: leadPayload.phone,
            quantity_range: leadPayload.quantity_range,
            product_category: leadPayload.product_category,
            target_date: leadPayload.target_date,
            notes: leadPayload.notes,
            status: "new",
          });
        } catch (dbErr) {
          console.warn("Supabase bulk_enquiries insert fallback:", dbErr);
        }
      }

      // Always save to localStorage for admin & persistence fallback
      try {
        const stored = JSON.parse(localStorage.getItem("dh_bulk_leads") || "[]");
        localStorage.setItem("dh_bulk_leads", JSON.stringify([leadPayload, ...stored]));
      } catch (_) {}

      setSubmitted(true);

      if (openWhatsApp) {
        const cleanPhone = whatsappNumber.replace(/[^0-9]/g, "");
        const url = `https://wa.me/${cleanPhone}?text=${generateWhatsAppMessage()}`;
        window.open(url, "_blank");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to send inquiry. Please reach out to us directly on WhatsApp or Call.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900 to-stone-800 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#FF5733_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF5733]/15 border border-[#FF5733]/30 text-[#FF5733] text-xs font-bold uppercase tracking-wider">
            <Briefcase className="w-4 h-4" />
            <span>Corporate Gifting & Wholesale Retail Orders</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
            Premium Custom Gifts in Bulk <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5733] via-rose-400 to-amber-300">
              For Companies & Retailers
            </span>
          </h1>

          <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Elevate employee onboarding, celebrate milestones, impress clients, or stock your store shelves. 
            Enjoy factory-direct wholesale pricing, free custom mockups, and pan-India doorstep delivery.
          </p>

          {/* Instant Connect Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                "Hello Distribute Happiness! I want to discuss a bulk corporate/retail gifting order."
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/40 hover:scale-105 transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
              <span>Instant WhatsApp Discussion</span>
            </a>

            <a
              href={`tel:${displayPhone.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-2.5 px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm backdrop-blur-md hover:scale-105 transition-all"
            >
              <Phone className="w-5 h-5 text-amber-300" />
              <span>Call Us: {displayPhone}</span>
            </a>

            <a
              href="#quote-form"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-[#FF5733] hover:bg-[#e04826] text-white font-bold text-sm shadow-lg hover:scale-105 transition-all"
            >
              <span>Get Custom Quote</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 text-stone-300 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-2.5">
              <Truck className="w-4 h-4 text-[#FF5733]" />
              <span>Pan-India Delivery</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>GST Input Credit</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Free 3D Mockup Proof</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-2.5">
              <Award className="w-4 h-4 text-rose-400" />
              <span>500+ Corporate Clients</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Volume Pricing Tiers */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Tiered Wholesale & Volume Pricing
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">
              The more units you order, the greater your savings. Transparent pricing with no hidden setup fees.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIERS.map((tier, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-5 flex flex-col justify-between transition-all ${
                  tier.highlight
                    ? "bg-stone-900 text-white shadow-xl ring-2 ring-[#FF5733] -translate-y-1"
                    : "bg-stone-50 text-stone-900 border border-stone-200 hover:border-stone-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                        tier.highlight
                          ? "bg-[#FF5733] text-white"
                          : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {tier.badge}
                    </span>
                    <span className="text-xs font-bold text-stone-400">{tier.range}</span>
                  </div>

                  <div className="my-2">
                    <div className="text-3xl font-black text-[#FF5733]">{tier.discount}</div>
                    <div
                      className={`text-xs ${
                        tier.highlight ? "text-stone-300" : "text-stone-500"
                      }`}
                    >
                      wholesale margin savings
                    </div>
                  </div>

                  <ul className="space-y-2 mt-4 text-xs">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            tier.highlight ? "text-[#FF5733]" : "text-emerald-600"
                          }`}
                        />
                        <span
                          className={
                            tier.highlight ? "text-stone-200" : "text-stone-700"
                          }
                        >
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#quote-form"
                  onClick={() => setQuantity(tier.range.split(" ")[0])}
                  className={`mt-6 w-full py-2.5 rounded-xl font-bold text-xs text-center transition-all ${
                    tier.highlight
                      ? "bg-[#FF5733] hover:bg-[#e04826] text-white shadow-md"
                      : "bg-stone-200 hover:bg-stone-300 text-stone-800"
                  }`}
                >
                  Choose {tier.range}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Catalog Showcase Categories */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[#FF5733] font-bold text-xs tracking-wider uppercase">
            Curated For Corporate & Retail
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900 mt-1">
            Top Categories for Bulk Ordering
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            Explore our most requested products customized with company logos, names, and bespoke designs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-all flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  Min. {cat.moq}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-stone-900 group-hover:text-[#FF5733] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                  <a
                    href="#quote-form"
                    onClick={() => setCategory(cat.title)}
                    className="text-xs font-bold text-[#FF5733] hover:underline flex items-center gap-1"
                  >
                    <span>Request Quote for this</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Interactive Bulk Quotation & Lead Form */}
      <section id="quote-form" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl p-6 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5733]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5733]/20 text-[#FF5733] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fast 2-Hour Response</span>
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                Get a Customized Wholesale Quotation
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Fill in your expected requirements below. Our corporate gifting lead manager will contact you directly with pricing, product suggestions, and a free 3D digital mockup.
              </p>

              {/* Direct Quick Contacts */}
              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Direct WhatsApp Hotline</div>
                    <div className="text-stone-400">{displayPhone}</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FF5733]/20 text-[#FF5733] flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Call for Urgent Orders</div>
                    <div className="text-stone-400">Available Mon-Sat, 9am - 8pm</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7 bg-white text-stone-900 rounded-2xl p-6 sm:p-8 shadow-xl">
              {submitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-stone-900">
                    Bulk Inquiry Received!
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
                    Thank you, <strong>{contactName}</strong>. Our corporate account manager will review your request and call you shortly.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${generateWhatsAppMessage()}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat on WhatsApp Now</span>
                    </a>

                    <button
                      onClick={() => setSubmitted(false)}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={(e) => handleSubmitLead(e, false)} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                        Company / Store Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Acme Corp / Retail Boutique"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs outline-none focus:border-[#FF5733]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                        Contact Person <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs outline-none focus:border-[#FF5733]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                        Phone / WhatsApp <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs outline-none focus:border-[#FF5733]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                        Work Email
                      </label>
                      <input
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs outline-none focus:border-[#FF5733]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                        Estimated Quantity
                      </label>
                      <select
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs outline-none focus:border-[#FF5733] bg-white"
                      >
                        <option value="25-50">25 – 50 units (15% Off)</option>
                        <option value="50-100">50 – 100 units (20% Off)</option>
                        <option value="100-250">100 – 250 units (25% Off)</option>
                        <option value="250-500">250 – 500 units (35% Off)</option>
                        <option value="500+">500+ units (Wholesale / Bespoke)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                        Category / Product
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs outline-none focus:border-[#FF5733] bg-white"
                      >
                        <option value="Corporate Welcome Kits">Corporate Welcome Kits</option>
                        <option value="Custom Drinkware & Mugs">Custom Drinkware & Mugs</option>
                        <option value="Festive & Diwali Hampers">Festive & Diwali Hampers</option>
                        <option value="Wooden & Acrylic Keepsakes">Wooden & Acrylic Keepsakes</option>
                        <option value="Desk Accessories & Merch">Desk Accessories & Merch</option>
                        <option value="Multiple Products / Mixed">Multiple Products / Mixed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                      Expected By (Target Date)
                    </label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs outline-none focus:border-[#FF5733] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                      Customization Notes / Budget per unit
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Specify details: e.g. 'Need laser engraved logos + individual employee names on bottles. Budget ~₹600/unit.'"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs outline-none focus:border-[#FF5733]"
                    />
                  </div>

                  {/* Dual Submit Options */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={(e) => handleSubmitLead(e, true)}
                      className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01]"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{isSubmitting ? "Submitting..." : "Submit & Connect on WhatsApp"}</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#FF5733] hover:bg-[#e04826] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01]"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? "Submitting..." : "Submit Callback Request"}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-stone-400 text-center pt-1">
                    🔒 We protect your data. No spam, guaranteed.
                  </p>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 5. How It Works Workflow */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#FF5733] font-bold text-xs tracking-wider uppercase">
            Seamless Execution
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900 mt-1">
            How Bulk Ordering Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Share Requirements",
              desc: "Tell us product categories, quantities, logo branding, and target event dates.",
            },
            {
              step: "02",
              title: "Free Digital Mockup",
              desc: "Our design team sends high-resolution 3D proofs with your logo for approval within 24h.",
            },
            {
              step: "03",
              title: "Production & QC",
              desc: "Crafted with precision engraving/printing and individual quality checks.",
            },
            {
              step: "04",
              title: "Pan-India Dispatch",
              desc: "Delivered to your corporate HQ in consolidated crates, or drop-shipped to each employee.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-stone-200 relative shadow-sm"
            >
              <div className="text-3xl font-black text-[#FF5733]/30 mb-3">{item.step}</div>
              <h3 className="font-bold text-base text-stone-900 mb-2">{item.title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-stone-900">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-stone-200">
              <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#FF5733] shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-stone-600 mt-2 pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
