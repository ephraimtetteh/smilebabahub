import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { AiOutlineExclamationCircle } from "react-icons/ai";

export const packages = [
  {
    id: 'Basic',
    packageName: "smile",
    text: "perfect for small business just getting started",
    popular: false,
    prices: [
      {
        plan: "month",
        duration: "monthly",
        price: 0.0,
      },
      {
        plan: "year",
        duration: "yearly",
        price: 0.0,
      },
    ],
    tile: "what's included",
    includes: [
      {
        package: "1 Listing",
        icon:IoCheckmarkCircleOutline,
        status: "yes",
      },
      {
        package: "duration: 3 days",
        icon:IoCheckmarkCircleOutline,
        status: "yes",
      },
      {
        package: "dashboard partial access",
        icon:IoCheckmarkCircleOutline,
        status: "yes",
      },
      {
        package: "statics partial access",
        icon:IoCheckmarkCircleOutline,
        status: "yes",
      },
      {
        package: "radio ads",
        icon: AiOutlineExclamationCircle,
        status: "no",
      },
      { package: "TV ads", icon: AiOutlineExclamationCircle, status: "no" },
      {
        package: "social media ads",
        icon: AiOutlineExclamationCircle,
        status: "no",
      },
    ],
  },
  {
    id: "standard",
    popular: false,
    packageName: "basicSmile",
    text: "perfect for small business just getting started",
    prices: [
      {
        plan: "month",
        duration: "monthly",
        price: 49.99,
      },
      {
        plan: "year",
        duration: "yearly",
        price: 599.88,
      },
    ],
    tile: "what's included",
    includes: [
      {
        package: "5 Listing",
        icon: IoCheckmarkCircleOutline,
      },
      {
        package: "duration: 3 days",
        icon: IoCheckmarkCircleOutline,
      },
      {
        package: "dashboard partial access",
        icon: IoCheckmarkCircleOutline,
        status: "yes",
      },
      {
        package: "statics partial access",
        icon: IoCheckmarkCircleOutline,
        status: "yes",
      },
      {
        package: "radio ads",
        icon: IoCheckmarkCircleOutline,
        status: "yes",
      },
      {
        package: "TV ads",
        icon: IoCheckmarkCircleOutline,
        status: "yes",
      },
      {
        package: "social media ads",
        icon: IoCheckmarkCircleOutline,
        status: "yes",
      },
    ],
  },
  {
    id: "popular",
    popular: true,
    packageName: "happySmile",
    text: "perfect for small business just getting started",
    prices: [
      {
        plan: "month",
        duration: "monthly",
        price: 74.99,
      },
      {
        plan: "year",
        duration: "yearly",
        price: 899.99,
      },
    ],
    tile: "what's included",
    includes: [
      {
        package: "10 Listing",
        icon: IoCheckmarkCircleOutline,
        status: "yes",
      },
      {
        package: "duration: 30 days",
        icon: IoCheckmarkCircleOutline,
        status: "yes",
      },
      {
        package: "dashboard partial access",
        icon: IoCheckmarkCircleOutline,
        status: "yes",
      },
      {
        package: "statics partial access",
        icon: IoCheckmarkCircleOutline,
        status: "yes",
      },
      {
        package: "radio ads",
        icon: IoCheckmarkCircleOutline,
        status: "yes"
      },
      {
        package: "TV ads",
        icon: IoCheckmarkCircleOutline,
        status: "yes",
      },
      {
        package: "social media ads",
        icon: IoCheckmarkCircleOutline,
        status: "yes",
      },
    ],
  },
  {
    id: "premium",
    popular: false,
    packageName: "superSmile",
    text: "perfect for small business just getting started",
    prices: [
      {
        plan: "month",
        duration: "monthly",
        price: 99.99,
      },
      {
        plan: "year",
        duration: "yearly",
        price: 1199.0,
      },
    ],
    tile: "what's included",
    includes: [
      {
        package: "10 Listing",
        icon: IoCheckmarkCircleOutline ,
        status: "yes",
      },
      {
        package: "duration: 30 days",
        icon: IoCheckmarkCircleOutline ,
        status: "yes",
      },
      {
        package: "dashboard partial access",
        icon: IoCheckmarkCircleOutline ,
        status: "yes",
      },
      {
        package: "statics partial access",
        icon: IoCheckmarkCircleOutline ,
        status: "yes",
      },
      {
        package: "radio ads",
        icon: IoCheckmarkCircleOutline,
        status: "yes",
      },
      {
        package: "TV ads",
        icon: IoCheckmarkCircleOutline ,
        status: "yes",
      },
      {
        package: "social media ads",
        icon: IoCheckmarkCircleOutline ,
        status: "yes",
      },
    ],
  },
];
