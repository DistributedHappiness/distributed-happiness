"use server";

import { supabase, isSupabaseConfigured } from "./supabase";
import { Product, Category, Banner } from "./types";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BANNERS } from "./mock-data";
import { createClient } from "@supabase/supabase-js";

// Dedicated admin client for server-side API calls to bypass RLS policies
const getAdminSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
};

export async function getProducts(): Promise<Product[]> {
  try {
    if (isSupabaseConfigured()) {
      const adminSupabase = getAdminSupabase();
      const { data, error } = await adminSupabase
        .from("products")
        .select(`
          *,
          variants:product_variants(*)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Product[];
      }
    }
  } catch (err) {
    console.warn("Supabase fetch products error, using fallback data:", err);
  }
  return MOCK_PRODUCTS;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    if (isSupabaseConfigured()) {
      const adminSupabase = getAdminSupabase();
      const { data, error } = await adminSupabase
        .from("products")
        .select(`
          *,
          variants:product_variants(*)
        `)
        .eq("slug", slug)
        .single();

      if (!error && data) {
        return data as Product;
      }
    }
  } catch (err) {
    console.warn("Supabase fetch product by slug error:", err);
  }
  const fallback = MOCK_PRODUCTS.find((p) => p.slug === slug);
  return fallback || null;
}

export async function getCategories(): Promise<Category[]> {
  try {
    if (isSupabaseConfigured()) {
      const adminSupabase = getAdminSupabase();
      const { data, error } = await adminSupabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    }
  } catch (err) {
    console.warn("Supabase fetch categories error, using fallback data:", err);
  }
  return MOCK_CATEGORIES;
}

export async function getBanners(): Promise<Banner[]> {
  try {
    if (isSupabaseConfigured()) {
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
