"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  label?: string;
  floating?: boolean;
  className?: string;
}

export default function WhatsAppButton({
  phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210",
  message = "Hello Distribute Happiness! I need help with custom gifts or bulk order.",
  label = "Need Help? Chat on WhatsApp",
  floating = true,
  className = "",
}: WhatsAppButtonProps) {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");
  const encodedMsg = encodeURIComponent(message);
  const waUrl = `https://wa.me/${cleanNumber}?text=${encodedMsg}`;

  if (!floating) {
    return (
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] ${className}`}
      >
        <MessageCircle className="w-5 h-5 fill-white text-emerald-600 shrink-0" />
        <span>{label}</span>
      </a>
    );
  }

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noreferrer"
      className={`fixed bottom-6 right-6 z-40 p-3.5 sm:px-5 sm:py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-900/30 flex items-center gap-2.5 transition-all hover:scale-105 group ${className}`}
      title="Chat on WhatsApp"
    >
      <div className="relative">
        <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-300 rounded-full animate-ping" />
      </div>
      <span className="hidden sm:inline font-bold text-xs">{label}</span>
    </a>
  );
}

