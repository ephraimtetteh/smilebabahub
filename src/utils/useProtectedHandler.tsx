"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../app/redux";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isAuthenticating, hasCheckedAuth } = useAppSelector(
    (state) => state.auth
  );

  const router = useRouter();

  useEffect(() => {
    if (hasCheckedAuth && !isAuthenticated) {
      const currentPath = window.location.pathname;
      localStorage.setItem("redirectAfterLogin", currentPath);
      router.push("/auth/login");
    }
  }, [hasCheckedAuth, isAuthenticated, router]);

  if (!hasCheckedAuth || isAuthenticating) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return <>{children}</>;
}