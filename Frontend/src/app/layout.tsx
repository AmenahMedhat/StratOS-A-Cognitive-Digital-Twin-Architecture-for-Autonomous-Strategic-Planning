import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StratOS — Cognitive Digital Twin",
  description: "Autonomous Strategic Planning for University C-Suite Executives",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#080a14] antialiased">{children}</body>
    </html>
  );
}
