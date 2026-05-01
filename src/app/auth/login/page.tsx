"use client";

import { assets } from "@/src/assets/assets";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../redux";
import {
  login,
  googleLogin,
  facebookLogin,
} from "@/src/lib/features/auth/authActions";
import { useRouter } from "next/navigation";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

// ── Google Identity Services types ────────────────────────────────────────
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: object) => void;
          renderButton: (el: HTMLElement, config: object) => void;
          prompt: () => void;
          cancel: () => void;
        };
      };
    };
    FB?: {
      init: (config: object) => void;
      login: (cb: (res: any) => void, opts: object) => void;
    };
    fbAsyncInit?: () => void;
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
const FB_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID ?? "";

// ── OAuth divider ─────────────────────────────────────────────────────────
function OrDivider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs text-gray-400 font-medium">
        or continue with
      </span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

// ── Google button (rendered by GSI SDK) ──────────────────────────────────
function GoogleButton({ onToken }: { onToken: (token: string) => void }) {
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const init = () => {
      if (!window.google || !ref.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (res: any) => {
          if (res.credential) onToken(res.credential);
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      window.google.accounts.id.renderButton(ref.current, {
        theme: "outline",
        size: "large",
        width: "100%",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
      });
    };

    if (window.google) {
      init();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = init;
      document.head.appendChild(script);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!GOOGLE_CLIENT_ID) return null;
  return <div ref={ref} className="w-full" />;
}

// ── Facebook button ───────────────────────────────────────────────────────
function FacebookButton({
  onToken,
  loading,
}: {
  onToken: (token: string) => void;
  loading: boolean;
}) {
  const [fbReady, setFbReady] = useState(false);

  useEffect(() => {
    if (!FB_APP_ID) return;

    window.fbAsyncInit = () => {
      window.FB?.init({
        appId: FB_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v19.0",
      });
      setFbReady(true);
    };

    if (window.FB) {
      setFbReady(true);
    } else {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  const handleFBLogin = () => {
    if (!window.FB) return;
    window.FB.login(
      (response) => {
        if (response.authResponse?.accessToken) {
          onToken(response.authResponse.accessToken);
        } else {
          toast.error("Facebook login was cancelled.");
        }
      },
      { scope: "public_profile,email" },
    );
  };

  if (!FB_APP_ID) return null;

  return (
    <button
      type="button"
      onClick={handleFBLogin}
      disabled={loading || !fbReady}
      className="w-full flex items-center justify-center gap-3 py-3.5
        border border-gray-300 rounded-xl bg-white
        hover:bg-blue-50 hover:border-blue-400
        transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {/* Official Facebook blue F icon */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
        <path
          d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99
          4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007
          1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83
          c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385
          C19.612 23.027 24 18.062 24 12.073z"
        />
      </svg>
      <span className="text-sm font-semibold text-gray-700">
        Continue with Facebook
      </span>
    </button>
  );
}

// ── Main login page ───────────────────────────────────────────────────────
const Loginpage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<
    "google" | "facebook" | null
  >(null);
  const [user, setUser] = useState({ email: "", password: "" });

  const {
    isAuthenticated,
    isAuthenticating,
    user: authUser,
  } = useAppSelector((s) => s.auth);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Shared redirect after any successful login
  const redirectAfterLogin = useCallback(
    (payload: any) => {
      const savedPath = localStorage.getItem("redirectAfterLogin");
      if (savedPath) {
        localStorage.removeItem("redirectAfterLogin");
        router.replace(savedPath);
        return;
      }
      const dest = (payload as any).redirectTo as string | undefined;
      router.replace(dest ?? "/");
    },
    [router],
  );

  // ── Email/password login ─────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await dispatch(login(user));
      if (login.fulfilled.match(result)) {
        toast.success("Welcome back!");
        redirectAfterLogin(result.payload);
      } else {
        const msg = (result.payload as string) || "Login failed.";
        setError(msg);
        toast.error(msg);
      }
    } catch {
      const msg = "Something went wrong.";
      setError(msg);
      toast.error(msg);
    }
  };

  // ── Google OAuth ─────────────────────────────────────────────────────
  const handleGoogleToken = useCallback(
    async (idToken: string) => {
      setError(null);
      setOauthLoading("google");
      try {
        const result = await dispatch(googleLogin(idToken));
        if (googleLogin.fulfilled.match(result)) {
          const isNew = (result.payload as any).isNewUser;
          toast.success(isNew ? "Welcome to SmileBaba! 🎉" : "Welcome back!");
          redirectAfterLogin(result.payload);
        } else {
          const msg = "Google login failed. Please try again.";
          setError(msg);
          toast.error(msg);
        }
      } catch {
        toast.error("Google login failed.");
      } finally {
        setOauthLoading(null);
      }
    },
    [dispatch, redirectAfterLogin],
  );

  // ── Facebook OAuth ────────────────────────────────────────────────────
  const handleFacebookToken = useCallback(
    async (accessToken: string) => {
      setError(null);
      setOauthLoading("facebook");
      try {
        const result = await dispatch(facebookLogin(accessToken));
        if (facebookLogin.fulfilled.match(result)) {
          const isNew = (result.payload as any).isNewUser;
          toast.success(isNew ? "Welcome to SmileBaba! 🎉" : "Welcome back!");
          redirectAfterLogin(result.payload);
        } else {
          const msg = "Facebook login failed. Please try again.";
          setError(msg);
          toast.error(msg);
        }
      } catch {
        toast.error("Facebook login failed.");
      } finally {
        setOauthLoading(null);
      }
    },
    [dispatch, redirectAfterLogin],
  );

  // Bounce already-authenticated users away
  useEffect(() => {
    if (!isAuthenticating && isAuthenticated) {
      const role = authUser?.role;
      if (role === "vendor") router.replace("/vendor/dashboard");
      else if (role === "admin") router.replace("/admin");
      else router.replace("/");
    }
  }, [isAuthenticated, isAuthenticating, authUser, router]);

  const isBusy = isAuthenticating || !!oauthLoading;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black">
      <Image
        src={assets.bgImage}
        alt="Background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative z-10 grid lg:grid-cols-2 w-[95%] max-w-7xl
        rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* ── Left panel ── */}
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
              Ghana & Naija`s trusted marketplace to discover deals, connect
              with sellers, and grow your business effortlessly.
            </p>
          </div>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} SmileBabaHub
          </p>
        </div>

        {/* ── Right panel ── */}
        <div
          className="flex items-center justify-center bg-white/90 backdrop-blur-xl
          p-6 lg:p-12"
        >
          <div className="w-full max-w-md">
            {error && (
              <div
                className="bg-red-50 border border-red-200 rounded-xl px-4 py-3
                text-red-600 text-sm text-center mb-5"
              >
                {error}
              </div>
            )}

            <h2 className="text-2xl font-semibold mb-1 text-gray-800">
              Welcome Back 👋
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Sign in to your SmileBaba account
            </p>

            {/* ── OAuth buttons ── */}
            <div className="space-y-3">
              {/* Google — rendered by GSI (handles its own styling) */}
              {GOOGLE_CLIENT_ID && (
                <div
                  className={`transition-opacity ${oauthLoading === "google" ? "opacity-60 pointer-events-none" : ""}`}
                >
                  <GoogleButton onToken={handleGoogleToken} />
                </div>
              )}

              {/* Facebook */}
              <FacebookButton onToken={handleFacebookToken} loading={isBusy} />
            </div>

            {(GOOGLE_CLIENT_ID || FB_APP_ID) && <OrDivider />}

            {/* ── Email/password form ── */}
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                value={user.email}
                onChange={handleUserChange}
                placeholder="Email Address"
                name="email"
                required
                disabled={isBusy}
                className="w-full p-4 rounded-xl border border-gray-200
                  focus:border-amber-400 focus:ring-2 focus:ring-amber-100
                  outline-none transition disabled:bg-gray-50 disabled:opacity-70"
              />

              <div
                className="flex items-center border border-gray-200 rounded-xl
                focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 transition"
              >
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={user.password}
                  onChange={handleUserChange}
                  placeholder="Password"
                  name="password"
                  disabled={isBusy}
                  className="flex-1 p-4 rounded-xl outline-none
                    disabled:bg-gray-50 disabled:opacity-70"
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
                disabled={isBusy}
                className="w-full flex items-center justify-center gap-2
                  bg-gradient-to-r from-amber-500 to-yellow-400 text-white
                  font-semibold py-4 rounded-xl shadow-lg
                  hover:scale-[1.02] transition disabled:opacity-50 disabled:scale-100"
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
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

            {/* Privacy note */}
            <p className="text-center text-[11px] text-gray-400 mt-6 leading-relaxed">
              By signing in you agree to our{" "}
              <Link href="/terms" className="text-amber-600 hover:underline">
                Terms
              </Link>
              {" & "}
              <Link href="/privacy" className="text-amber-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Global OAuth loading overlay */}
      {oauthLoading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl px-8 py-6 flex flex-col items-center gap-3 shadow-xl">
            <Loader2 size={28} className="animate-spin text-amber-500" />
            <p className="text-sm font-semibold text-gray-700">
              {oauthLoading === "google"
                ? "Signing in with Google…"
                : "Signing in with Facebook…"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loginpage;
