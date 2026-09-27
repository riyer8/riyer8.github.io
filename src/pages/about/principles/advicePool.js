import personal from "./personal.json";
import ariana from "./ariana.json";
import products from "./products.json";

const CATEGORIES = [personal, ariana, products];

export const ADVICE_POOL = CATEGORIES.flatMap((category) =>
  (category.principles || [])
    .filter((entry) => String(entry.principle || "").trim())
    .map((entry) => ({
      quote: entry.principle.trim(),
      source: entry.source ? String(entry.source).trim() : "",
    }))
);
