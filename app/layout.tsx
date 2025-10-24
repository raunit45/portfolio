import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import RotatingLogo from "@/components/ui/RotatingLogo";
import { BackgroundLines } from "@/components/ui/background-lines";
import { CursorSparkles } from "@/components/ui/cursor-sparkles";
import SplashGate from "@/components/ui/SplashGate"; // ⬅️ add this
import MotionProvider from "@/components/ui/MotionProvider";
import Link from "next/link";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Raunit Raj Portfolio",
  description: "Interactive portfolio website with 3D game mode",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-neutral-100 h-full min-h-screen relative overflow-x-hidden`}
      >
        {/* Background & logo */}
        <BackgroundLines className="pointer-events-none fixed inset-0 z-0" svgOptions={{ duration: 8 }}>
          {null}
        </BackgroundLines>
        <RotatingLogo />

        {/* Cursor sparkles */}
        <CursorSparkles />

        {/* Play Game (kept under splash) */}
        <Link
          href="/funarea"
          className="fixed top-4 right-6 z-40 px-5 py-2 rounded-lg
               bg-gradient-to-r from-indigo-500 to-sky-500
               text-[#000000] dark:text-[#000000] font-semibold shadow-lg
               hover:scale-105 hover:shadow-indigo-500/40
               transition-all duration-300 ease-out"
        >
          🎮 Play Game
        </Link>

        {/* Page content gated by splash */}
        <main className="relative z-10 min-h-screen">
          <MotionProvider>
            <SplashGate>{children}</SplashGate>
          </MotionProvider>
        </main>
      </body>
    </html>
  );
}