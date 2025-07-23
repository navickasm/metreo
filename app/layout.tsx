import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Metreo",
  description: "Modern, simple, and powerful metronome",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
