"use client";

import { useAppSelector } from "../app/redux";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticating, hasCheckedAuth } = useAppSelector(
    (state) => state.auth,
  );

  if (!hasCheckedAuth || isAuthenticating) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading app...</p>
      </div>
    );
  }

  return <>{children}</>;
}
