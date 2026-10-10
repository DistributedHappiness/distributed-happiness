import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account & Saved Gifts",
  description: "Manage your profile, saved shipping addresses, order history, and wishlist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
