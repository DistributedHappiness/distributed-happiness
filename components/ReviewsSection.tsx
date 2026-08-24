import React from "react";
import { Star, CheckCircle2, Quote } from "lucide-react";
import { MOCK_REVIEWS } from "@/lib/mock-data";

export default function ReviewsSection() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      <div className="text-center mb-12 space-y-3">
        <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-gradient-apple">
          Loved by Thousands.
        </h2>
        <p className="text-sm sm:text-base text-stone-500 dark:text-stone-400 font-light max-w-2xl mx-auto">
          Don't just take our word for it. Here is what our community of gift-givers has to say.
        </p>
      </div>

      <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-8 snap-x snap-mandatory no-scrollbar">
        {MOCK_REVIEWS.map((review) => (
          <div
            key={review.id}
            className="snap-start shrink-0 w-[300px] sm:w-[350px] glass-panel-interactive rounded-3xl p-6 sm:p-8 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-black/5 dark:text-white/5 rotate-180 -z-10" />
                <p className="text-sm text-stone-700 dark:text-stone-300 font-medium leading-relaxed z-10 relative">
                  "{review.comment}"
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-4">
              <div>
                <p className="text-sm font-semibold text-stone-900 dark:text-white">
                  {review.user_name}
                </p>
                {review.is_verified && (
                  <p className="text-[10px] text-blue-500 font-medium flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Buyer
                  </p>
                )}
              </div>
              
              {review.image_url && (
                <div className="w-12 h-12 rounded-full overflow-hidden border border-black/5 dark:border-white/5 shadow-sm">
                  <img src={review.image_url} alt="Review" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
