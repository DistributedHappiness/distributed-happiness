import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Checkout",
  description: "Complete your custom gift order securely with UPI, Cards, or Cash on Delivery.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
