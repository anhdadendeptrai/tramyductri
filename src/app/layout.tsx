import type { Metadata } from "next";
import { Cormorant_Garamond, Caveat, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const serifFont = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const handwritingFont = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DUCTRI — OUR LITTLE BOOK",
  description: "A little memory, made for you. Seven days, countless memories.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${serifFont.variable} ${handwritingFont.variable} ${sansFont.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#FAF8F5] text-[#2B2825] font-sans selection:bg-[#E8DFD8] selection:text-[#2B2825] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
