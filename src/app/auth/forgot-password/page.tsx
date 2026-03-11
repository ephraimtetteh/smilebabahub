"use client"

import React,  { useState } from "react";
import { useAppDispatch } from "@/src/app/redux";
import { forgotPassword } from "@/src/lib/features/auth/authActions";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await dispatch(forgotPassword(email));

    if (forgotPassword.fulfilled.match(result)) {
      toast.success("Password reset link sent to your email");
    } else {
      toast.error("Failed to send reset link");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-[400px]"
      >
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>

        <p className="text-gray-500 mb-4">
          Enter your email to receive a reset link
        </p>

        <input
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-yellow-400 text-white font-bold py-3 rounded"
          onClick={handleSubmit}
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;