import type { Metadata } from "next";
import { Fraunces, Outfit, Syne } from "next/font/google";
import { HelpBot } from "@/components/chatbot/helpBot";
import { COMPANY } from "@/lib/constants";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const serif = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${COMPANY.name} | Madhubani Art & Paintings`,
  description: COMPANY.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${serif.variable} ${body.variable} h-full`}
    >
      <body className="mithila-grid min-h-full antialiased">
        {children}
        <HelpBot />
      </body>
    </html>
  );
}
