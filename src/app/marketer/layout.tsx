import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketer Portal | SmileBaba Hub",
  description:
    "Join the SmileBaba marketer network. Earn 20% commission on every vendor subscription you refer across Ghana and Nigeria.",
  openGraph: {
    title: "SmileBaba Marketer Portal",
    description:
      "Refer vendors to SmileBaba and earn 20% commission on every subscription — paid weekly to your Mobile Money or bank account.",
    url: "https://smilebabahub.com/marketer",
    siteName: "SmileBaba Hub",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function MarketerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
