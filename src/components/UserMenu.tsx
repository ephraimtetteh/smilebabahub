"use client";

import Link from "next/link";
import { User, ChevronDown, MapPin } from "lucide-react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/redux";
import { useRouter } from "next/navigation";
import { logout } from "../lib/features/auth/authActions";


export default function UserMenu() {
  const user = useAppSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/login");
    setOpen(false)
  };

  return (
    <div className="relative z-50">
      {!user ? (
        <Link href="/auth/login">
          <User className="text-white hover:text-yellow-400 cursor-pointer" />
        </Link>
      ) : (
        <>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 text-white hover:text-yellow-400"
          >
            <User size={20} />
            {user.username}
            <ChevronDown size={16} />
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-44 bg-white shadow-lg rounded-lg py-2 text-black animate-fadeIn z-[200]">
              {!user && (
                <div>
                  <Link
                    href="/auth/register"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Register
                  </Link>
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                </div>
              )}

              <div className="flex items-center gap-2 px-4 py-2 text-gray-600 text-sm border-b">
                <MapPin size={16} />
                {user.country} {user.state}
              </div>

              {user && (
                <div>
                  <Link
                    href="/vendor"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
