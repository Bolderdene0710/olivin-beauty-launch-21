import { createClient } from '@supabase/supabase-js';

// ProductVariant type matching product_variants table
export interface ProductVariant {
  id: string;
  option_name: string;
  variant_name?: string;
  variant_type?: string;
  stock: number;
  stock_quantity?: number;
  price_adjustment: number;
  is_active?: boolean;
  sku?: string;
}

// Supabase клиент — OLIVIN external project
const supabaseUrl = "https://actmbbplproqbphfdeiv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdG1iYnBscHJvcWJwaGZkZWl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3ODUwMTMsImV4cCI6MjA4OTM2MTAxM30.hNf2HS6LfMWP752fmpEBBggn_GcsYF6CbzjGfJETaMA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/*
 * БАРААНЫ ХУВИЛБАР ТАТАХ ФУНКЦ
 */
export const fetchProductWithVariants = async (productId: string) => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_variants (
        id,
        option_name,
        stock,
        price_adjustment
      )
    `)
    .eq('id', productId)
    .single();

  if (error) {
    console.error("Барааны мэдээлэл татахад алдаа гарлаа:", error);
    throw error;
  }
  return data;
};

/*
 * ЗАХИАЛГА ХАДГАЛАХ ФУНКЦ
 */
export const createManualOrder = async (orderData: Record<string, unknown>) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select();

  if (error) {
    console.error("Захиалга хадгалахад алдаа гарлаа:", error);
    throw error;
  }
  return data;
};
