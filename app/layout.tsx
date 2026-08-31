import type { Metadata } from "next";
import { business } from "@/content";
import "./globals.css";

export const metadata: Metadata = {
  title: business.name,
  description: `Premium mobile and drop-off car detailing in ${business.regionLong}.`,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-base text-ink min-h-screen">{children}</body>
    </html>
  );
}
