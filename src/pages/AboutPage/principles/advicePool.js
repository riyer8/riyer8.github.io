import personal from "./data/personal.json";
import ariana from "./data/ariana.json";
import products from "./data/products.json";

const CATEGORIES = [personal, ariana, products];

export const ADVICE_POOL = CATEGORIES.flatMap((category) =>
  (category.principles || [])
    .filter((entry) => String(entry.principle || "").trim())
    .map((entry) => ({
      quote: entry.principle.trim(),
      source: entry.source ? String(entry.source).trim() : "",
    }))
);
