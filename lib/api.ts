"use server";

import { isSupabaseConfigured, checkSupabaseReachability } from "./supabase";
import { Product, Category, Banner } from "./types";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BANNERS } from "./mock-data";
import { createClient } from "@supabase/supabase-js";

// Dedicated admin client for server-side API calls to bypass RLS policies
const getAdminSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  
  // Custom fetch with 2-second timeout
  const customFetch = (fetchUrl: RequestInfo | URL, options?: RequestInit) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    return fetch(fetchUrl, {
      ...options,
      signal: controller.signal
    }).then((res) => {
      clearTimeout(timeoutId);
      return res;
    }).catch((err) => {
      clearTimeout(timeoutId);
      throw err;
    });
  };

  return createClient(url, key, {
    global: { fetch: customFetch }
  });
};

export async function getProducts(): Promise<Product[]> {
  try {
    if (isSupabaseConfigured() && await checkSupabaseReachability()) {
      const adminSupabase = getAdminSupabase();
      const { data, error } = await adminSupabase
        .from("products")
        .select(`
          *,
          variants:product_variants(*)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase Error [getProducts]:", error);
      } else if (data && data.length > 0) {
        return data as Product[];
      }
    }
  } catch (err) {
    console.error("Exception [getProducts]:", err);
  }
  return MOCK_PRODUCTS;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    if (isSupabaseConfigured() && await checkSupabaseReachability()) {
      const adminSupabase = getAdminSupabase();
      const { data, error } = await adminSupabase
        .from("products")
        .select(`
          *,
          variants:product_variants(*)
        `)
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Supabase Error [getProductBySlug]:", error);
      } else if (data) {
        return data as Product;
      }
    }
  } catch (err) {
    console.error("Exception [getProductBySlug]:", err);
  }
  const fallback = MOCK_PRODUCTS.find((p) => p.slug === slug);
  return fallback || null;
}

export async function getCategories(): Promise<Category[]> {
  try {
    if (isSupabaseConfigured() && await checkSupabaseReachability()) {
      const adminSupabase = getAdminSupabase();
      const { data, error } = await adminSupabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Supabase Error [getCategories]:", error);
      } else if (data && data.length > 0) {
        return data as Category[];
      }
    }
  } catch (err) {
    console.error("Exception [getCategories]:", err);
  }
  return MOCK_CATEGORIES;
}

export async function getBanners(): Promise<Banner[]> {
  try {
    if (isSupabaseConfigured() && await checkSupabaseReachability()) {
      const adminSupabase = getAdminSupabase();
      const { data, error } = await adminSupabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Banner[];
      }
    }
  } catch (err) {
    console.warn("Supabase fetch banners error, using fallback data:", err);
  }
  return MOCK_BANNERS;
}

export async function validateCoupon(code: string, subtotal: number) {
  try {
    if (isSupabaseConfigured() && (await checkSupabaseReachability())) {
      const adminSupabase = getAdminSupabase();
      const { data, error } = await adminSupabase
        .from("coupons")
        .select("*")
        .eq("code", code.trim().toUpperCase())
        .eq("is_active", true)
        .single();

      if (error || !data) {
        return { valid: false, message: "Invalid or inactive coupon code." };
      }
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return { valid: false, message: "This coupon has expired." };
      }
      if (data.min_order_amount && subtotal < data.min_order_amount) {
        return { valid: false, message: `Minimum order amount of ₹${data.min_order_amount} required.` };
      }
      if (data.usage_limit && (data.times_used || 0) >= data.usage_limit) {
        return { valid: false, message: "This coupon has reached its usage limit." };
      }

      const discount =
        data.discount_type === "percentage"
          ? Math.min((subtotal * data.discount_value) / 100, data.max_discount_amount || Infinity)
          : data.discount_value;

      return { valid: true, coupon: data, discount };
    }
  } catch (err) {
    console.error("Error validating coupon:", err);
  }

  // Fallback demo coupons for offline / local testing
  const upper = code.trim().toUpperCase();
  if (upper === "WELCOME10" || upper === "HAPPINESS" || upper === "SAVE10") {
    return {
      valid: true,
      coupon: { code: upper, discount_type: "percentage", discount_value: 10 },
      discount: Math.round(subtotal * 0.1),
    };
  }

  return { valid: false, message: "Invalid coupon code." };
}

export async function getOrderById(orderIdOrNumber: string) {
  try {
    if (isSupabaseConfigured() && (await checkSupabaseReachability())) {
      const adminSupabase = getAdminSupabase();
      const { data, error } = await adminSupabase
        .from("orders")
        .select("*, order_items(*)")
        .or(`order_number.eq.${orderIdOrNumber},id.eq.${orderIdOrNumber}`)
        .single();

      if (!error && data) {
        return { ...data, items: data.order_items };
      }
    }
  } catch (err) {
    console.error("Error fetching order by ID:", err);
  }
  return null;
}

export async function getOrdersByUser(userId: string) {
  try {
    if (isSupabaseConfigured() && (await checkSupabaseReachability())) {
      const adminSupabase = getAdminSupabase();
      const { data, error } = await adminSupabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((d: any) => ({ ...d, items: d.order_items }));
      }
    }
  } catch (err) {
    console.error("Error fetching orders by user:", err);
  }
  return [];
}

export async function getStoreSettings(key = "general") {
  try {
    if (isSupabaseConfigured() && (await checkSupabaseReachability())) {
      const adminSupabase = getAdminSupabase();
      const { data, error } = await adminSupabase
        .from("store_settings")
        .select("*")
        .eq("key", key)
        .single();

      if (!error && data?.value) {
        return data.value;
      }
    }
  } catch (err) {
    console.warn("Error fetching store settings, using defaults:", err);
  }
  return {
    store_name: "Distribute Happiness",
    contact_email: "support@distributehappiness.com",
    contact_phone: "+91 98765 43210",
    whatsapp_number: "919876543210",
    address: "123 Gift Street, Mumbai, Maharashtra, 400001",
    currency: "INR",
    tax_percentage: 5,
    free_shipping_threshold: 999,
    default_shipping_fee: 49,
    cod_enabled: true,
  };
}

