// Database row type (matches Supabase schema)
export interface ProductRow {
  id: string;
  title: string;
  brand: string;
  price: number;
  image_url: string | null;
  category: string;
  category_id: string | null;
  description: string | null;
  ingredients: string[] | null;
  how_to_use: string | null;
  benefits: string[] | null;
  images: string[] | null;
  badges: string[] | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string | null;
}

// Frontend product type
export type ProductCategory = "Serums" | "Toners" | "Creams" | "Cleansers";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: string;
  priceNumber: number;
  image: string;
  images: string[];
  category: ProductCategory;
  categoryId: string | null;
  description: string;
  ingredients: string[];
  howToUse: string;
  benefits: string[];
  badges: string[];
  stockQuantity: number;
  isActive: boolean;
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
  slug: string;
  image: string | null;
  is_active: boolean;
  created_at: string;
}

export interface BannerRow {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  link: string | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
}

const PLACEHOLDER_IMAGE = "/placeholder.svg";

export function mapProductRowToProduct(row: ProductRow): Product {
  const validCategories: ProductCategory[] = ["Serums", "Toners", "Creams", "Cleansers"];
  const category = validCategories.includes(row.category as ProductCategory)
    ? (row.category as ProductCategory)
    : "Serums";

  return {
    id: row.id,
    name: row.title,
    brand: row.brand,
    price: `${row.price.toLocaleString()}₮`,
    priceNumber: row.price,
    image: row.image_url || PLACEHOLDER_IMAGE,
    images: row.images || [],
    category,
    categoryId: row.category_id,
    description: row.description || "",
    ingredients: row.ingredients || [],
    howToUse: row.how_to_use || "",
    benefits: row.benefits || [],
    badges: row.badges || [],
    stockQuantity: row.stock_quantity ?? 0,
    isActive: row.is_active ?? true,
    reviews: [],
  };
}
