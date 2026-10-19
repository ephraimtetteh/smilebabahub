// src/app/ads/[id]/book/page.tsx
// Old "Book now" links pointed here and 404'd. Forward to the listing,
// which opens the booking modal when it sees ?book=1.
import { redirect } from "next/navigation";

export default async function BookRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // ids are 24-hex Mongo ObjectIds — never echo anything else into a URL
  if (!/^[a-f0-9]{24}$/i.test(id)) redirect("/ads");
  redirect(`/ads/${id}?book=1`);
}
