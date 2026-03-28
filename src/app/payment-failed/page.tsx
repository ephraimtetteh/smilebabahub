"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  XCircle,
  AlertTriangle,
  Wrench,
  Ban,
  Frown,
  CreditCard,
  Phone,
  MessageCircle,
  Shield,
  RefreshCw,
} from "lucide-react";
import { consumeReturnState } from "@/src/hooks/useSubscriptionGuard";

type ReasonConfig = {
  title: string;
  desc: string;
  icon: React.ReactNode;
  iconBg: string;
};

const REASONS: Record<string, ReasonConfig> = {
  not_successful: {
    icon: <XCircle size={36} className="text-red-500" />,
    iconBg: "bg-red-50",
    title: "Payment was not completed",
    desc: "Your payment did not go through. No money has been taken from your account. Please try again.",
  },
  amount_mismatch: {
    icon: <AlertTriangle size={36} className="text-yellow-500" />,
    iconBg: "bg-yellow-50",
    title: "Payment amount mismatch",
    desc: "We detected an issue with the payment amount. Please contact support if money was deducted.",
  },
  server_error: {
    icon: <Wrench size={36} className="text-blue-500" />,
    iconBg: "bg-blue-50",
    title: "Something went wrong on our end",
    desc: "Our payment system encountered an error. Please try again in a few minutes.",
  },
  cancelled: {
    icon: <Ban size={36} className="text-gray-500" />,
    iconBg: "bg-gray-100",
    title: "Payment cancelled",
    desc: "You cancelled the payment. No money has been charged. You can try again whenever you're ready.",
  },
  default: {
    icon: <Frown size={36} className="text-gray-400" />,
    iconBg: "bg-gray-100",
    title: "Payment unsuccessful",
    desc: "Your payment could not be processed. Please try again or contact support.",
  },
};

const NEXT_STEPS: { icon: React.ReactNode; text: string }[] = [
  {
    icon: <RefreshCw size={13} className="text-amber-600" />,
    text: "Try the payment again — most failures are temporary",
  },
  {
    icon: <CreditCard size={13} className="text-blue-500" />,
    text: "Check your card or MoMo balance and try a different method",
  },
  {
    icon: <Phone size={13} className="text-green-500" />,
    text: "Contact your bank if money was deducted unexpectedly",
  },
  {
    icon: <MessageCircle size={13} className="text-purple-500" />,
    text: "Reach out to SmileBaba support if the issue persists",
  },
];

export default function PaymentFailedPage() {
  const router = useRouter();
  const params = useSearchParams();
  const reason = params.get("reason") ?? "default";
  const content = REASONS[reason] ?? REASONS.default;

  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReturnUrl(sessionStorage.getItem("smilebaba_return_url"));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div
          className={`w-24 h-24 ${content.iconBg} rounded-full flex items-center
          justify-center mx-auto mb-6 shadow-lg`}
        >
          {content.icon}
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">
          {content.title}
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mb-8 leading-relaxed max-w-sm mx-auto">
          {content.desc}
        </p>

        {/* Next steps */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 mb-6 text-left">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            What to do next
          </p>
          <div className="space-y-3">
            {NEXT_STEPS.map((s) => (
              <div key={s.text} className="flex items-start gap-3">
                <span className="flex-shrink-0 mt-0.5">{s.icon}</span>
                <span className="text-sm text-gray-600 leading-relaxed">
                  {s.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Assurance */}
        {(reason === "not_successful" || reason === "cancelled") && (
          <div
            className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 mb-6
            flex items-center gap-2.5 text-left"
          >
            <Shield size={16} className="text-green-500 flex-shrink-0" />
            <p className="text-xs text-green-700 leading-relaxed">
              <strong>No charge made.</strong> Your account has not been
              debited. You can retry safely.
            </p>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/subscribe")}
            className="w-full py-3 bg-[#ffc105] text-black font-black rounded-2xl
              hover:bg-amber-400 transition active:scale-[0.99] text-sm"
          >
            Try again
          </button>
          {returnUrl && (
            <Link
              href={returnUrl}
              className="w-full py-3 bg-white border border-gray-200 text-gray-700
                font-semibold rounded-2xl hover:bg-gray-50 transition text-sm"
            >
              Go back to what I was doing
            </Link>
          )}
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-gray-600 transition mt-1"
          >
            Return to SmileBaba home
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          Need help?{" "}
          <a
            href="mailto:support@smilebabahub.com"
            className="text-[#ffc105] hover:underline font-medium"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
