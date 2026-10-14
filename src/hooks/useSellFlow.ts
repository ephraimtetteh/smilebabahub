"use client";

// client/src/hooks/useSellFlow.ts
//
// The one place that decides what happens when someone wants to post.
//
// ─── THE LOOP THIS FIXES ─────────────────────────────────────────────
//
// The old version read isAuthenticated from Redux. That flag is false
// while restoreSession is still running, so the gate fired before auth
// had settled and pushed a signed-in user to /auth/login. The login page
// then saw isAuthenticated flip to true and pushed them back. Round and
// round.
//
// Better timing wouldn't have fixed it, only made it rarer. So this asks
// the server instead — it's the only thing that actually knows, and one
// call answers both questions:
//
//     401                  → not signed in
//     needsOnboarding true → signed in, no store yet
//     anything else        → go
//
// No Redux dependency, no race, no loop.
//
// ─── SAME SEQUENCE AS THE APP ────────────────────────────────────────
//
// mobile/src/app/(tabs)/sell.tsx does exactly this: check, route, done.
// No subscription guard in the path — createAd already enforces plan
// limits server-side and returns PLAN_LIMIT_REACHED with a proper
// message. Checking again here meant two round trips and a redirect to
// say something the form would have said anyway.

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/src/lib/api/axios";

export interface SellVertical {
  id: string;
  label: string;
  hint: string;
  /** The posting form, with the right category prefilled */
  href: string;
}

export const SELL_VERTICALS: SellVertical[] = [
  {
    id: "ecommerce",
    label: "Product",
    hint: "Phones, fashion, home",
    href: "/sell?category=ecommerce",
  },
  {
    id: "stays",
    label: "Place to stay",
    hint: "Apartments, short lets",
    href: "/sell?category=apartments",
  },
  {
    id: "food",
    label: "Food",
    hint: "Meals and catering",
    href: "/sell?category=food",
  },
  {
    id: "marketplace",
    label: "Anything else",
    hint: "Vehicles, jobs, services",
    href: "/sell?category=marketplace",
  },
];

export function useSellFlow(onDone?: () => void) {
  const router = useRouter();
  const [checking, setChecking] = useState<string | null>(null);

  const start = useCallback(
    async (vertical: SellVertical) => {
      if (checking) return; // one at a time
      setChecking(vertical.id);

      try {
        const { data } = await axiosInstance.get("/onboarding/me");

        if (data?.needsOnboarding) {
          // So they land back on the form they were heading for
          localStorage.setItem("redirectAfterOnboarding", vertical.href);
          onDone?.();
          router.push("/onboarding");
          return;
        }

        onDone?.();
        router.push(vertical.href);
      } catch (err: any) {
        const status = err?.response?.status;

        if (status === 401 || status === 403) {
          localStorage.setItem("redirectAfterLogin", vertical.href);
          onDone?.();
          router.push(
            `/auth/login?returnUrl=${encodeURIComponent(vertical.href)}`,
          );
          return;
        }

        // Anything else is a network problem, not a permissions one.
        // Fail open — the form validates on submit, and blocking a sale
        // over a failed GET is the wrong trade.
        onDone?.();
        router.push(vertical.href);
      } finally {
        setChecking(null);
      }
    },
    [checking, router, onDone],
  );

  return { start, checking, verticals: SELL_VERTICALS };
}
