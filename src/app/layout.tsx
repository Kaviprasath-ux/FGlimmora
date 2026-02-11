import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FilmGlimmora — Cinematic Intelligence Platform",
  description: "AGI-native movie estimation & production intelligence platform for Tollywood and global cinema.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
