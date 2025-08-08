import type { Metadata } from "next";

import "./globals.css";

// Supports weights 100-900
import '@fontsource-variable/geist';
export const metadata: Metadata = {
  title: "Travel Health Assessment Quiz",
  description: "Interactive quiz for travel health assessment evaluation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} antialiased bg-gray-50 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
