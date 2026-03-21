import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---- Types ----

export interface ProductVariant {
  id: string;
  product_id: string;
  variant_name: string;
  variant_type: string;
  price_adjustment: number;
  sku: string | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
}

export interface ProductWithVariants {
  id: string;
  title: string;
  brand: string;
  price: number;
  image_url: string | null;
  images: string[] | null;
  category: string;
  category_id: string | null;
  description: string | null;
  ingredients: string[] | null;
  how_to_use: string | null;
  benefits: string[] | null;
  badges: string[] | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string | null;
  product_variants: ProductVariant[];
}

export interface ManualOrderData {
  order_number: string;
  customer_name: string;
  customer_email: string;
  phone_number: string;
  district: string;
  khoroo: string;
  detailed_address: string;
  total_amount: number;
  status: string;
  items: unknown;
}

// ---- API Functions ----

export async function fetchProductWithVariants(productId: string): Promise<ProductWithVariants | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("id", productId)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as ProductWithVariants | null;
}

export async function fetchAllProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true);

  if (error) throw error;
  return data;
}

export async function createManualOrder(orderData: ManualOrderData) {
  const { data, error } = await supabase
    .from("orders")
    .insert([orderData]);

  if (error) throw error;
  return data;
}
