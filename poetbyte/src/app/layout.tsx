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

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://poetbyte.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "PoetByte • Poetry & Reflections Anthology by Vivek R",
    template: "%s | PoetByte • Vivek R",
  },
  description:
    "Writing is an art where the soul finds its voice, turning unspoken emotions into words and silent thoughts into poetry. A personal anthology of lyrical verses, poems, and quotes by Vivek R.",
  keywords: [
    "PoetByte",
    "Vivek R",
    "Vivek R poems",
    "Writing is an art where the soul finds its voice",
    "turning unspoken emotions into words",
    "poetry anthology",
    "contemporary poetry",
    "poetbyte",
    "Vivek R quotes",
    "literature",
    "verses",
    "Poems"
  ],
  authors: [{ name: "Vivek R", url: "https://vivekr.vercel.app/" }],
  creator: "Vivek R",
  publisher: "PoetByte",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "PoetByte",
    title: "PoetByte • Poetry & Reflections Anthology by Vivek R",
    description:
      "Writing is an art where the soul finds its voice, turning unspoken emotions into words and silent thoughts into poetry. An illuminated anthology by Vivek R.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PoetByte • Poetry & Reflections Anthology by Vivek R",
    description:
      "Writing is an art where the soul finds its voice, turning unspoken emotions into words and silent thoughts into poetry.",
    creator: "@vivekr",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "googlec8ce9975ab4c203f",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "PoetByte",
      description:
        "Writing is an art where the soul finds its voice, turning unspoken emotions into words and silent thoughts into poetry. An anthology by Vivek R.",
      publisher: {
        "@type": "Person",
        name: "Vivek R",
        url: "https://vivekr.vercel.app/",
      },
    },
    {
      "@type": "Person",
      "@id": "https://vivekr.vercel.app/#person",
      name: "Vivek R",
      url: "https://vivekr.vercel.app/",
      jobTitle: "Poet & Creator",
      sameAs: ["https://vivekr.vercel.app/"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
