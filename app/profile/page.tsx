"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import {
  User,
  Package,
  MapPin,
  LogOut,
  Sparkles,
  CheckCircle2,
  Clock,
  Truck,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  AlertCircle,
  Home,
  Heart,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Address {
  id: string;
  full_name: string;
  phone: string;
  street_address: string;
  apartment?: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
}

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<"orders" | "details" | "addresses" | "wishlist">("orders");

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  // Wishlist State
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // Profile Details State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Addresses State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddressesLoading, setIsAddressesLoading] = useState(true);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, "id">>({
    full_name: "",
    phone: "",
    street_address: "",
    apartment: "",
    city: "",
    state: "",
    postal_code: "",
    is_default: false,
  });

  // Sync profile details initially
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  // Load Orders
  useEffect(() => {
    async function loadOrders() {
      setIsOrdersLoading(true);
      let loadedOrders: any[] = [];

      try {
        if (isSupabaseConfigured() && user?.id) {
          const { data, error } = await supabase
            .from("orders")
            .select("*, order_items(*)")
            .or(`user_id.eq.${user.id},customer_email.eq.${user.email}`)
            .order("created_at", { ascending: false });

          if (!error && data) {
            loadedOrders = data;
          }
        }
      } catch (err) {
        console.warn("Supabase fetch orders in profile error:", err);
      }

      // Merge with localStorage orders
      try {
        const local = JSON.parse(localStorage.getItem("dh_user_orders") || "[]");
        const existingNumbers = new Set(loadedOrders.map((o) => o.order_number));
        local.forEach((lo: any) => {
          if (!existingNumbers.has(lo.order_number)) {
            loadedOrders.push(lo);
          }
        });
      } catch (_) {}

      setOrders(loadedOrders);
      setIsOrdersLoading(false);
    }

    loadOrders();
  }, [user]);

  // Load Addresses
  useEffect(() => {
    async function loadAddresses() {
      setIsAddressesLoading(true);
      let addrList: Address[] = [];

      if (isSupabaseConfigured() && user?.id) {
        try {
          const { data, error } = await supabase
            .from("addresses")
            .select("*")
            .eq("user_id", user.id)
            .order("is_default", { ascending: false });

          if (!error && data && data.length > 0) {
            addrList = data;
          }
        } catch (err) {
          console.warn("Addresses fetch error:", err);
        }
      }

      // Local storage fallback
      if (addrList.length === 0) {
        try {
          const local = JSON.parse(localStorage.getItem("dh_saved_addresses") || "[]");
          if (local.length > 0) {
            addrList = local;
          } else if (user) {
            // Default sample address based on user
            addrList = [
              {
                id: "default-1",
                full_name: user.full_name || "Valued Customer",
                phone: user.phone || "+91 98765 43210",
                street_address: "Flat 402, Lotus Heights, 5th Main Road",
                apartment: "Wing B",
                city: "Mumbai",
                state: "Maharashtra",
                postal_code: "400001",
                is_default: true,
              },
            ];
          }
        } catch (_) {}
      }

      setAddresses(addrList);
      setIsAddressesLoading(false);
    }

    loadAddresses();
  }, [user]);

  // Load Wishlist Products
  useEffect(() => {
    async function loadWishlist() {
      setIsWishlistLoading(true);
      try {
        const savedIds: string[] = JSON.parse(localStorage.getItem("dh_user_wishlist") || "[]");
        if (savedIds.length > 0) {
          const { getProducts } = await import("@/lib/api");
          const allProds = await getProducts();
          setWishlistProducts(allProds.filter((p) => savedIds.includes(p.id)));
        } else {
          setWishlistProducts([]);
        }
      } catch (err) {
        console.warn("Load wishlist in profile error:", err);
      } finally {
        setIsWishlistLoading(false);
      }
    }

    loadWishlist();
  }, [activeTab]);

  const handleRemoveWishlist = (productId: string) => {
    const updated = wishlistProducts.filter((p) => p.id !== productId);
    setWishlistProducts(updated);
    try {
      const savedIds: string[] = JSON.parse(localStorage.getItem("dh_user_wishlist") || "[]");
      localStorage.setItem("dh_user_wishlist", JSON.stringify(savedIds.filter((id) => id !== productId)));
      if (isSupabaseConfigured() && user?.id) {
        supabase.from("wishlists").delete().eq("user_id", user.id).eq("product_id", productId);
      }
    } catch (_) {}
  };

  // Save Profile Details
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMsg(null);

    try {
      if (isSupabaseConfigured() && user?.id) {
        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: fullName.trim(),
            phone: phone.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (error) throw error;
      }

      // Update localStorage user profile
      try {
        const currentProfile = JSON.parse(localStorage.getItem("dh_user_profile") || "{}");
        const updated = { ...currentProfile, full_name: fullName.trim(), phone: phone.trim() };
        localStorage.setItem("dh_user_profile", JSON.stringify(updated));
      } catch (_) {}

      setProfileMsg({ type: "success", text: "Profile details updated successfully!" });
    } catch (err: any) {
      console.error("Profile save error:", err);
      setProfileMsg({ type: "error", text: err.message || "Failed to update profile." });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Add New Address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.full_name || !newAddress.street_address || !newAddress.city || !newAddress.postal_code) {
      return;
    }

    const created: Address = {
      ...newAddress,
      id: `addr_${Date.now()}`,
    };

    let updatedList = [...addresses];
    if (created.is_default) {
      updatedList = updatedList.map((a) => ({ ...a, is_default: false }));
    }
    updatedList.push(created);

    if (isSupabaseConfigured() && user?.id) {
      try {
        await supabase.from("addresses").insert({
          user_id: user.id,
          full_name: created.full_name,
          phone: created.phone,
          street_address: created.street_address,
          apartment: created.apartment || null,
          city: created.city,
          state: created.state,
          postal_code: created.postal_code,
          is_default: created.is_default,
        });
      } catch (err) {
        console.warn("Address DB save error:", err);
      }
    }

    try {
      localStorage.setItem("dh_saved_addresses", JSON.stringify(updatedList));
    } catch (_) {}

    setAddresses(updatedList);
    setShowAddAddress(false);
    setNewAddress({
      full_name: user?.full_name || "",
      phone: user?.phone || "",
      street_address: "",
      apartment: "",
      city: "",
      state: "",
      postal_code: "",
      is_default: false,
    });
  };

  // Delete Address
  const handleDeleteAddress = async (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    try {
      localStorage.setItem("dh_saved_addresses", JSON.stringify(updated));
    } catch (_) {}

    if (isSupabaseConfigured() && user?.id) {
      try {
        await supabase.from("addresses").delete().eq("id", id);
      } catch (_) {}
    }
  };

  // Set Default Address
  const handleSetDefault = async (id: string) => {
    const updated = addresses.map((a) => ({ ...a, is_default: a.id === id }));
    setAddresses(updated);
    try {
      localStorage.setItem("dh_saved_addresses", JSON.stringify(updated));
    } catch (_) {}

    if (isSupabaseConfigured() && user?.id) {
      try {
        await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
        await supabase.from("addresses").update({ is_default: true }).eq("id", id);
      } catch (_) {}
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">Delivered</span>;
      case "shipped":
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] uppercase">Shipped</span>;
      case "in_production":
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] uppercase">In Production</span>;
      case "proof_review":
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px] uppercase">Proof Review</span>;
      case "cancelled":
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] uppercase">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold text-[10px] uppercase">Pending</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#FF5733] via-rose-500 to-amber-500 text-white shadow-xl flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center text-3xl font-black uppercase shadow-inner">
            {user?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              Joy Club Member
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              {user?.full_name || "Valued Customer"}
            </h1>
            <p className="text-xs text-white/80">{user?.email || "customer@example.com"}</p>
          </div>
        </div>

        <button
          onClick={signOut}
          className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs & Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 p-3 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-1">
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeTab === "orders"
                ? "bg-[#FF5733] text-white shadow-sm"
                : "text-stone-700 hover:bg-stone-100"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History</span>
            {orders.length > 0 && (
              <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === "orders" ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"
              }`}>
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("details")}
            className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeTab === "details"
                ? "bg-[#FF5733] text-white shadow-sm"
                : "text-stone-700 hover:bg-stone-100"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Account Details</span>
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeTab === "addresses"
                ? "bg-[#FF5733] text-white shadow-sm"
                : "text-stone-700 hover:bg-stone-100"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
            {addresses.length > 0 && (
              <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === "addresses" ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"
              }`}>
                {addresses.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeTab === "wishlist"
                ? "bg-[#FF5733] text-white shadow-sm"
                : "text-stone-700 hover:bg-stone-100"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist</span>
            {wishlistProducts.length > 0 && (
              <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === "wishlist" ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"
              }`}>
                {wishlistProducts.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Body */}
        <div className="md:col-span-3">
          
          {/* 1. ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="text-base font-bold text-stone-900">Your Recent Orders</h3>
                  <p className="text-xs text-stone-500">Track shipments, live custom proofs, and production</p>
                </div>
                <Link href="/orders" className="text-xs font-bold text-[#FF5733] hover:underline flex items-center gap-1">
                  <span>Full Order Search</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {isOrdersLoading ? (
                <div className="space-y-3 py-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="p-4 rounded-2xl border border-stone-100 animate-pulse space-y-2">
                      <div className="h-4 bg-stone-100 rounded w-1/3" />
                      <div className="h-3 bg-stone-100 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <Package className="w-10 h-10 text-stone-300 mx-auto" />
                  <p className="text-xs text-stone-500">You haven't placed any orders yet.</p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF5733] text-white text-xs font-bold hover:bg-[#e04826]"
                  >
                    Start Shopping Gifts
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.order_number || order.id}
                      className="p-5 rounded-2xl border border-stone-200 hover:border-stone-300 transition-all space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="font-mono font-bold text-sm text-stone-900">
                            {order.order_number}
                          </span>
                          <span className="text-[11px] text-stone-400 block">
                            Placed on {formatDate(order.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(order.status)}
                          <span className="font-bold text-sm text-stone-900">
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-stone-100">
                        {order.items?.slice(0, 3).map((item: any, iIdx: number) => (
                          <div key={iIdx} className="flex items-center gap-2 text-xs text-stone-600 bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-100">
                            {item.image_url && (
                              <img src={item.image_url} alt="" className="w-6 h-6 rounded object-cover" />
                            )}
                            <span className="font-medium truncate max-w-[150px]">{item.product_title}</span>
                            <span className="text-stone-400">×{item.quantity}</span>
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <span className="text-xs text-stone-400">+{order.items.length - 3} more</span>
                        )}
                        <Link
                          href={`/orders/${order.order_number}`}
                          className="ml-auto text-xs font-bold text-[#FF5733] hover:underline flex items-center gap-1"
                        >
                          <span>Track Order →</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. ACCOUNT DETAILS TAB */}
          {activeTab === "details" && (
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-stone-900">Personal Information</h3>
                <p className="text-xs text-stone-500">Update your name, contact phone, and profile details</p>
              </div>

              {profileMsg && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    profileMsg.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {profileMsg.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{profileMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                    Email Address (Account ID)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 text-xs cursor-not-allowed"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    Email cannot be changed directly for security.
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs outline-none focus:border-[#FF5733]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs outline-none focus:border-[#FF5733]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 rounded-xl bg-[#FF5733] hover:bg-[#e04826] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingProfile ? "Saving..." : "Save Changes"}</span>
                </button>
              </form>
            </div>
          )}

          {/* 3. ADDRESSES TAB */}
          {activeTab === "addresses" && (
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900">Saved Delivery Addresses</h3>
                  <p className="text-xs text-stone-500">Manage multiple addresses for faster checkout</p>
                </div>
                {!showAddAddress && (
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New</span>
                  </button>
                )}
              </div>

              {/* Add Address Form */}
              {showAddAddress && (
                <form
                  onSubmit={handleAddAddress}
                  className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <span className="font-bold text-xs text-stone-900">Add New Shipping Address</span>
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(false)}
                      className="text-xs text-stone-400 hover:text-stone-700"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.full_name}
                        onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">
                      Street Address / House No. *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddress.street_address}
                      onChange={(e) => setNewAddress({ ...newAddress, street_address: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-600 uppercase mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.postal_code}
                        onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="is_default"
                      checked={newAddress.is_default}
                      onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                      className="rounded border-stone-300 text-[#FF5733] focus:ring-[#FF5733]"
                    />
                    <label htmlFor="is_default" className="text-xs text-stone-700">
                      Set as default delivery address
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#FF5733] hover:bg-[#e04826] text-white text-xs font-bold"
                  >
                    Save Address
                  </button>
                </form>
              )}

              {/* Address Cards List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-5 rounded-2xl border text-xs space-y-2 relative transition-all ${
                      addr.is_default
                        ? "bg-rose-50/50 border-[#FF5733]/40"
                        : "bg-white border-stone-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-sm">{addr.full_name}</span>
                      {addr.is_default && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FF5733] text-white text-[9px] font-black uppercase">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="text-stone-600">{addr.street_address}</p>
                    {addr.apartment && <p className="text-stone-500">{addr.apartment}</p>}
                    <p className="text-stone-600 font-medium">
                      {addr.city}, {addr.state} — {addr.postal_code}
                    </p>
                    <p className="text-stone-500 pt-1">📞 {addr.phone}</p>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      {!addr.is_default ? (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="text-[11px] font-bold text-stone-600 hover:text-[#FF5733]"
                        >
                          Make Default
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Default Address
                        </span>
                      )}

                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 rounded"
                        title="Delete Address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. WISHLIST TAB */}
          {activeTab === "wishlist" && (
            <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="text-base font-bold text-stone-900">Your Saved Wishlist</h3>
                  <p className="text-xs text-stone-500">Products you've saved to customize or order later</p>
                </div>
                {wishlistProducts.length > 0 && (
                  <span className="text-xs font-bold text-stone-400">
                    {wishlistProducts.length} items saved
                  </span>
                )}
              </div>

              {isWishlistLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-40 rounded-2xl bg-stone-100 animate-pulse" />
                  ))}
                </div>
              ) : wishlistProducts.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-stone-900">Your wishlist is empty</h4>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    Explore our collection and click the heart icon on any gift to save it here.
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF5733] text-white text-xs font-bold hover:bg-[#e04826] transition-all"
                  >
                    <span>Browse All Gifts</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-4 rounded-2xl border border-stone-200 hover:border-stone-300 transition-all flex gap-3 relative group bg-stone-50/50"
                    >
                      <img
                        src={prod.images?.[0] || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop"}
                        alt={prod.title}
                        className="w-20 h-20 rounded-xl object-cover shrink-0 border border-stone-200"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-stone-900 truncate">
                            {prod.title}
                          </h4>
                          <span className="text-xs font-black text-[#FF5733] mt-1 block">
                            {formatCurrency(prod.base_price)}
                          </span>
                        </div>
                        <div className="pt-2 flex items-center gap-2">
                          <Link
                            href={`/products/${prod.slug}`}
                            className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-[11px] transition-colors"
                          >
                            Customize & Order
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleRemoveWishlist(prod.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
