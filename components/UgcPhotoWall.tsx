import React from "react";
import { Camera } from "lucide-react";
import { MOCK_UGC_PHOTOS } from "@/lib/mock-data";

export default function UgcPhotoWall() {
  return (
    <section className="py-16 bg-white/30 dark:bg-black/30 border-y border-black/5 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10 space-y-3">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
              <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gradient-apple">
            #DistributeHappiness
          </h2>
          <p className="text-sm sm:text-base text-stone-500 dark:text-stone-400 font-light max-w-xl mx-auto">
            Real moments, real emotions. Join our community of joy and share your personalized creations.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          {MOCK_UGC_PHOTOS.slice(0, 8).map((photo, idx) => (
            <div
              key={photo.id}
              className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-black/5 dark:bg-white/5 ${
                idx === 1 || idx === 6 ? "row-span-2 aspect-[3/4]" : "aspect-square"
              }`}
            >
              <img
                src={photo.image_url}
                alt={`Customer moment by @${photo.instagram_handle}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-6 backdrop-blur-[2px]">
                <p className="text-white font-medium text-sm sm:text-base mb-1">
                  @{photo.instagram_handle}
                </p>
                <p className="text-white/80 text-[10px] sm:text-xs font-light line-clamp-2">
                  "{photo.caption}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
