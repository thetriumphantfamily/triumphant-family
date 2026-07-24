import type { Metadata } from "next";
import { Poppins, Great_Vibes } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { SEO, SITE } from "@/lib/constants";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import AnnouncementBanner from "@/components/layout/AnnouncementBanner";
import "./globals.css";

const poppins = Poppins({
  subsets:  ["latin"],
  weight:   ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display:  "swap",
});

const greatVibes = Great_Vibes({
  subsets:  ["latin"],
  weight:   "400",
  variable: "--font-great-vibes",
  display:  "swap",
});

export const metadata: Metadata = {
  title: {
    default:  SEO.title,
    template: `%s | ${SITE.name}`,
  },
  description: SEO.description,
  keywords:    SEO.keywords,
  authors:     [{ name: SEO.author }],
  creator:     SEO.author,
  metadataBase: new URL(SEO.url),
  manifest:    "/site.webmanifest",
  openGraph: {
    title:       SEO.title,
    description: SEO.description,
    url:         SEO.url,
    siteName:    SITE.name,
    images: [
      {
        url:    SEO.ogImage,
        width:  1200,
        height: 630,
        alt:    SITE.fullName,
      },
    ],
    locale: "en_NG",
    type:   "website",
  },
  twitter: {
    card:        "summary_large_image",
    title:       SEO.title,
    description: SEO.description,
    images:      [SEO.ogImage],
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel:  "icon",
        url:  "/web-app-manifest-192x192.png",
        sizes: "192x192",
      },
      {
        rel:  "icon",
        url:  "/web-app-manifest-512x512.png",
        sizes: "512x512",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${greatVibes.variable}`}
    >
      <body className="font-body antialiased min-h-screen flex flex-col">
        <AnnouncementBanner />
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <WhatsAppButton />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background:   "#6B1F8A",
              color:        "#fff",
              borderRadius: "12px",
              padding:      "12px 20px",
              fontWeight:   "500",
            },
            success: {
              iconTheme: {
                primary:   "#FFC72C",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}