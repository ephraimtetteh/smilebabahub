// src/app/vendor/page.tsx
// Redirects /vendor → /vendor/dashboard so people never hit a 404
import { redirect } from "next/navigation";

export default function VendorIndexPage() {
  redirect("/vendor/dashboard");
}
