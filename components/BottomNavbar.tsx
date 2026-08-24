"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { Home, Store, ShoppingBag, User } from "lucide-react";

export default function BottomNavbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Shop", href: "/products", icon: Store },
    { name: "Cart", href: "/cart", icon: ShoppingBag, badge: totalItems },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-t border-stone-200/80 dark:border-stone-850/80 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] px-6 py-2 pb-safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                isActive 
                  ? "text-[#FF5733]" 
                  : "text-stone-500 hover:text-[#FF5733]"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5 stroke-[2.25]" />
                
                {/* Cart Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#FF5733] text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
