// src/types/product.types.ts
// All product-related types — mirrors your backend product/listing model

export type ProductCurrency = "GHS" | "NGN";
export type ProductCountry = "Ghana" | "Nigeria";

export type ProductImage = {
  url: string;
  isCover?: boolean;
  publicId?: string | null;
};

export type ProductLocation = {
  country?: ProductCountry;
  countryCode?: string;
  region?: string;
  city?: string;
  address?: string;
};

export type ProductSeller = {
  _id: string;
  name?: string;
  username?: string;
  profilePicture?: string;
  phone?: string;
};

export type Product = {
  _id: string;
  id?: string; // alias for _id (legacy support)
  title: string;
  description?: string;
  category: string; // "marketplace" | "food" | "apartments"
  subcategory?: string;
  images: (string | ProductImage)[]; // supports both string[] and object[]
  price: number;
  currency: ProductCurrency;
  priceDisplay?: string; // pre-formatted e.g. "₵1,200"
  location?: ProductLocation;
  seller?: ProductSeller;
  rating?: number;
  views?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductsMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
};

export type ProductFilters = {
  category?: string;
  sub?: string;
  country?: ProductCountry;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "popular";
  page?: number;
  limit?: number;
  featured?: boolean;
};

export type GetProductsResponse = {
  products: Product[];
  meta: ProductsMeta;
};

// Helper — normalise the mixed image format to a plain URL string
export function getImageUrl(
  img: string | ProductImage | null | undefined,
): string {
  if (!img) return "";
  if (typeof img === "string") return img;
  return img.url ?? "";
}

// Helper — get cover image URL from product
export function getCoverImage(product: Product): string {
  if (!product.images?.length) return "";
  const cover = product.images.find(
    (img) => typeof img === "object" && img.isCover,
  );
  return getImageUrl((cover ?? product.images[0]) as string | ProductImage);
}
