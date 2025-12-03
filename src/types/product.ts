// Database row type (matches Supabase schema)
export interface ProductRow {
  id: string;
  title: string;
  brand: string;
  price: number;
  image_url: string | null;
  category: string;
  description: string | null;
  ingredients: string[] | null;
  how_to_use: string | null;
  benefits: string[] | null;
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
  category: ProductCategory;
  description: string;
  ingredients: string[];
  howToUse: string;
  benefits: string[];
  reviews: Review[];
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

// Placeholder image for products without images
const PLACEHOLDER_IMAGE = "/placeholder.svg";

// Map database row to frontend product
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
    category,
    description: row.description || "",
    ingredients: row.ingredients || [],
    howToUse: row.how_to_use || "",
    benefits: row.benefits || [],
    reviews: [], // Reviews can be fetched separately if needed
  };
}
