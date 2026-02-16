import { StaticImageData } from "next/image";
import { JSX } from "react";

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
    image: StaticImageData
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
    id: number;
    title?: string;
    description?: string;
    image: StaticImageData | string;
    date?: number;
    category?: string;
    author?: string;
    price?: number;
  };

  declare interface CardComponentProps {
    // item: {
    //   image: string | StaticImageData;
    //   author: string;
    // };
    item: Product
    index: number;
    quantity?: number;
  }

  declare type Category = {
    id: string;
    name: string;
    children: {
      id: string;
      name: string;
      children: string[];
    }[];
  };

  declare type FormProps = {
    onNext: () => void;
  };

  type CategoryNode = {
    id: string;
    name: string;
    children?: CategoryNode[];
  };

  type BillingPlan = "monthly" | "yearly";

  interface SubscriptionComponentProps extends Subscriptions {
    plan: BillingPlan;
    isActive: boolean;
    isPopular: boolean
    onClick: () => void;
  }


  export interface Price {
    plan: "month" | "year";
    duration: "monthly" | "yearly";
    price: number;
  }

  export interface IncludeItem {
    package: string;
    icon: JSX.Element;
    status: "yes" | "no";
  }

  export interface Subscriptions {
    id: string;
    popular?: boolean;
    packageName?: string;
    text?: string;
    prices: Price[];
    className?: string;
    tile?: string;
    includes: IncludeItem[];
    onClick?: () => void;
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
    onChange: () => void;
  }

  interface CartItem {
    _id: string;
    name: string;
    price: number;
    amount: number;
    image: StaticImageData
  }
  

  declare interface UserProps { 
    cartItems: CartItem[]; 
    total: number; 
    amount: number; 
    isLoading: boolean; 
    token: null; 
    name: string; 
    _id: string; 
    email: string; 
  }

  interface InitialState {
    user: UserProps;
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

  