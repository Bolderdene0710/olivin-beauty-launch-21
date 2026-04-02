import { createClient } from '@supabase/supabase-js';

// 1. Supabase клиент эхлүүлэх
// Lovable болон локал орчны .env-ээс мэдээллийг автоматаар уншина
const supabaseUrl = "https://actmbbplproqbphfdeiv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjdG1iYnBscHJvcWJwaGZkZWl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3ODUwMTMsImV4cCI6MjA4OTM2MTAxM30.hNf2HS6LfMWP752fmpEBBggn_GcsYF6CbzjGfJETaMA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/*
 * 2. БАРААНЫ ХУВИЛБАР ТАТАХ ФУНКЦ
 * Барааны үндсэн мэдээлэл болон түүнд хамаарах бүх хувилбаруудыг (variants) нэг дор татна.
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
 * 3. ЗАХИАЛГА ХАДГАЛАХ ФУНКЦ
 * Бидний гараар нэмсэн (district, khoroo, detailed_address) багануудад зориулагдсан.
 * Record<string, unknown> ашиглан TypeScript-ийн 'any' алдааг засав.
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
