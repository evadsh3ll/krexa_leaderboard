import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

const sans = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KREXA — Bill Challenge",
  description:
    "Post your May AI bill. Climb the leaderboard. The top 3 highest spenders win 3× their bill in Krexa credits — live on Solana.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${sans.variable} ${mono.variable} ${pixel.variable}`}>
        {children}
      </body>
    </html>
  );
}
