export interface CustomTextField {
  id: string;
  label: string;
  max_chars?: number;
  placeholder?: string;
  price_addon?: number;
  default_font?: string;
  default_color?: string;
  x?: number; // % position for preview overlay
  y?: number; // % position for preview overlay
  font_size?: number;
}

export interface CustomImageUploadConfig {
  enabled: boolean;
  label?: string;
  helper_text?: string;
  price_addon?: number;
  x?: number; // %
  y?: number; // %
  width?: number; // %
  height?: number; // %
}

export interface CustomAddon {
  id: string;
  label: string;
  price: number;
}

export interface CustomizationConfig {
  template_mockup_url?: string;
  preview_aspect_ratio?: string;
  text_fields?: CustomTextField[];
  fonts?: string[];
  colors?: string[];
  image_upload?: CustomImageUploadConfig;
  addons?: CustomAddon[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  title: string;
  sku?: string;
  price: number;
  compare_at_price?: number;
  stock: number;
  options?: Record<string, string>;
  image_url?: string;
  is_default?: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  category_id?: string;
  base_price: number;
  compare_at_price?: number;
  images: string[];
  is_customizable: boolean;
  customization_config: CustomizationConfig;
  stock: number;
  sku?: string;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_bestseller: boolean;
  is_active: boolean;
  created_at?: string;
  variants?: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  icon_name?: string;
  display_order?: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  button_text?: string;
  link_url: string;
  image_url: string;
  bg_gradient?: string;
  display_order?: number;
}

export interface CustomizationSelection {
  texts: Record<string, string>; // field_id -> string
  selected_font: string;
  selected_color: string;
  uploaded_image_url?: string;
  uploaded_image_file?: File | null;
  selected_addons: string[]; // addon IDs
  preview_screenshot?: string;
}

export interface CartItem {
  id: string; // unique item uuid in cart
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  customization: CustomizationSelection;
  unit_price: number;
  total_price: number;
}

export interface OrderItem {
  id?: string;
  product_id?: string;
  variant_id?: string;
  product_title: string;
  variant_title?: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  image_url?: string;
  customization_data: {
    custom_texts?: Record<string, string>;
    font?: string;
    color?: string;
    uploaded_image_url?: string;
    addons?: string[];
  };
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: {
    full_name: string;
    phone: string;
    street_address: string;
    apartment?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  status: "pending" | "proof_review" | "in_production" | "shipped" | "delivered" | "cancelled";
  payment_status: "unpaid" | "paid" | "refunded" | "failed";
  payment_method: "cod" | "online" | "card" | "upi" | "mock";
  subtotal: number;
  discount: number;
  shipping_fee: number;
  tax: number;
  total: number;
  coupon_code?: string;
  gift_message?: string;
  notes?: string;
  tracking_number?: string;
  shipping_carrier?: string;
  created_at: string;
  items?: OrderItem[];
}

export interface Coupon {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: "customer" | "admin" | "staff";
}
