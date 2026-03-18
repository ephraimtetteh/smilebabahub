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
    <div className="relative lg:h-200 h-[80vh] max-sm:w-[90vw] md:w-150 lg:w-350 mx-auto mt-15 flex flex-col flex-1">
      <Image
        src={assets.bgImage}
        alt="Background"
        fill
        priority
        className="object-cover rounded-2xl"
      />
      <div className="absolute inset-0 items-center grid lg:grid-cols-2 lg:px-20 px-4 py-2 lg:py-6">
        <div>
          <Link href={"/"}>
            <Image
              src={assets.logo}
              alt="Background"
              width={80}
              height={80}
              className="rounded-2xl py-4 max-sm:px-3 max-sm:mx-3"
            />
          </Link>
          <h1>Register</h1>
          <h1 className="lg:text-6xl max-sm:hidden max-sm:py-2 text-white font-bold lg:leading-22">
            SmileBaba is a trusted online marketplace to buy and sell products
            easily
          </h1>
          <p className=" max-sm:hidden text-white text-[20px]">
            Discover great deals, connect with sellers, and shop smarter every
            day
          </p>
        </div>
        <div className=" grid lg:flex lg:flex-col items-center justify-center text-black bg-white m-auto lg:w-[80%] rounded-2xl">
          <form
            onSubmit={handleRegister}
            className=" grid lg:flex-1 lg:w-[80%] md:w-full lg:py-20 py-6 px-2 md:px-4"
          >
            <h1 className="lg:text-2xl md:text-xl md:px-2 max-sm:px-4 py-4 font-semibold">
              Discover Great Deals connect with customer
            </h1>
            {error && (
              <p className="text-red-500 text-sm text-center py-2">{error}</p>
            )}
            <input
              type="email"
              required
              placeholder="Email Address"
              name="email"
              value={user.email}
              onChange={handleUserChange}
              className="flex-1 lg:w-full border border-gray-300 p-4 rounded my-2 outline-[#ffc10522] text-[14px]"
            />

            <input
              type="text"
              required
              placeholder="Name"
              name="username"
              value={user.username}
              onChange={handleUserChange}
              className="flex-1 lg:w-full border border-gray-300 p-4 rounded my-2 outline-[#ffc10522] text-[14px]"
            />

            <input
              type="tel"
              required
              placeholder="Phone"
              name="phone"
              title="Enter a valid phone number"
              value={user.phone}
              onChange={handleUserChange}
              className="flex-1 lg:w-full border border-gray-300 p-4 rounded my-2 outline-[#ffc10522] text-[14px]"
            />

            <div className="flex items-center justify-between border border-gray-300 rounded w-full">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                name="password"
                value={user.password}
                onChange={handleUserChange}
                className="flex-1 p-4 outline-none text-[14px]"
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="pr-4 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <p className="text-xs text-gray-500 px-2 mt-1">
              Strength: {getPasswordStrength(user.password)}
            </p>

            <button
              type="submit"
              className="flex-1 w-full bg-amber-500 font-bold text-black rounded-full py-5 mt-3 cursor-pointer disabled:opacity-50"
            >
              {/* {isLoading ? "Creating account..." : "Submit"} */}
              submit
            </button>

            <p className="text-center py-4 text-[#5a5858] text-[14px]">
              By creating an account, I accept the{" "}
              <span className="text-black underline cursor-pointer">
                Policy Privacy
              </span>
            </p>
            <p className="text-center py-4 text-[#5a5858] text-[14px] gap-2">
              Already have an account
              <Link
                href={"/auth/login"}
                className="text-rose-800 underline cursor-pointer"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthRegister
