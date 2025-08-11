import type { Metadata } from "next";

import "./globals.css";

// Supports weights 100-900
import "@fontsource-variable/geist";
export const metadata: Metadata = {
  title: "Doctor Assessment Checklist",
  description:
    "Checklist for evaluating doctor performance during travel health consultations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased bg-gray-50 min-h-screen`}>{children}</body>
    </html>
  );
}
