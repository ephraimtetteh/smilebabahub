"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/src/app/redux";
import { resendOTP, verifyOTP } from "@/src/lib/features/auth/authActions";
import { toast } from "react-toastify";

const VerifyPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const phone = searchParams.get("phone");

  const dispatch = useAppDispatch();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(60);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (index === 5 && value) {
      setTimeout(handleVerify, 300);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      toast.error("Enter the full OTP code");
      return;
    }

    const result = await dispatch(
      verifyOTP({
        phone: phone as string,
        otp: code,
      }),
    );

    if (verifyOTP.fulfilled.match(result)) {
      toast.success("Account verified successfully");
      router.push("/auth/login");
    } else {
      toast.error("Invalid OTP");
    }
  };


  const handleResend = async () => {
    if (timer > 0) return;

    const result = await dispatch(resendOTP(phone as string));

    if (resendOTP.fulfilled.match(result)) {
      toast.success("OTP resent successfully");
      setTimer(60);
    } else {
      toast.error("Failed to resend OTP");
    }
  };


  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);



  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-[380px] text-center">
        <h1 className="text-2xl font-bold mb-2">Verify Phone Number</h1>

        <p className="text-gray-500 mb-6">
          Enter the 6 digit code sent to your phone
        </p>

        <div className="flex justify-between mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => {
                inputs.current[index] = el;
              }}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 border rounded text-center text-xl focus:border-yellow-400 outline-none"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          className="w-full bg-yellow-400 text-white font-bold py-3 rounded-lg"
        >
          Verify OTP
        </button>

        <p className="text-sm text-gray-500 mt-4">
          {timer > 0 ? (
            <span>Resend code in {timer}s</span>
          ) : (
            <span
              onClick={handleResend}
              className="text-yellow-500 cursor-pointer font-semibold"
            >
              Resend OTP
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default VerifyPage;
