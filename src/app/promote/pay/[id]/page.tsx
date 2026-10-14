"use client";

// src/app/promote/pay/[id]/page.tsx
//
// Direct payment entry point — usually linked from the approval email.
// Auto-initiates Flutterwave checkout for the promo's amount and redirects.

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CreditCard, AlertCircle, ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "@/src/lib/api/axios";

export default function PayPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    // Just kick off payment immediately and redirect to FLW
    axiosInstance
      .post(`/promote/${id}/pay`)
      .then(({ data }) => {
        window.location.href = data.paymentLink;
      })
      .catch((err) => {
        setError(err?.response?.data?.message ?? "Could not start payment");
        setLoading(false);
      });
  }, [id]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div
        className="bg-white rounded-3xl p-8 max-w-sm w-full text-center
        border border-gray-100 shadow-sm"
      >
        {loading && !error && (
          <>
            <div
              className="w-14 h-14 mx-auto bg-yellow-100 rounded-full
              flex items-center justify-center mb-4"
            >
              <CreditCard size={24} className="text-yellow-600" />
            </div>
            <h2 className="text-base font-black text-gray-900 mb-2">
              Connecting to Flutterwave…
            </h2>
            <p className="text-xs text-gray-500 mb-5">
              Setting up your secure payment. Please wait.
            </p>
            <Loader2
              size={22}
              className="mx-auto animate-spin text-yellow-500"
            />
          </>
        )}

        {error && (
          <>
            <div
              className="w-14 h-14 mx-auto bg-red-100 rounded-full
              flex items-center justify-center mb-4"
            >
              <AlertCircle size={24} className="text-red-600" />
            </div>
            <h2 className="text-base font-black text-gray-900 mb-2">
              Could not start payment
            </h2>
            <p className="text-xs text-gray-500 mb-5">{error}</p>

            <div className="space-y-2">
              <Link
                href={`/promote/status/${id}`}
                className="block w-full py-3 bg-yellow-400 hover:bg-yellow-300
                  text-black font-black rounded-xl text-sm transition"
              >
                View campaign status
              </Link>
              <Link
                href="/promote"
                className="block text-xs text-gray-400 hover:text-gray-900 mt-2"
              >
                <ChevronLeft size={11} className="inline" /> Back to promote
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
