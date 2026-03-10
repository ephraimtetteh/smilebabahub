"use client";

import { useState } from "react";

export default function VerifyAccount() {
  const [otp, setOtp] = useState("");

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Verify Your Account</h1>

      <p className="text-gray-500 mt-2">Enter the OTP sent to your phone</p>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border p-3 mt-4 rounded w-64"
      />

      <button className="bg-yellow-400 px-6 py-3 mt-4 rounded">
        Verify OTP
      </button>
    </div>
  );
}
