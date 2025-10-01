import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "./Providers";
import PageTransition from "@/components/PageTransition";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PoetByte - Dynamic Poetry Website",
  description: "A modern platform for poetry enthusiasts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50 flex flex-col`}>
        <Providers>
          <Navbar />
          <main className="container mx-auto px-4 py-8 flex-1">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <footer className="py-8">
            <div className="container mx-auto px-4 text-center">
              <p>
                <a
                  href="https://www.linkedin.com/in/vivek-r-626b16217"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-lg font-semibold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent hover:opacity-90 transition-opacity"
                >
                  Poetry in the front, Code in the back  Crafted by Vivek R
                </a>
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
