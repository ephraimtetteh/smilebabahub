"use client";

import { ProductProps } from "@/src/types/types";
import { products } from "@/src/utils/data/generateProducts";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function SearchPage() {
  const params = useSearchParams();

  const query = params.get("q");
  const category = params.get("category");
  const location = params.get("location");
  const price = params.get("price");
 

  const [results, setResults] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchResults = async () => {
  //     try {
  //       const res = await fetch(
  //         `products/search?q=${query}&category=${category}&location=${location}&price=${price}`,
  //       );

  //       const data = await res.json();
  //       setResults(data.products);
  //     } catch (error) {
  //       console.error("Search error:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchResults();
  // }, [query, category, location, price]);




  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (query || category || location || price) {
          const filtered = products.filter((product) => {
            // const matchesQuery =
            //   !query ||
            //   product.title.toLowerCase().includes(query.toLowerCase());

              const searchableText = `
              ${product.title}
              ${product.description}
              ${product.location.city}
              ${product.location.state}
              ${product.location.country}
            `.toLowerCase();

              const matchesQuery =
                !query || searchableText.includes(query.toLowerCase());

            const matchesCategory = !category || product.category === category;

            const locationString =
              `${product.location.city} ${product.location.state} ${product.location.country}`.toLowerCase();

            const matchesLocation =
              !location || locationString.includes(location.toLowerCase());

            const matchesPrice = !price || product.price <= Number(price);

            return (
              matchesQuery && matchesCategory && matchesLocation && matchesPrice
            );
          });

          setResults(filtered);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, category, location, price]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Search Results</h1>

      {loading && <p>Loading results...</p>}

      {!loading && results.length === 0 && (
        <p className="text-gray-500">No results found.</p>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {results.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <Image
              src={item.images[0]}
              alt={item.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h2 className="font-semibold">{item.title}</h2>

              <p className="text-gray-500 text-sm">{item.location.city}</p>
              <p className="text-gray-500 text-sm">{item.location.state}</p>

              <p className="text-green-600 font-bold mt-2">${item.price}</p>

              <p className="text-xs text-gray-400 mt-1">
                Category: {item.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
