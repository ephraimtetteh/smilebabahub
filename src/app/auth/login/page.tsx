'use client'

import { assets } from '@/src/assets/assets'
import Image from 'next/image'
import Link from 'next/link';
import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux';
import { login } from '@/src/lib/features/auth/authActions';
import { useRouter } from "next/navigation";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { toast } from 'react-toastify';

const Loginpage = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
   const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const { isLoading } = useAppSelector((state) => state.auth);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUser({...user, [e.target.name]: e.target.value})
    }
const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {

      const result = await dispatch(login(user));

      if (login.fulfilled.match(result)) {
        toast.success("Login successful!");
        router.push(`/vendor`);

        setUser({
          email: "",
          password: ""
        });


      } else {
        const message = result.payload as string;
        setError(message || "Registration failed.");
        toast.error(message || "Login failed.");
      }
    } catch {
      setError("Something went wrong.");
      toast.error("Something went wrong.");
    } 
  
  };

  return (
    <div className="relative lg:h-200 h-[80vh] max-sm:w-[90vw] md:w-150 lg:w-350 mx-auto mt-15 flex flex-col flex-1">
      <h1>Register</h1>
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
          {error && (
            <p className="text-red-500 text-sm text-center py-2">{error}</p>
          )}
          <form
            onSubmit={handleLogin}
            className=" grid lg:flex-1 lg:w-[80%] md:w-full lg:py-20 py-6 px-2 md:px-4"
          >
            <h1 className="lg:text-2xl md:text-xl md:px-2 max-sm:px-4 py-4 font-semibold">
              Login With Credentials
            </h1>
            <input
              type="email"
              value={user.email}
              onChange={handleUserChange}
              placeholder="Email Address"
              name="email"
              className="flex-1 lg:w-full border border-gray-300 p-4 rounded my-2 outline-[#ffc10522] text-[14px]"
            />
            <div className="flex items-center justify-between border border-gray-300 rounded w-full">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={user.password}
                onChange={handleUserChange}
                placeholder="Password"
                name="password"
                className="flex-1 p-4 outline-none text-[14px]"
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="pr-4 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 w-full bg-[#ccc] font-bold text-white rounded-full py-5 mt-3 cursor-pointer disabled:opacity-50"
            > {isLoading ? "Logging in..." : "Submit"}</button>

            <p className="text-center py-4 text-[#5a5858] text-[14px] gap-3">
              Do not have an account
              <Link
                href={"/auth/register"}
                className="text-rose-800 underline cursor-pointer"
              >
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Loginpage