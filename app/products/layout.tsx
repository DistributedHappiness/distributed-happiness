import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore All Personalized Gifts & Custom Keepsakes",
  description:
    "Browse our complete catalog of personalized ceramic mugs, custom engraved keychains, song plaques, and embroidered apparel with live 3D customizer preview.",
  openGraph: {
    title: "All Products — Distribute Happiness",
    description: "Personalized gifts and custom merchandise with real-time live preview.",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
