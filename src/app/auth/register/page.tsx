'use client'

import { assets } from '@/src/assets/assets'
import Image from 'next/image'
import Link from 'next/link';
import React, { useState } from 'react'
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from '../../redux';
import { login, register } from '@/src/lib/features/auth/authActions';
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import { validateEmailClient } from '@/src/utils/ValidateEmail';

const AuthRegister
 = () => {
  const dispatch = useAppDispatch()
  const [user, setUser] = useState({
    email: '',
    password: '',
    phone: '',
    username: ''
  })
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return "Weak";
    if (password.length < 10) return "Medium";
    return "Strong";
  };

  const isValidPhone = (phone: string) => {
    return /^[0-9]{10,15}$/.test(phone);
  };

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({...user, [e.target.name]: e.target.value})
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    

    try {

      // Client-side email check before hitting the network
        const emailCheck = validateEmailClient(user.email);
        if (!emailCheck.valid) {
          setError(emailCheck.reason ?? "Invalid email");
          return;
        }
      
      if (!isValidPhone(user.phone)) {
        const message = "Please enter a valid phone number";
        setError(message);
        toast.error(message);
        return;
      }

      if (!isValidEmail(user.email)) {
        const message = "Enter a valid email address";
        setError(message);
        toast.error(message);
        return;
      }

      const result = await dispatch(register(user));
      
      if (register.fulfilled.match(result)) {
        toast.success("Account created!");
        
        const loginResult = await dispatch(login({
          email: user.email,
          password: user.password
        }));
        
        if (login.fulfilled.match(loginResult)) {
          router.push("/");
          // router.push(`/auth/verify?email=${user.email}&phone=${user.phone}`);
        }

        const redirect = localStorage.getItem("redirectAfterLogin");

        if (redirect) {
          router.push(redirect);
          localStorage.removeItem("redirectAfterLogin");
        } else {
          router.push("/");
        }
      
        setUser({
          email: "",
          password: "",
          phone: "",
          username: "",
        });
      } else {
        const message = result.payload as string;
        setError(message || "Registration failed.");
        toast.error(message || "Registration failed.");
      }
    } catch {
      console.error(error);
      const message = "Something went wrong.";
      setError(message);
      toast.error(message);

    } 
  
  };

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

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Container */}
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
              Start Selling. Start Smiling.
            </h1>
            <p className="text-lg text-gray-300 max-w-md">
              Join thousands of vendors across Ghana & Nigeria growing their
              businesses on SmileBabaHub.
            </p>
          </div>

          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} SmileBabaHub
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center bg-white/90 backdrop-blur-xl p-6 lg:p-12">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Create your account 🚀
            </h2>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Email */}
              <input
                type="email"
                required
                placeholder="Email Address"
                name="email"
                value={user.email}
                onChange={handleUserChange}
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition"
              />

              {/* Name */}
              <input
                type="text"
                required
                placeholder="Full Name"
                name="username"
                value={user.username}
                onChange={handleUserChange}
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition"
              />

              {/* Phone */}
              <input
                type="tel"
                required
                placeholder="Phone Number"
                name="phone"
                value={user.phone}
                onChange={handleUserChange}
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition"
              />

              {/* Password */}
              <div className="flex items-center border border-gray-200 rounded-xl focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 transition">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  name="password"
                  value={user.password}
                  onChange={handleUserChange}
                  className="flex-1 p-4 rounded-xl outline-none"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-4 cursor-pointer text-gray-500 hover:text-black"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* Password Strength Bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    user.password.length < 4
                      ? "w-1/4 bg-red-400"
                      : user.password.length < 6
                        ? "w-2/4 bg-yellow-400"
                        : user.password.length < 8
                          ? "w-3/4 bg-blue-400"
                          : "w-full bg-green-500"
                  }`}
                />
              </div>

              <p className="text-xs text-gray-500">
                Password strength: {getPasswordStrength(user.password)}
              </p>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-white font-semibold py-4 rounded-xl shadow-lg hover:scale-[1.02] transition disabled:opacity-50"
              >
                Create Account
              </button>

              {/* Terms */}
              <p className="text-xs text-gray-500 text-center">
                By continuing, you agree to our{" "}
                <span className="underline cursor-pointer text-gray-700">
                  Privacy Policy
                </span>
              </p>

              {/* Login */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href={"/auth/login"}
                  className="text-amber-600 font-medium hover:underline"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthRegister
