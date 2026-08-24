import React from "react";
import { Heart, Sparkles, Truck, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-black text-stone-900 tracking-tight">
          Distribute Happiness
        </h1>
        <p className="text-lg text-stone-500 max-w-xl mx-auto font-medium">
          We believe the best gifts are the ones that tell a story. We help you create custom, hand-crafted masterpieces that capture memories.
        </p>
      </section>

      {/* Brand Story */}
      <section className="bg-white/40 dark:bg-[#1C1C1E]/40 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-stone-900">Our Story</h2>
        <div className="text-stone-600 dark:text-stone-300 space-y-4 text-sm leading-relaxed">
          <p>
            Born out of a passion for bringing people together, <strong>Distribute Happiness</strong> was founded on a simple premise: a gift should be as unique as the person receiving it. Generic items are quickly forgotten, but a personalized gift holds a permanent spot on desks, walls, and in hearts.
          </p>
          <p>
            From custom wooden diaries with integrated whiteboards to hand-crafted keychains, personalized coasters, and corporate trophy awards, every single piece we create is made-to-order in India with precision, love, and a focus on premium aesthetics.
          </p>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-stone-900 text-center">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white/40 dark:bg-[#1C1C1E]/40 border border-stone-200 dark:border-stone-800 p-6 rounded-2xl flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#FF5733]" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 mb-1">Custom Handcrafting</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Every product is personalized exactly with your name, logo, or message, using laser engraving or high-definition printing.
              </p>
            </div>
          </div>

          <div className="bg-white/40 dark:bg-[#1C1C1E]/40 border border-stone-200 dark:border-stone-800 p-6 rounded-2xl flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 text-[#FF5733]" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 mb-1">Eco-Conscious Materials</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                We prioritize eco-friendly, sustainable wood, bamboo, and cork options so your gesture of love is also kind to our planet.
              </p>
            </div>
          </div>

          <div className="bg-white/40 dark:bg-[#1C1C1E]/40 border border-stone-200 dark:border-stone-800 p-6 rounded-2xl flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-[#FF5733]" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 mb-1">Fast Dispatch</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Despite being fully customized, we process, hand-make, and dispatch your orders within 24-48 hours.
              </p>
            </div>
          </div>

          <div className="bg-white/40 dark:bg-[#1C1C1E]/40 border border-stone-200 dark:border-stone-800 p-6 rounded-2xl flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#FF5733]" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 mb-1">Premium Quality</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                We work with premium materials and double-check every customized spelling and logo file to ensure absolute perfection.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center bg-orange-50 border border-orange-100 rounded-3xl p-8 sm:p-12 space-y-4">
        <h2 className="text-2xl font-bold text-stone-900">Let's Create Something Special</h2>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Explore our wide catalog of personalized gifts and corporate hampers, and let us help you distribute happiness to your loved ones, team members, or clients.
        </p>
        <div className="pt-2">
          <a
            href="/products"
            className="inline-flex h-10 items-center justify-center rounded-full bg-stone-900 px-6 text-sm font-bold text-white hover:bg-stone-800 transition-colors"
          >
            Shop Now
          </a>
        </div>
      </section>

    </main>
  );
}
