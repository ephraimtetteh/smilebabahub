"use client";

import { useRouter } from "next/navigation";

const SuccessPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
      <div className="bg-white p-10 rounded shadow max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">🎉 Ad Published!</h2>

        <p className="text-gray-600 mb-6">
          Your product has been successfully listed on SmileBabaHub.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/vendor")}
            className="bg-black text-white py-3 rounded"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => router.push("/sell")}
            className="border py-3 rounded"
          >
            Post Another Ad
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
