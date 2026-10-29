// Single source of truth for store contact & policy facts shown across the site.
// Values match the seeded FAQ answers (supabase/migrations/*_seed_faqs.sql) — update both together.

export const STORE_CONTACT = {
  phone: "7700-8686",
  phoneHref: "tel:+97677008686",
  email: "info@olivin.mn",
  hours: "Ажлын өдөр 09:00 – 18:00",
};

export const STORE_BANK = {
  bank: "Хаан Банк",
  accountName: "OLIVIN LLC",
  accountNumber: "5037716403",
};

export const STORE_POLICY = {
  deliveryCity: "1–3 өдөр",
  deliveryCountryside: "3–7 өдөр",
  returnDays: 7,
};
