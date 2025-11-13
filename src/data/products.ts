import productSerum from "@/assets/product-serum.jpg";
import productToner from "@/assets/product-toner.jpg";
import productCream from "@/assets/product-cream.jpg";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: string;
  priceNumber: number;
  image: string;
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

export const products: Product[] = [
  {
    id: "torriden-serum",
    name: "Dive-In Low Molecular Hyaluronic Acid Serum",
    brand: "Torriden",
    price: "89,000₮",
    priceNumber: 89000,
    image: productSerum,
    description: "A lightweight, fast-absorbing serum packed with 5 types of hyaluronic acid to deliver intense hydration deep into the skin. Perfect for all skin types, especially dehydrated and sensitive skin.",
    ingredients: [
      "Water",
      "Butylene Glycol",
      "Glycerin",
      "Sodium Hyaluronate (5 types)",
      "Panthenol",
      "Allantoin",
      "Trehalose",
      "Betaine",
    ],
    howToUse: "After cleansing and toning, apply 2-3 drops to your face. Gently pat until fully absorbed. Follow with moisturizer. Use morning and night.",
    benefits: [
      "Deep hydration with 5 types of hyaluronic acid",
      "Plumps and smooths skin texture",
      "Strengthens skin barrier",
      "Suitable for sensitive skin",
    ],
    reviews: [
      {
        id: 1,
        author: "Sarah K.",
        rating: 5,
        date: "2024-01-15",
        comment: "Amazing product! My skin feels so hydrated and plump. I've been using it for 2 weeks and already see a difference.",
      },
      {
        id: 2,
        author: "Nandin B.",
        rating: 5,
        date: "2024-01-10",
        comment: "Best serum I've ever used. Light texture, absorbs quickly, and doesn't leave any sticky feeling.",
      },
      {
        id: 3,
        author: "Emma T.",
        rating: 4,
        date: "2024-01-05",
        comment: "Great hydrating serum! Works well under makeup. Only wish the bottle was bigger.",
      },
    ],
  },
  {
    id: "roundlab-toner",
    name: "1025 Dokdo Toner",
    brand: "Round Lab",
    price: "79,000₮",
    priceNumber: 79000,
    image: productToner,
    description: "A hydrating toner enriched with deep sea water from Ulleungdo Island. Balances skin's pH levels while providing minerals and moisture. Ideal for all skin types, particularly dry and sensitive skin.",
    ingredients: [
      "Sea Water (74.68%)",
      "Butylene Glycol",
      "Glycerin",
      "Pentylene Glycol",
      "Propanediol",
      "Chondrus Crispus Extract",
      "Saccharum Officinarum Extract",
      "Panthenol",
    ],
    howToUse: "After cleansing, pour a small amount onto your hands or cotton pad. Gently pat or swipe across face and neck. Can be used morning and evening.",
    benefits: [
      "Balances skin pH",
      "Provides deep hydration",
      "Rich in minerals from deep sea water",
      "Soothes irritated skin",
    ],
    reviews: [
      {
        id: 1,
        author: "Lisa M.",
        rating: 5,
        date: "2024-01-18",
        comment: "This toner is a game changer! So soothing and hydrating. My skin loves it.",
      },
      {
        id: 2,
        author: "Oyunaa D.",
        rating: 5,
        date: "2024-01-12",
        comment: "Perfect for the dry Mongolian winter. Keeps my skin hydrated all day.",
      },
    ],
  },
  {
    id: "illiyoon-cream",
    name: "Ceramide Ato Concentrate Cream",
    brand: "Illiyoon",
    price: "69,000₮",
    priceNumber: 69000,
    image: productCream,
    description: "A rich, nourishing cream formulated with ceramides to strengthen the skin barrier. Perfect for very dry, sensitive, or eczema-prone skin. Non-greasy formula absorbs quickly.",
    ingredients: [
      "Water",
      "Glycerin",
      "Butyrospermum Parkii (Shea) Butter",
      "Ceramide NP",
      "Panthenol",
      "Squalane",
      "Allantoin",
      "Tocopherol",
    ],
    howToUse: "Apply to clean, toned skin as the last step of your routine. Gently massage until absorbed. Can be used on face and body. Perfect for morning and night use.",
    benefits: [
      "Repairs and strengthens skin barrier",
      "Intensive moisture for dry skin",
      "Soothes irritation and redness",
      "Dermatologist-tested for sensitive skin",
    ],
    reviews: [
      {
        id: 1,
        author: "Michelle P.",
        rating: 5,
        date: "2024-01-20",
        comment: "Holy grail for dry skin! Rich but not heavy. My skin barrier has never been better.",
      },
      {
        id: 2,
        author: "Bolormaa S.",
        rating: 5,
        date: "2024-01-14",
        comment: "Perfect for our harsh winter. Keeps my skin protected and moisturized all day.",
      },
      {
        id: 3,
        author: "Anna K.",
        rating: 4,
        date: "2024-01-08",
        comment: "Very effective cream. A little goes a long way. Great value for money.",
      },
    ],
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};
