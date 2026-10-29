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
      categories(name),
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
// No .select() after insert: guests have no SELECT access to orders (see secure_orders migration).
export const createManualOrder = async (orderData: Record<string, unknown>) => {
  const { error } = await supabase.from('orders').insert([orderData]);

  if (error) {
    console.error("Захиалга хадгалахад алдаа гарлаа:", error);
    throw error;
  }
};

/*
 * ЗАХИАЛГА ДУГААРААР ХАЙХ ФУНКЦ
 * Owner/admin get the full row through RLS; everyone else gets the masked
 * row from get_order_by_number() (no email or street address).
 */
export interface OrderLookup {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  items: Array<{ id?: string; name: string; quantity: number; price: number }>;
  created_at: string;
  district: string | null;
  khoroo: string | number | null;
  customer_name: string;
  phone_number: string;
  customer_email?: string | null;
  detailed_address?: string | null;
  promo_code?: string | null;
  discount_amount?: number | null;
}

export const fetchOrderByNumber = async (orderNumber: string): Promise<OrderLookup | null> => {
  const trimmed = orderNumber.trim();

  const { data: full } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', trimmed)
    .maybeSingle();
  if (full) return full as OrderLookup;

  const { data, error } = await supabase.rpc('get_order_by_number', { p_order_number: trimmed });
  if (error) throw error;
  return ((data as OrderLookup[] | null)?.[0] as OrderLookup | undefined) ?? null;
};
