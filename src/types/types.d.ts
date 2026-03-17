import { StaticImageData } from "next/image";
import { JSX, ReactNode, ChangeEvent } from "react";

export type ProductSectionProps = {
  title: string;
  variant: "flash-sale" | "new-arrival" | "best-selling";
  products: Product[];
};

export type ProductSectionVariant = "promotion" | "recency" | "popularity";

declare interface AddProductOrderProps {
  image: StaticImageData | string;
  name?: string;
  brand?: string;
  inventory?: number;
  price?: number;
  sales?: number;
  status?:
    | "Active"
    | "Finish"
    | "Completed"
    | "Pending"
    | "Delivered"
    | "Cancelled";
  action?: JSX.Element;
  orderId?: string;
  customer?: string;
  created_At?: string;
  total?: string;
  title?: string;
}

declare interface CustomerProps {
  image: StaticImageData;
  name: string;
  email: string;
  orders: number;
  spend: string;
  joined: string;
  location: string;
  action: JSX.Element;
}

declare type Product = {
  id: number;
  title?: string;
  description?: string;
  image: StaticImageData | string;
  date?: number;
  category?: string;
  author?: string;
  price?: number;
};



declare type Category = {
  id: string;
  name: string;
  children: Category[] | string[];
};

type CategoryNode = {
  id: string;
  name: string;
  children?: CategoryNode[];
};

type BillingPlan = "monthly" | "yearly";

interface SubscriptionComponentProps {
  plan: "monthly" | "yearly";
  isActive: boolean;
  isPopular: boolean;
  onClick: () => void;
  id: string;
  popular: boolean;
  packageName: string;
  text: string;
  prices: {
    plan: string;
    duration: string;
    price: number;
  }[];
  tile: string;
  includes: IncludeItem[];
}

export interface IncludeItem {
  package: string;
  icon: ReactNode;
  status: string;
}

declare interface SubscriptionPlanProps {
  selectedPlanId?: string;
  onPlanSelect?: (planId: string) => void;
  linkToRegister?: boolean;
}

declare interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  className?: string;
  name?: string;
  id?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

type RegisterPayload = UserProps | null;

declare type StoreProviderProps = {
  children: React.ReactNode;
  user: UserProps | null;
};

declare type CTAProps = {
  text?: string;
  title?: string;
  desc?: string;
  image: StaticImageData;
  className?: string;
};

declare type ShowProductProps = {
  showAddProduct: boolean;
  setShowAddProduct: React.Dispatch<React.SetStateAction<boolean>>;
};

declare interface NavbarLinkPorps {
  href: string;
  label: string;
}

// export interface SellFormData {
//   title: string;
//   category: string;
//   categoryChild: string;
//   images: (File | null)[];

//   region: string;
//   city: string;
//   description: string;
//   phone: string;
//   price: string;
//   name: string;
// }

export interface SellFormData {
  title: string;

  category: string;
  subcategory: string;
  type: string;

  images: (File | string | null)[];

  region: string;
  city: string;

  description: string;

  price: string;

  name: string;
  phone: string;
}

export interface StepProps {
  data: SellFormData;
  updateField: <K extends keyof SellFormData>(
    field: K,
    value: SellFormData[K],
  ) => void;
  onNext: () => void;
  onBack?: () => void;
  errors?: Record<string, string>;
}

export interface LoginResponseProp {
  message: string;
  accessToken: string;
  user: UserProp;
}

export interface RegisterResponseProp {
  message: string;
  user: {
    username: string;
    email: string;
    phone: string;
    role: string;
    profilePicture?: string;
  };
}

declare interface CartItemProp {
  id?: string;
  title?: string;
  price: number;
  category: string;
  image: string | StaticImageData;
  amount: number;
  status?: 'pending' | 'delivered' | 'cancelled'
}

declare interface UserProp {
  username?: string;
  email?: string;
  phone?: string;
  role?: string;
  country?: string;
  state?: string;
  profilePicture?: string;
  cartItems?: CartItemProp[];
}


declare interface CardComponentProps {
  item: ProductProps;
  index: number;
  quantity?: number;
}

export interface ProductProps {
  id: string;

  title: string;
  description: string;

  price: number;

  category: "marketplace" | "apartment" | "food";
  subCategory: string;

  images: StaticImageData[] | string[];

  location: {
    country: string;
    state: string;
    city?: string;
  };

  seller: {
    id: string;
    name: string;
    phone: string;
  };

  rating?: number;
  reviews?: number;

  createdAt?: string;
  updatedAt?: string;

  details: MarketplaceDetails | ApartmentDetails | FoodDetails;
}

export interface MarketplaceDetails {
  brand?: string;
  condition: "new" | "used";
  stock?: number;
  warranty?: string;
}

export interface ApartmentDetails {
  bedrooms: number;
  bathrooms: number;
  furnished: boolean;
  parking: boolean;
  propertyType: "apartment" | "house" | "studio" | "hostel";
  size?: number;
}

export interface FoodDetails {
  restaurantName: string;
  preparationTime?: number;
  isVegetarian?: boolean;
  ingredients?: string[];
}