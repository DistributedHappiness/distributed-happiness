import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bulk & Corporate Gifting | Wholesale Custom Gifts & Merchandise",
  description:
    "Order personalized corporate gifts, employee welcome kits, and bulk event merchandise at wholesale prices. Tiered discounts from 15% to 45% off, free sample mockups, and pan-India logistics.",
  openGraph: {
    title: "Bulk & Corporate Gifting | Distribute Happiness",
    description:
      "Wholesale custom merchandise for companies, startups, and weddings. Fast turnaround and direct WhatsApp connect.",
  },
};

export default function BulkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
