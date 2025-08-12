import type { Metadata } from "next";

import "./globals.css";

// Supports weights 100-900
import "@fontsource-variable/geist";
export const metadata: Metadata = {
  title: "NSTM Certification Course - Capstone Project Assessment",
  description:
    "Nigerian Society of Travel Medicine - Comprehensive evaluation tool for assessing doctor performance during travel health consultations",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/icon-192x192.png"
          sizes="192x192"
          type="image/png"
        />
        <link
          rel="icon"
          href="/icon-512x512.png"
          sizes="512x512"
          type="image/png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#059669" />
      </head>
      <body className={`antialiased bg-gray-50 min-h-screen`}>{children}</body>
    </html>
  );
}
