"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

const HERO_SLIDES = [
  {
    id: 1,
    subtitle: "Premium Handcrafted Gifting",
    titleMain: "Smart A5",
    titleSub: "Wooden Diaries",
    image: "https://eowvsxhpxyatdzrwnqmt.supabase.co/storage/v1/object/public/products/cropped-4337ad97-c82c-4b92-9103-c728a0874859.webp",
    link: "/products/wooden-diary2",
    bgColor: "bg-[#FAF0DD]", // Bamboo cream
    accentColor: "text-[#FF5733]", // Coral/Orange
  },
  {
    id: 2,
    subtitle: "Eco-Conscious Hydration",
    titleMain: "Bamboo Cap",
    titleSub: "Glass Bottles",
    image: "https://eowvsxhpxyatdzrwnqmt.supabase.co/storage/v1/object/public/products/cropped-08d2f9f0-32b7-485f-bc82-98949da3d718.webp",
    link: "/products/gkd-glass-water-bottle",
    bgColor: "bg-[#E5ECE9]", // Sage/Mint cream
    accentColor: "text-[#2E5A44]", // Deep emerald green
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <div className="relative w-full h-[500px] sm:h-[600px] overflow-hidden bg-[#F8F9F9]">
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 flex flex-col md:flex-row transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Left Side: Image on pastel background */}
          <div className={`w-full md:w-1/2 h-full ${slide.bgColor} relative flex items-center justify-center p-8`}>
            <img
              src={slide.image}
              alt={slide.titleSub}
              className="max-h-full max-w-full object-contain drop-shadow-2xl rounded-2xl"
            />
          </div>

          {/* Right Side: Typography */}
          <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-start p-10 md:p-16 lg:p-24 bg-[#F8F9F9]">
            <span className="text-stone-500 font-medium text-lg mb-2">{slide.subtitle}</span>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-stone-900 leading-[1.1] mb-2">
              <span className={slide.accentColor}>{slide.titleMain} </span>
              <br />
              {slide.titleSub}
            </h1>
            
            <Link
              href={slide.link}
              className="mt-8 bg-[#FF5733] hover:bg-[#E54D2E] text-white px-8 py-3 font-bold text-sm tracking-wide uppercase transition-colors"
            >
              Shop Now
            </Link>

            {/* Faded Background Text */}
            <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 text-[200px] font-black text-stone-100 opacity-50 pointer-events-none z-[-1] whitespace-nowrap overflow-hidden">
              COM
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#FF5733] text-white flex items-center justify-center hover:bg-[#E54D2E] transition-colors shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#FF5733] text-white flex items-center justify-center hover:bg-[#E54D2E] transition-colors shadow-lg"
      >
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
