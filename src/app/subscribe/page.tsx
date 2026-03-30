// src/app/subscribe/page.tsx
// Canonical subscription page is /subscription.
// This redirect handles old links, emails, and guard redirects.
import { redirect } from "next/navigation";

export default function SubscribeRedirectPage() {
  redirect("/subscription");
}
