"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { User, Package, MapPin, Heart, LogOut, Sparkles, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<"orders" | "details" | "addresses">("orders");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white shadow-xl flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center text-3xl font-black uppercase shadow-inner">
            {user?.full_name?.charAt(0) || "U"}
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              Joy Member
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              {user?.full_name || "Valued Joy Customer"}
            </h1>
            <p className="text-xs text-white/80">{user?.email || "customer@example.com"}</p>
          </div>
        </div>

        <button
          onClick={signOut}
          className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-colors flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs & Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 p-3 rounded-3xl bg-white dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 shadow-sm space-y-1">
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-colors flex items-center gap-2.5 ${
              activeTab === "orders"
                ? "bg-rose-500 text-white shadow-sm"
                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/50"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History</span>
          </button>

          <button
            onClick={() => setActiveTab("details")}
            className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-colors flex items-center gap-2.5 ${
              activeTab === "details"
                ? "bg-rose-500 text-white shadow-sm"
                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/50"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Account Details</span>
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-colors flex items-center gap-2.5 ${
              activeTab === "addresses"
                ? "bg-rose-500 text-white shadow-sm"
                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/50"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="md:col-span-3">
          {activeTab === "orders" && (
            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Recent Orders</h3>
                <Link href="/orders" className="text-xs font-bold text-rose-600 hover:underline">
                  View Full Tracker →
                </Link>
              </div>
              <p className="text-xs text-neutral-500">
                You can view production status and proof mockups on your active orders.
              </p>
            </div>
          )}

          {activeTab === "details" && (
            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Personal Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-neutral-400 block mb-1">Full Name</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{user?.full_name || "N/A"}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-1">Email Address</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{user?.email || "N/A"}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Shipping Addresses</h3>
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60 text-xs space-y-1">
                <span className="font-bold text-rose-600 uppercase text-[10px]">Default Address</span>
                <h5 className="font-bold text-neutral-900 dark:text-white">{user?.full_name || "Priya Sharma"}</h5>
                <p className="text-neutral-500">Flat 402, Lotus Apartments, 5th Main Road</p>
                <p className="text-neutral-500">Mumbai, Maharashtra - 400001</p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
