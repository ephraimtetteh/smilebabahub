"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/src/app/redux";
import { resetPassword } from "@/src/lib/features/auth/authActions";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useSearchParams();

  const token = params.get("token");

  const [password, setPassword] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(
      resetPassword({
        token: token as string,
        password,
      }),
    );

    if (resetPassword.fulfilled.match(result)) {
      toast.success("Password updated successfully");
      router.push("/auth/login");
    } else {
      toast.error("Failed to reset password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleReset}
        className="bg-white shadow-lg rounded-xl p-8 w-[400px]"
      >
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>

        <input
          type="password"
          required
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-yellow-400 text-white font-bold py-3 rounded"
          onClick={handleReset}
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
