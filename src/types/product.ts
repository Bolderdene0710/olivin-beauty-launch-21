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
  price: string;
  priceNumber: number;
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
  is_active: boolean;
  display_order: number;
  created_at: string;
}

const PLACEHOLDER_IMAGE = "/placeholder.svg";

export function mapProductRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.title,
    brand: row.brand ?? "",
    price: `${row.price.toLocaleString()}₮`,
    priceNumber: row.price,
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
