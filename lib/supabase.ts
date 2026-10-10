import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== undefined &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "placeholder-anon-key"
  );
};

// Reachability Cache
let isReachable: boolean | null = null;
let lastCheckTime = 0;

export async function checkSupabaseReachability(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const now = Date.now();
  if (isReachable !== null && (now - lastCheckTime < 60000)) {
    return isReachable;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: "GET",
      headers: {
        apikey: supabaseAnonKey,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    isReachable = res.status >= 200 && res.status < 500;
  } catch (e) {
    isReachable = false;
  }

  lastCheckTime = Date.now();
  return isReachable;
}

// Custom Fetch with a 2-second timeout to abort hanging requests fast
const customFetch = (url: RequestInfo | URL, options?: RequestInit) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).then((res) => {
    clearTimeout(timeoutId);
    return res;
  }).catch((err) => {
    clearTimeout(timeoutId);
    throw err;
  });
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: customFetch },
});

export async function uploadCustomizationImage(file: File): Promise<string> {
  if (!isSupabaseConfigured() || !(await checkSupabaseReachability())) {
    // Return mock base64 data URL if Supabase is not yet connected
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `customizations/${fileName}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from("customization-uploads")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage.from("customization-uploads").getPublicUrl(filePath);
    return data.publicUrl;
  } catch (e) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
}
