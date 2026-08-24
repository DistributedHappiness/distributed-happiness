"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Sparkles } from "lucide-react";

export default function GiftFinder() {
  const router = useRouter();
  const [recipient, setRecipient] = useState("Couples");
  const [occasion, setOccasion] = useState("Anniversary");
  const [budget, setBudget] = useState("₹500 - ₹1000");

  const recipients = ["Couples", "Him", "Her", "Parents", "Friends"];
  const occasions = ["Anniversary", "Birthday", "Wedding", "Housewarming"];
  const budgets = ["Under ₹500", "₹500 - ₹1000", "Over ₹1000"];

  const handleSearch = () => {
    // In a real app, map these to precise query filters.
    router.push("/products");
  };

  return (
    <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="glass-panel-interactive rounded-[40px] p-8 sm:p-12 relative overflow-hidden text-center bg-white/40 dark:bg-black/40">
        
        {/* Apple Style Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          
          <div className="space-y-3">
            <span className="apple-pill px-4 py-1.5 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider inline-flex items-center gap-1.5 mx-auto">
              <Sparkles className="w-3.5 h-3.5" />
              Gift Concierge
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-gradient-apple">
              Find the Perfect Gift.
            </h2>
            <p className="text-sm sm:text-base text-stone-500 dark:text-stone-400 font-light">
              Answer three quick questions and let our AI curate the perfect personalized masterpiece.
            </p>
          </div>

          <div className="bg-white/60 dark:bg-black/40 backdrop-blur-3xl rounded-[32px] p-2 sm:p-3 border border-black/5 dark:border-white/5 flex flex-col sm:flex-row shadow-sm">
            
            {/* Recipient */}
            <div className="flex-1 p-3 border-b sm:border-b-0 sm:border-r border-black/5 dark:border-white/5">
              <label className="block text-[10px] uppercase font-semibold text-stone-400 dark:text-stone-500 tracking-wider mb-2 text-left px-2">
                For Whom?
              </label>
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-stone-900 dark:text-white focus:outline-none px-2 cursor-pointer appearance-none"
              >
                {recipients.map((r) => <option key={r} value={r} className="text-stone-900">{r}</option>)}
              </select>
            </div>

            {/* Occasion */}
            <div className="flex-1 p-3 border-b sm:border-b-0 sm:border-r border-black/5 dark:border-white/5">
              <label className="block text-[10px] uppercase font-semibold text-stone-400 dark:text-stone-500 tracking-wider mb-2 text-left px-2">
                Occasion?
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-stone-900 dark:text-white focus:outline-none px-2 cursor-pointer appearance-none"
              >
                {occasions.map((o) => <option key={o} value={o} className="text-stone-900">{o}</option>)}
              </select>
            </div>

            {/* Budget */}
            <div className="flex-1 p-3">
              <label className="block text-[10px] uppercase font-semibold text-stone-400 dark:text-stone-500 tracking-wider mb-2 text-left px-2">
                Budget?
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-stone-900 dark:text-white focus:outline-none px-2 cursor-pointer appearance-none"
              >
                {budgets.map((b) => <option key={b} value={b} className="text-stone-900">{b}</option>)}
              </select>
            </div>

            {/* CTA */}
            <div className="p-2 sm:p-0 flex items-center justify-center sm:pl-3">
              <button
                onClick={handleSearch}
                className="w-full sm:w-auto h-full px-8 py-4 sm:py-0 rounded-2xl sm:rounded-3xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
              >
                <Search className="w-4 h-4 hidden sm:block" />
                <span>Curate Gifts</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
