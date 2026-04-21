"use client";

import { assets } from "@/src/assets/assets";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux";
import { login } from "@/src/lib/features/auth/authActions";
import { useRouter } from "next/navigation";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";

const Loginpage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({ email: "", password: "" });

  const { isAuthenticated, isAuthenticating } = useAppSelector((s) => s.auth);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // ── Login handler ────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await dispatch(login(user));

      if (login.fulfilled.match(result)) {
        toast.success("Login successful!");

        // ── Role-based redirect ───────────────────────────────────────────
        // Priority: saved returnUrl → role-based default
        const savedPath = localStorage.getItem("redirectAfterLogin");
        if (savedPath) {
          localStorage.removeItem("redirectAfterLogin");
          router.replace(savedPath);
          return;
        }

        // Read redirectTo that the login thunk computed from the user's role
        const redirectTo = (result.payload as any).redirectTo as
          | string
          | undefined;
        router.replace(redirectTo ?? "/");
      } else {
        const message = (result.payload as string) || "Login failed.";
        setError(message);
        toast.error(message);
      }
    } catch {
      const message = "Something went wrong.";
      setError(message);
      toast.error(message);
    }
  };

  const authUser = useAppSelector((s) => s.auth.user);

  // ── Prevent authenticated users from seeing the login page ───────────────
  // Send them to their role-based home, not always "/"
  useEffect(() => {
    if (!isAuthenticating && isAuthenticated) {
      const role = authUser?.role;
      if (role === "vendor") router.replace("/vendor/dashboard");
      else if (role === "admin") router.replace("/admin");
      else router.replace("/");
    }
  }, [isAuthenticated, isAuthenticating, authUser, router]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black">
      {/* Background */}
      <Image
        src={assets.bgImage}
        alt="Background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <div
        className="relative z-10 grid lg:grid-cols-2 w-[95%] max-w-7xl
        rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Left panel */}
        <div
          className="hidden lg:flex flex-col justify-between p-12 text-white
          bg-gradient-to-br from-black/60 to-black/20 backdrop-blur-md"
        >
          <Link href="/">
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
              Ghana & Naija's trusted marketplace to discover deals, connect
              with sellers, and grow your business effortlessly.
            </p>
          </div>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} SmileBabaHub
          </p>
        </div>

        {/* Right panel — form */}
        <div
          className="flex items-center justify-center bg-white/90
          backdrop-blur-xl p-6 lg:p-12"
        >
          <div className="w-full max-w-md">
            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Welcome Back 👋
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                value={user.email}
                onChange={handleUserChange}
                placeholder="Email Address"
                name="email"
                required
                className="w-full p-4 rounded-xl border border-gray-200
                  focus:border-amber-400 focus:ring-2 focus:ring-amber-100
                  outline-none transition"
              />

              <div
                className="flex items-center border border-gray-200 rounded-xl
                focus-within:border-amber-400 focus-within:ring-2
                focus-within:ring-amber-100 transition"
              >
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

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-400
                  text-white font-semibold py-4 rounded-xl shadow-lg
                  hover:scale-[1.02] transition disabled:opacity-50"
              >
                {isAuthenticating ? "Signing in…" : "Sign in"}
              </button>

              <div className="flex justify-between text-sm mt-2">
                <Link
                  href="/auth/forgot-password"
                  className="text-gray-500 hover:text-amber-500"
                >
                  Forgot Password?
                </Link>
                <Link
                  href="/auth/register"
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

export default Loginpage;
