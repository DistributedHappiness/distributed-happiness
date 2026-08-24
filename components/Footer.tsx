import React from "react";
import Link from "next/link";
import { Gift, Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#111111] border-t border-black/5 dark:border-white/5 pt-16 pb-8 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img
                src="/logo/logo-full-DistributeHappiness.png"
                alt="Distribute Happiness Logo"
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-stone-500 dark:text-stone-400 font-light leading-relaxed max-w-sm">
              Elevating the art of gifting. We engineer emotion through precision-crafted, personalized keepsakes delivered across India.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-stone-900 dark:text-white">Shop</h4>
            <ul className="space-y-3 font-light text-stone-500 dark:text-stone-400">
              <li><Link href="/products?category=mugs-drinkware" className="hover:text-blue-600 transition-colors">Ceramic Mugs</Link></li>
              <li><Link href="/products?category=personalized-apparel" className="hover:text-blue-600 transition-colors">Apparel & Hoodies</Link></li>
              <li><Link href="/products?category=photo-frames-plaques" className="hover:text-blue-600 transition-colors">Spotify Plaques</Link></li>
              <li><Link href="/products?category=custom-neon-signs" className="hover:text-blue-600 transition-colors">Neon Signs</Link></li>
              <li><Link href="/products/laser-engraved-wooden-photo-plaque" className="hover:text-blue-600 transition-colors">Engraved Wood</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-stone-900 dark:text-white">Support</h4>
            <ul className="space-y-3 font-light text-stone-500 dark:text-stone-400">
              <li><Link href="/orders" className="hover:text-blue-600 transition-colors">Track Order</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Shipping Policy</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Returns & Refunds</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-stone-900 dark:text-white">Contact</h4>
            <ul className="space-y-4 font-light text-stone-500 dark:text-stone-400">
              <li className="flex gap-3">
                <Phone className="w-4 h-4 mt-1 shrink-0 text-stone-400" />
                <span>+91 98765 43210 <br /> (Mon-Sat, 10AM-6PM)</span>
              </li>
              <li className="flex gap-3">
                <Mail className="w-4 h-4 mt-1 shrink-0 text-stone-400" />
                <span>support@distributehappiness.com</span>
              </li>
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 mt-1 shrink-0 text-stone-400" />
                <span>Design Studio, MG Road,<br />Bengaluru, India 560001</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 font-light text-xs text-stone-400 dark:text-stone-500">
          <p>&copy; {new Date().getFullYear()} Distribute Happiness. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-stone-600 dark:hover:text-stone-300">Privacy Policy</Link>
            <Link href="#" className="hover:text-stone-600 dark:hover:text-stone-300">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
