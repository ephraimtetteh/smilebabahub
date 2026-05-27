"use client";

// src/components/InstallAppButton.tsx
// "Download App" button used in the header.
//
// Behavior:
//   1. Listens for the `beforeinstallprompt` event (Chrome/Edge/Android)
//   2. If captured, shows a one-tap install button → triggers prompt()
//   3. On iOS Safari, shows instructions (no API support)
//   4. After install, button hides itself for that user
//
// State stored in localStorage so the button stays consistent across reloads.

import { useEffect, useState, useCallback } from "react";
import { Download, X, Share, Plus, Smartphone, Monitor } from "lucide-react";

// BeforeInstallPromptEvent is not in the standard TS lib — declare it ourselves.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISSED_KEY = "pwa-install-dismissed";
const INSTALLED_KEY = "pwa-installed";

export default function InstallAppButton() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [showHint, setShowHint] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Detect platform and saved state on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ua = window.navigator.userAgent;
    const isiOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isiOS);

    setDismissed(localStorage.getItem(DISMISSED_KEY) === "1");

    // Detect standalone mode (already installed)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    if (standalone) {
      setInstalled(true);
      localStorage.setItem(INSTALLED_KEY, "1");
    } else if (localStorage.getItem(INSTALLED_KEY) === "1") {
      setInstalled(true);
    }

    // Capture beforeinstallprompt for Chrome/Edge/Android
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
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  // Handler — fires the native install dialog or shows iOS hint
  const handleInstall = useCallback(async () => {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
      setDeferred(null);
    } else if (isIOS) {
      // iOS Safari has no install API — show instructions
      setShowHint(true);
    } else {
      // Desktop browsers that don't support beforeinstallprompt — show hint
      setShowHint(true);
    }
  }, [deferred, isIOS]);

  const dismissHint = () => {
    setShowHint(false);
  };

  const permanentlyDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
    setShowHint(false);
  };

  // Don't render if installed or permanently dismissed
  if (installed || dismissed) return null;

  return (
    <>
      <button
        onClick={handleInstall}
        className="flex items-center gap-2 text-xs"
        aria-label="Install SmileBaba app"
      >
        <div
          className="w-7 h-7 rounded-lg bg-yellow-100 flex items-center
          justify-center text-yellow-700"
        >
          <Download size={14} />
        </div>
        <div className="text-left leading-tight hidden sm:block">
          <p className="font-bold text-gray-900">Download App</p>
          <p className="text-[10px] text-yellow-700">Get 5% Off</p>
        </div>
      </button>

      {/* Install instructions modal */}
      {showHint && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] flex items-end sm:items-center
          justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && dismissHint()}
        >
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
            {/* Header */}
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
                // iOS Safari instructions
                <div className="space-y-3 text-sm">
                  <p className="font-bold text-gray-900">
                    To install on iPhone:
                  </p>
                  <Step
                    n={1}
                    icon={<Share size={14} />}
                    text='Tap the "Share" button at the bottom of your browser'
                  />
                  <Step
                    n={2}
                    icon={<Plus size={14} />}
                    text='Scroll down and tap "Add to Home Screen"'
                  />
                  <Step
                    n={3}
                    icon={<Download size={14} />}
                    text='Tap "Add" in the top right'
                  />
                </div>
              ) : (
                // Generic desktop / non-supporting browser
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
                    text='Choose "Install SmileBabaHub" or "Install app"'
                  />
                  <Step
                    n={3}
                    icon={<Smartphone size={14} />}
                    text="Launch from your home screen / desktop anytime"
                  />
                </div>
              )}

              <div className="mt-5 bg-yellow-50 rounded-xl p-3 flex items-start gap-2">
                <span className="text-lg">⚡</span>
                <p className="text-xs text-yellow-700 leading-relaxed">
                  Installed apps load faster, work offline, and send you
                  notifications about new deals.
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 p-4 flex gap-2">
              <button
                onClick={permanentlyDismiss}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-xs font-bold
                  rounded-xl hover:bg-gray-200 transition"
              >
                Don't show again
              </button>
              <button
                onClick={dismissHint}
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
