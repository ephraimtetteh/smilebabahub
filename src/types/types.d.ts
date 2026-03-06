import { StaticImageData } from "next/image";
import { JSX, ReactNode, ChangeEvent } from "react";

export type ProductSectionProps = {
  title: string;
  variant: "flash-sale" | "new-arrival" | "best-selling";
  products: Product[];
};


export type ProductSectionVariant =
  | "promotion"
  | "recency"
  | "popularity";


  declare interface AddProductOrderProps {
    image: StaticImageData | string
    name?: string
    brand?: string
    inventory?: number
    price?: number
    sales?: number
    status?: 'Active'| 'Finish' | 'Completed' | 'Pending' | 'Delivered' | 'Cancelled'
    action?: JSX.Element
    orderId?: number,
    customer?: string,
    created_At?: string
    total?: string
    title?: string
  }

  declare interface CustomerProps {
    image: StaticImageData,
    name: string,
    email: string,
    orders: number
    spend: string
    joined: string
    location: string
    action: JSX.Element
  }

  
  
  declare type Product = {
    id: number ;
    title?: string;
    description?: string;
    image: StaticImageData | string;
    date?: number;
    category?: string;
    author?: string;
    price?: number;
  };

  declare interface CardComponentProps {
    item: Product
    index: number;
    quantity?: number;
  }

  declare type Category = {
    id: string;
    name: string;
    children: Category[] | string[];
  }

  declare type FormProps = {
    onNext: () => void;
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
  };
  
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

  interface CartItem {
    _id: string;
    name: string;
    price: number;
    amount: number;
    image: StaticImageData
  }

  declare interface CartProps extends UserPorps {
    cartItems: CartItem[];
    total: number;
    amount: number;
  }
  

 

  type RegisterPayload = UserProps | null;

  declare type StoreProviderProps = {
    children: React.ReactNode;
    user: UserProps | null;
  };
  

  declare type CTAProps = {
    text?: string,
    title?: string,
    desc?: string,
    image: StaticImageData
    className?: string
  }

  declare type ShowProductProps = {
    showAddProduct: boolean;
    setShowAddProduct: React.Dispatch<React.SetStateAction<boolean>>;
  };

  declare interface NavbarLinkPorps {
    href: string;
    label: string;
  }