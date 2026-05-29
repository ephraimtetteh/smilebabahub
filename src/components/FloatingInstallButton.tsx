"use client";

// src/components/FloatingInstallButton.tsx
//
// Floating "Install app" button (bottom-right) — appears on every page until dismissed.
// Uses the same InstallAppButton logic but with a floating bubble UI.
// Disappears once installed or permanently dismissed (localStorage flag).

import { useEffect, useState } from "react";
import { Download, X, Smartphone, Share, Plus, Monitor } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISSED_KEY = "pwa-float-dismissed";
const INSTALLED_KEY = "pwa-installed";

export default function FloatingInstallButton() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [showHint, setShowHint] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [shown, setShown] = useState(false); // animate in after delay

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ua = window.navigator.userAgent;
    const isiOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isiOS);

    setDismissed(localStorage.getItem(DISMISSED_KEY) === "1");

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    if (standalone) {
      setInstalled(true);
      localStorage.setItem(INSTALLED_KEY, "1");
    } else if (localStorage.getItem(INSTALLED_KEY) === "1") {
      setInstalled(true);
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onAppInstalled = () => {
      setInstalled(true);
      setDeferred(null);
      localStorage.setItem(INSTALLED_KEY, "1");
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);

    // Show after 4 seconds so it doesn't compete with initial page paint
    const showTimer = setTimeout(() => setShown(true), 4000);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
      clearTimeout(showTimer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
      setDeferred(null);
    } else {
      // iOS or unsupported — show instructions
      setShowHint(true);
    }
  };

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  };

  if (installed || dismissed || !shown) return null;

  return (
    <>
      {/* Floating bubble — bottom right on desktop, bottom-center-ish on mobile */}
      <div
        className="fixed z-40 bottom-24 right-3 sm:bottom-5 sm:right-5
        animate-floatin"
      >
        <div
          className="flex items-center gap-2 bg-gray-900 text-white
          rounded-full shadow-2xl pl-2 pr-1 py-1
          border-2 border-yellow-400"
        >
          <button
            onClick={handleInstall}
            className="flex items-center gap-2 px-2 py-2 text-xs font-bold
              hover:bg-white/10 rounded-full transition active:scale-95"
          >
            <div
              className="w-7 h-7 bg-yellow-400 rounded-full flex items-center
              justify-center text-black"
            >
              <Download size={13} strokeWidth={3} />
            </div>
            <div className="text-left leading-tight pr-1">
              <p className="text-xs font-black">Install app</p>
              <p className="text-[10px] text-yellow-300">5% off first order</p>
            </div>
          </button>

          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="w-7 h-7 hover:bg-white/10 rounded-full flex items-center
              justify-center transition flex-shrink-0"
          >
            <X size={12} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* iOS / fallback instructions modal */}
      {showHint && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] flex items-end sm:items-center
          justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowHint(false)}
        >
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-5 text-center">
              <div
                className="w-14 h-14 bg-white rounded-2xl flex items-center
                justify-center mx-auto mb-2 shadow-lg"
              >
                <Smartphone size={26} className="text-yellow-600" />
              </div>
              <h3 className="text-base font-black text-black">
                Install SmileBaba
              </h3>
              <p className="text-xs text-black/70">
                Get 5% off your first order
              </p>
            </div>

            <div className="p-5">
              {isIOS ? (
                <div className="space-y-3 text-sm">
                  <p className="font-bold text-gray-900">
                    To install on iPhone:
                  </p>
                  <Step
                    n={1}
                    icon={<Share size={14} />}
                    text='Tap the "Share" button at the bottom'
                  />
                  <Step
                    n={2}
                    icon={<Plus size={14} />}
                    text='Scroll and tap "Add to Home Screen"'
                  />
                  <Step
                    n={3}
                    icon={<Download size={14} />}
                    text='Tap "Add" in the top right'
                  />
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <p className="font-bold text-gray-900">
                    To install on this device:
                  </p>
                  <Step
                    n={1}
                    icon={<Monitor size={14} />}
                    text="Open your browser's menu (⋮ or ⋯)"
                  />
                  <Step
                    n={2}
                    icon={<Download size={14} />}
                    text='Choose "Install SmileBabaHub"'
                  />
                  <Step
                    n={3}
                    icon={<Smartphone size={14} />}
                    text="Launch from home screen anytime"
                  />
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 p-4 flex gap-2">
              <button
                onClick={dismiss}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-xs font-bold
                  rounded-xl hover:bg-gray-200 transition"
              >
                Don't show again
              </button>
              <button
                onClick={() => setShowHint(false)}
                className="flex-1 py-2.5 bg-yellow-400 text-black text-xs font-black
                  rounded-xl hover:bg-yellow-300 transition"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Step({
  n,
  icon,
  text,
}: {
  n: number;
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-7 h-7 rounded-full bg-yellow-100 text-yellow-700 flex-shrink-0
        flex items-center justify-center text-xs font-black"
      >
        {n}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1.5 text-gray-600 mb-0.5">
          {icon}
        </div>
        <p className="text-xs text-gray-700 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
