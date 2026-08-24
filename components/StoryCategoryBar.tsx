"use client";

import React from "react";
import Link from "next/link";

interface StoryItem {
  id: string;
  name: string;
  badge?: string;
  imageUrl: string;
  href: string;
}

const STORIES: StoryItem[] = [
  {
    id: "s1",
    name: "For Couples",
    badge: "🔥 HOT",
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=300&auto=format&fit=crop",
    href: "/products?category=personalized-apparel",
  },
  {
    id: "s2",
    name: "Spotify Art",
    badge: "TRENDING",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=300&auto=format&fit=crop",
    href: "/products/custom-spotify-acrylic-song-plaque",
  },
  {
    id: "s3",
    name: "Custom Mugs",
    badge: "NEW",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=300&auto=format&fit=crop",
    href: "/products/personalized-ceramic-photo-name-mug",
  },
  {
    id: "s4",
    name: "Neon Lights",
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=300&auto=format&fit=crop",
    href: "/products/custom-led-neon-name-sign",
  },
  {
    id: "s5",
    name: "Wood Plaques",
    imageUrl: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=300&auto=format&fit=crop",
    href: "/products/laser-engraved-wooden-photo-plaque",
  },
  {
    id: "s6",
    name: "Leather Sets",
    imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=300&auto=format&fit=crop",
    href: "/products/custom-name-leatherette-gift-set",
  },
  {
    id: "s7",
    name: "All Gifts",
    imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=300&auto=format&fit=crop",
    href: "/products",
  },
];

export default function StoryCategoryBar() {
  return (
    <div className="bg-white dark:bg-stone-900 border-b border-stone-200/80 dark:border-stone-800 py-4 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar justify-start sm:justify-center py-1">
          {STORIES.map((story) => (
            <Link
              key={story.id}
              href={story.href}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group cursor-pointer"
            >
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-emerald-600 transition-transform duration-300 group-hover:scale-105">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-stone-100 p-0.5">
                  <img
                    src={story.imageUrl}
                    alt={story.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {story.badge && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-sm border border-white">
                    {story.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-stone-700 dark:text-stone-300 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors text-center whitespace-nowrap">
                {story.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
