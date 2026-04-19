'use client'

import { assets } from '@/src/assets/assets'
import Image from 'next/image'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux';
import { login } from '@/src/lib/features/auth/authActions';
import { useRouter } from "next/navigation";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { toast } from 'react-toastify';

const Loginpage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const {
    user: authUser,
    isAuthenticated,
    isAuthenticating,
  } = useAppSelector((state) => state.auth);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // -----------------------------
  // Redirect Helper
  // -----------------------------
  const redirectAfterLogin = () => {
    const redirectPath = localStorage.getItem("redirectAfterLogin");

    if (redirectPath) {
      router.push(redirectPath);
      localStorage.removeItem("redirectAfterLogin");
    } else {
      router.push("/");
    }
  };

  // -----------------------------
  // Protected Action
  // -----------------------------
  const handleProtectedAction = () => {
    const currentPath = window.location.pathname;

    localStorage.setItem("redirectAfterLogin", currentPath);
    router.push("/auth/login");
  };

  // -----------------------------
  // Login Handler
  // -----------------------------
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await dispatch(login(user));

      if (login.fulfilled.match(result)) {
        toast.success("Login successful!");
        const redirectPath = localStorage.getItem("redirectAfterLogin");

        if (redirectPath) {
          localStorage.removeItem("redirectAfterLogin");
          router.push(redirectPath);
        } else {
          router.push("/"); // default redirect
        }
      

      } else {
        const message = result.payload as string;
        setError(message || "Login failed.");
        toast.error(message || "Login failed.");
      }
    } catch {
      const message = "Something went wrong.";
      setError(message);
      toast.error(message);
    }
  };

  // -----------------------------
  // Route Guard
  // -----------------------------
  useEffect(() => {
    if (!isAuthenticating && !isAuthenticated) {
      const currentPath = window.location.pathname;

      if (currentPath !== "/auth/login") {
        localStorage.setItem("redirectAfterLogin", currentPath);
        router.push("/auth/login");
      }
    }
  }, [isAuthenticated, isAuthenticating, router]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black">
      {/* Background Image */}
      <Image
        src={assets.bgImage}
        alt="Background"
        fill
        priority
        className="object-cover"
      />

      {/* Dark overlay for premium feel */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 grid lg:grid-cols-2 w-[95%] max-w-7xl rounded-3xl overflow-hidden shadow-2xl">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-between p-12 text-white bg-gradient-to-br from-black/60 to-black/20 backdrop-blur-md">
          <Link href={"/"}>
            <Image
              src={assets.logo}
              alt="logo"
              width={90}
              height={90}
              className="rounded-xl"
            />
          </Link>

          <div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Buy. Sell. Smile.
            </h1>
            <p className="text-lg text-gray-300 max-w-md">
              Ghana & Naija’s trusted marketplace to discover deals, connect
              with sellers, and grow your business effortlessly.
            </p>
          </div>

          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} SmileBabaHub
          </p>
        </div>

        {/* RIGHT SIDE (FORM) */}
        <div className="flex items-center justify-center bg-white/90 backdrop-blur-xl p-6 lg:p-12">
          <div className="w-full max-w-md">
            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Welcome Back 👋
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <input
                type="email"
                value={user.email}
                onChange={handleUserChange}
                placeholder="Email Address"
                name="email"
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition"
              />

              {/* Password */}
              <div className="flex items-center border border-gray-200 rounded-xl focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 transition">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={user.password}
                  onChange={handleUserChange}
                  placeholder="Password"
                  name="password"
                  className="flex-1 p-4 rounded-xl outline-none"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-4 cursor-pointer text-gray-500 hover:text-black"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-white font-semibold py-4 rounded-xl shadow-lg hover:scale-[1.02] transition disabled:opacity-50"
              >
                Submit
              </button>

              {/* Links */}
              <div className="flex justify-between text-sm mt-2">
                <Link
                  href="/auth/forgot-password"
                  className="text-gray-500 hover:text-amber-500"
                >
                  Forgot Password?
                </Link>

                <Link
                  href={"/auth/register"}
                  className="text-amber-600 font-medium hover:underline"
                >
                  Create Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loginpage