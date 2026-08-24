import React from "react";
import Link from "next/link";

const PROMOS = [
  {
    id: 1,
    title: "Themed Desk Organizers",
    discount: "Flat 25% off",
    image: "https://eowvsxhpxyatdzrwnqmt.supabase.co/storage/v1/object/public/products/cropped-c77da0b8-b688-4323-9c5e-50ca60a25741.webp",
    link: "/products/gkd-advocate-doctor-themed-organizer",
    bg: "bg-[#F5EEF8]" // Light lavender
  },
  {
    id: 2,
    title: "Laser Engraved Tabletops",
    discount: "Starts from ₹299",
    image: "https://eowvsxhpxyatdzrwnqmt.supabase.co/storage/v1/object/public/products/cropped-13e720d5-1501-4b4b-9b4c-76b5b31a638d.webp",
    link: "/products/gkd-motivational-quotes-table-top",
    bg: "bg-[#EAF2F8]" // Light ice blue
  },
  {
    id: 3,
    title: "Premium Acrylic Trophies",
    discount: "Bulk Corporate Deals",
    image: "https://eowvsxhpxyatdzrwnqmt.supabase.co/storage/v1/object/public/products/cropped-143a94be-8e18-41d4-8d29-98d050166c21.webp",
    link: "/products/wooden-trophy",
    bg: "bg-[#FEF9E7]" // Light gold
  }
];

export default function PromoBanners() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROMOS.map((promo) => (
          <div key={promo.id} className={`${promo.bg} rounded-md p-6 flex flex-row items-center gap-4 hover:shadow-lg transition-shadow`}>
            {/* Image */}
            <div className="w-1/2 h-32 relative flex items-center justify-center">
              <img 
                src={promo.image} 
                alt={promo.title} 
                className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-md rounded-md"
              />
            </div>
            
            {/* Text & CTA */}
            <div className="w-1/2 flex flex-col justify-center">
              <h3 className="text-sm text-stone-500 font-medium mb-1 leading-snug">{promo.title}</h3>
              <p className="text-xl font-black text-stone-900 leading-tight mb-4">{promo.discount}</p>
              <Link 
                href={promo.link}
                className="text-xs font-bold text-[#FF5733] hover:text-[#E54D2E] uppercase tracking-wider underline decoration-2 underline-offset-4"
              >
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
