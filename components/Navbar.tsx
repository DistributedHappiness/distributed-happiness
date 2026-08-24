"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import ThemeToggle from "./ThemeToggle";
import {
  ShoppingBag,
  Search,
  User,
  Truck,
  Sparkles,
  Menu,
  X,
  Gift,
  ArrowRight,
} from "lucide-react";

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [navCategories, setNavCategories] = useState<{name: string, href: string}[]>([
    { name: "All Gifts", href: "/products" }
  ]);

  useEffect(() => {
    async function loadCats() {
      try {
        const { getCategories } = await import("@/lib/api");
        const cats = await getCategories();
        if (cats && cats.length > 0) {
          const dynamicLinks = cats.slice(0, 6).map((c: any) => ({
            name: c.name,
            href: `/products?category=${c.slug}`
          }));
          setNavCategories([ { name: "All Gifts", href: "/products" }, ...dynamicLinks ]);
        }
      } catch (err) {
        console.error("Nav cat fetch error", err);
      }
    }
    loadCats();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24 gap-4">
          
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center gap-3 w-1/4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-stone-900"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src="/logo/logo-only-distributeHappiness.png"
                alt="Distribute Happiness Logo"
                className="h-12 w-auto block lg:hidden object-contain"
              />
              <img
                src="/logo/logo-full-DistributeHappiness.png"
                alt="Distribute Happiness Logo"
                className="h-16 md:h-20 w-auto hidden lg:block object-contain"
              />
            </Link>
          </div>

          {/* Center: Clean Text Navigation */}
          <nav className="hidden lg:flex items-center justify-center gap-2 flex-1">
            {[
              { name: "Home", href: "/" },
              { name: "Shop", href: "/products" },
              { name: "About Us", href: "/about" },
              { name: "Contact", href: "/contact" },
            ].map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[14px] font-bold transition-all px-4 py-2 rounded-full ${
                    isActive 
                      ? "bg-stone-100 text-[#FF5733]" 
                      : "text-stone-900 hover:text-[#FF5733] hover:bg-stone-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right: Circular Icons */}
          <div className="flex items-center justify-end gap-3 w-1/4">
            
            {/* Search Icon Circle */}
            <button
              onClick={() => setIsSearchFocused(!isSearchFocused)}
              className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Cart Icon Circle */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#FF5733] text-white font-bold text-[10px]">
                  {totalItems}
                </span>
              )}
            </button>
            
            {/* Expandable Search Input (if clicked) */}
            {isSearchFocused && (
              <form
                onSubmit={handleSearch}
                className="absolute right-4 top-[90px] w-72 bg-white p-2 shadow-xl border border-stone-100 rounded-lg flex items-center animate-in fade-in slide-in-from-top-2"
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-2 py-2 text-sm bg-transparent outline-none text-stone-900"
                  autoFocus
                />
                <button type="submit" className="p-2 text-stone-400 hover:text-[#FF5733]">
                  <Search className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-100 p-4 space-y-4 shadow-lg absolute w-full">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full text-sm bg-stone-100 text-stone-900 outline-none"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </form>

          <div className="flex flex-col space-y-2 pt-2">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-sm font-bold text-stone-900 hover:bg-stone-50 rounded-lg">Home</Link>
            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-sm font-bold text-stone-900 hover:bg-stone-50 rounded-lg">Shop</Link>
            {navCategories.slice(1, 4).map((cat, idx) => (
              <Link
                key={idx}
                href={cat.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-bold text-stone-900 hover:bg-stone-50 rounded-lg"
              >
                {cat.name}
              </Link>
            ))}
            <Link href="#" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-sm font-bold text-stone-900 hover:bg-stone-50 rounded-lg">Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
}
