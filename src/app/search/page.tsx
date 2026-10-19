// src/app/search/page.tsx
// This page used to render hard-coded demo products (utils/data/
// generateProducts), so anyone searching from the header saw fake items.
// Real search lives on /ads — forward there, keeping the query.
import { redirect } from "next/navigation";

export default async function SearchRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const q = first(sp.search) || first(sp.q) || first(sp.query);
  const category = first(sp.category);
  const params = new URLSearchParams();
  if (q) params.set("search", q.slice(0, 80));
  if (category) params.set("category", category.slice(0, 40));
  const qs = params.toString();
  redirect(qs ? `/ads?${qs}` : "/ads");
}
