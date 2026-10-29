// Database row type (matches actual Supabase schema)
export interface ProductRow {
  id: string;
  title: string;
  price: number;
  sale_price: number | null;
  sku: string | null;
  barcode: string | null;
  image_url: string | null;
  image_urls: string[] | null;
  description: string | null;
  tags: string[] | null;
  category_id: string | null;
  stock_quantity: number;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  brand: string | null;
  ingredients: string[] | null;
  how_to_use: string | null;
  benefits: string[] | null;
  // Joined from categories(name) via select("*, categories(name)")
  categories?: { name: string } | null;
}

// Category name is now dynamic (admin-managed), so it's just a string.
export type ProductCategory = string;

export interface Product {
  id: string;
  name: string;
  brand: string;
  // price/priceNumber are what the customer pays (sale price when on sale)
  price: string;
  priceNumber: number;
  // Original price, set only while the product is on sale
  compareAtPrice: string | null;
  compareAtPriceNumber: number | null;
  discountPercent: number | null;
  image: string;
  images: string[];
  category: string;
  categoryId: string | null;
  description: string;
  ingredients: string[];
  howToUse: string;
  benefits: string[];
  badges: string[];
  stockQuantity: number;
  isActive: boolean;
  createdAt: string | null;
  reviews: Review[];
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string | null;
}

export interface BannerRow {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  button_link: string | null;
  button_text?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

const PLACEHOLDER_IMAGE = "/placeholder.svg";

export const formatPrice = (n: number) => `${n.toLocaleString()}₮`;

// A sale only counts when sale_price is set and actually below price
export function getSalePricing(price: number, salePrice: number | null | undefined) {
  const onSale = salePrice != null && salePrice >= 0 && salePrice < price;
  return {
    effective: onSale ? Number(salePrice) : price,
    compareAt: onSale ? price : null,
    discountPercent: onSale ? Math.round(((price - Number(salePrice)) / price) * 100) : null,
  };
}

export function mapProductRowToProduct(row: ProductRow): Product {
  const pricing = getSalePricing(row.price, row.sale_price);
  return {
    id: row.id,
    name: row.title,
    brand: row.brand ?? "",
    price: formatPrice(pricing.effective),
    priceNumber: pricing.effective,
    compareAtPrice: pricing.compareAt != null ? formatPrice(pricing.compareAt) : null,
    compareAtPriceNumber: pricing.compareAt,
    discountPercent: pricing.discountPercent,
    image: row.image_url || PLACEHOLDER_IMAGE,
    images: row.image_urls || [],
    category: row.categories?.name ?? "",
    categoryId: row.category_id,
    description: row.description || "",
    ingredients: row.ingredients ?? [],
    howToUse: row.how_to_use ?? "",
    benefits: row.benefits ?? [],
    badges: row.tags || [],
    stockQuantity: row.stock_quantity ?? 0,
    isActive: row.is_active ?? true,
    createdAt: row.created_at,
    reviews: [],
  };
}
