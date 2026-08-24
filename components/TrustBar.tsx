import React from "react";
import { Sparkles, Zap, PackageCheck, HeartHandshake } from "lucide-react";

const TRUST_PILLARS = [
  {
    icon: Sparkles,
    title: "Live Preview.",
    description: "See your personalization instantly before you order.",
    gradient: "from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10",
  },
  {
    icon: Zap,
    title: "Handcrafted Fast.",
    description: "Precision crafted and dispatched within 24-48 hours.",
    gradient: "from-amber-500/20 to-rose-500/20 dark:from-amber-500/10 dark:to-rose-500/10",
  },
  {
    icon: PackageCheck,
    title: "Impeccable Packaging.",
    description: "Secure, gift-ready presentation boxes for a premium unboxing.",
    gradient: "from-emerald-500/20 to-teal-500/20 dark:from-emerald-500/10 dark:to-teal-500/10",
  },
  {
    icon: HeartHandshake,
    title: "50,000+ Smiles.",
    description: "Join thousands of customers who trust us for their perfect gifts.",
    gradient: "from-rose-500/20 to-pink-500/20 dark:from-rose-500/10 dark:to-pink-500/10",
  },
];

export default function TrustBar() {
  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="text-center mb-10 space-y-3">
        <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gradient-apple">
          The Distribute Happiness Standard.
        </h2>
        <p className="text-sm sm:text-base text-stone-500 dark:text-stone-400 font-light max-w-2xl mx-auto">
          Every product is meticulously designed and rigorously inspected to ensure it exceeds expectations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {TRUST_PILLARS.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="glass-panel-interactive rounded-3xl p-6 sm:p-8 flex flex-col relative overflow-hidden group"
            >
              {/* Apple-style ambient glow within the card */}
              <div
                className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${pillar.gradient} rounded-full blur-[40px] opacity-50 group-hover:opacity-100 transition-opacity duration-700`}
              />
              
              <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center mb-6 relative z-10">
                <Icon className="w-6 h-6 text-stone-700 dark:text-stone-300" strokeWidth={1.5} />
              </div>
              
              <h3 className="text-lg font-medium text-stone-900 dark:text-white tracking-tight mb-2 relative z-10">
                {pillar.title}
              </h3>
              
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-light leading-relaxed relative z-10">
                {pillar.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
