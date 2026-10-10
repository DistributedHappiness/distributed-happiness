import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Orders & Shipment Tracking",
  description: "Track your Distribute Happiness custom gift orders and live artisan production status.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
