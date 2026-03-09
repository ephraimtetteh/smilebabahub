"use client";

import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const params = useSearchParams();

  const query = params.get("q");
  const category = params.get("category");
  const location = params.get("location");
  const price = params.get("price");

  return (
    <div>
      <h1>Search Results</h1>

      <p>Query: {query}</p>
      <p>Category: {category}</p>
      <p>Location: {location}</p>
      <p>Price: {price}</p>
    </div>
  );
}
