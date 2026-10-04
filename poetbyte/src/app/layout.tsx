import type { Metadata } from "next";
import { EB_Garamond, Cinzel_Decorative, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "./Providers";
import PageTransition from "@/components/PageTransition";
import Celestial3DBackground from "@/components/Celestial3DBackground";

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
  display: "swap",
});

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-cinzel",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PoetByte • Poetry & Reflections Anthology",
  description: "A personal sanctuary for poems, quotes, and lyrical verses by Vivek R.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${garamond.variable} ${cinzel.variable} ${playfair.variable} min-h-screen bg-[#100b08] text-[#f7eedb] flex flex-col relative selection:bg-[#991b1b] selection:text-[#fef3c7]`}
      >
        <Providers>
          {/* Vintage Candlelight & Dust Motes 3D Background */}
          <Celestial3DBackground />

          {/* Navigation */}
          <Navbar />

          {/* Main Literary Body */}
          <main className="flex-1 relative z-10">
            <PageTransition>{children}</PageTransition>
          </main>

          {/* Seamlessly Blended Footer */}
          <footer className="relative z-10 py-10">
            <div className="container mx-auto px-4 max-w-6xl text-center">
              <p>
                <a
                  href="https://vivekr.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-base sm:text-lg font-serif italic text-gradient-gold hover:opacity-90 transition-all duration-300"
                >
                  "Poetry in the front, Code in the back" • Hand-penned by Vivek R
                </a>
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
