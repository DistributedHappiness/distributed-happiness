"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phoneNumber = "919876543210";
  const defaultMessage = encodeURIComponent("Hello Distribute Happiness! I need help with my custom gift order.");

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${defaultMessage}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 p-3.5 sm:px-5 sm:py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-900/30 flex items-center gap-2.5 transition-all hover:scale-105 group"
      title="Chat on WhatsApp"
    >
      <div className="relative">
        <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-300 rounded-full animate-ping" />
      </div>
      <span className="hidden sm:inline font-bold text-xs">Need Help? Chat on WhatsApp</span>
    </a>
  );
}
