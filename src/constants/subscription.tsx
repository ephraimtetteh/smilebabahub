// src/constants/subscription.tsx
// Subscription packages data.
// "as const" on duration and status narrows string literals so TypeScript
// knows duration is "monthly" | "yearly" (not just string) and status is
// "yes" | "no" — both required by SubscriptionComponentProps.

import React from "react";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { AiOutlineExclamationCircle } from "react-icons/ai";

export const packages = [
  {
    id: "Basic",
    packageName: "smile",
    text: "Perfect for small businesses just getting started",
    popular: false,
    prices: [
      { plan: "monthly", duration: "monthly" as const, price: 0.0 },
      { plan: "yearly", duration: "yearly" as const, price: 0.0 },
    ],
    tile: "what's included",
    includes: [
      {
        package: "1 Listing",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
      // {
      //   package: "Duration: 3 days",
      //   icon: <IoCheckmarkCircleOutline />,
      //   status: "yes" as const,
      // },
      {
        package: "Dashboard partial access",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
      {
        package: "Statistics partial access",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
      {
        package: "Radio ads",
        icon: <AiOutlineExclamationCircle />,
        status: "no" as const,
      },
      {
        package: "TV ads",
        icon: <AiOutlineExclamationCircle />,
        status: "no" as const,
      },
      {
        package: "Social media ads",
        icon: <AiOutlineExclamationCircle />,
        status: "no" as const,
      },
    ],
  },
  {
    id: "standard",
    popular: false,
    packageName: "basicSmile",
    text: "Perfect for small businesses just getting started",
    prices: [
      { plan: "monthly", duration: "monthly" as const, price: 249.99 },
      { plan: "yearly", duration: "yearly" as const, price: 1199.99 },
    ],
    tile: "what's included",
    includes: [
      {
        package: "1-3 Listings",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
      {
        package: "Ads Duration: 7 days",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
      {
        package: "Dashboard partial access",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
      {
        package: "Statistics partial access",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
      {
        package: "Radio ads",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
      {
        package: "TV ads",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
      {
        package: "Social media ads",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
    ],
  },
  {
    id: "popular",
    popular: true,
    packageName: "happySmile",
    text: "Perfect for growing businesses",
    prices: [
      { plan: "monthly", duration: "monthly" as const, price: 249.99 },
      { plan: "yearly", duration: "yearly" as const, price: 2999.88 },
    ],
    tile: "what's included",
    includes: [
      {
        package: "1-5 Listings",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
      {
        package: "Ads Duration: 14 days",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
      {
        package: "Dashboard full access",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
      {
        package: "Statistics full access",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
      {
        package: "Radio ads",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
      {
        package: "TV ads",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
      {
        package: "Social media ads",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
    ],
  },
  {
    id: "premium",
    popular: false,
    packageName: "superSmile",
    text: "For established businesses that want maximum reach",
    prices: [
      { plan: "monthly", duration: "monthly" as const, price: 499.99 },
      { plan: "yearly", duration: "yearly" as const, price: 5999.0 },
    ],
    tile: "what's included",
    includes: [
      {
        package: "Unlimited Listings",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
      {
        package: "Ads Duration: 30 days",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
      {
        package: "Dashboard full access",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
      {
        package: "Statistics full access",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
      {
        package: "Radio ads",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
      {
        package: "TV ads",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
      {
        package: "Social media ads",
        icon: <IoCheckmarkCircleOutline />,
        status: "yes" as const,
      },
    ],
  },
];
