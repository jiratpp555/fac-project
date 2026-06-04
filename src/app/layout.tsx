import type { Metadata } from "next";
import { Mitr, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const mitr = Mitr({
  variable: "--font-sans",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FAC — Factory Art Centre",
  description: "สตูดิโอสอนศิลปะและการออกแบบ ที่เชื่อว่า First impression ของการเรียนศิลปะนั้นสำคัญที่สุด",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${mitr.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
