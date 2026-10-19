// src/app/vendor/bookings/page.tsx
// Booking notifications (bell + push) link to /vendor/bookings — the same
// path the app uses. On the website, bookings live on the vendor orders
// page, so forward there with the bookings tab open.
import { redirect } from "next/navigation";

export default function VendorBookingsRedirect() {
  redirect("/vendor/orders?tab=bookings");
}
