import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import PageTransitionLoader from "@/components/PageTransitionLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Win2Cop | Plateforme e-commerce pour vendeurs et boutiques",
  description:
    "Boostez vos ventes avec Win2Cop, la plateforme e-commerce dédiée aux vendeurs et boutiques. Outils performants, visibilité accrue et croissance garantie pour votre business en ligne.",
  keywords: [
    "Win2Cop vendeurs",
    "plateforme e-commerce",
    "boutique en ligne",
    "vendre en ligne",
    "marketplace",
    "gestion de boutique",
    "paiement sécurisé",
    "Burundi e-commerce",
    "Afrique commerce",
    "solution e-commerce",
    "outils vendeurs",
  ],
  authors: [{ name: "Win2Cop Seller Team" }],
  metadataBase: new URL("https://s.win2cop.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logoApp.png",
    shortcut: "/logoApp.png",
    apple: "/logoApp.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    url: "https://s.win2cop.com/",
    title: "Win2Cop - Votre boutique en ligne puissante",
    description:
      "Transformez votre passion en business avec Win2Cop. La plateforme e-commerce qui donne aux vendeurs les outils pour réussir et grandir.",
    siteName: "Win2Cop Sellers",
    locale: "fr_FR",
    images: [
      {
        url: "https://s.win2cop.com/online-selling.jpg",
        width: 1200,
        height: 630,
        alt: "Plateforme vendeurs Win2Cop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@win2cop_sellers",
    creator: "@win2cop_sellers",
    title: "Win2Cop - La puissance e-commerce pour votre boutique",
    description:
      "Rejoignez la communauté de vendeurs qui transforment leur business avec Win2Cop. Votre succès commence ici.",
    images: ["https://s.win2cop.com/online-selling.jpg"],
  },
  other: {
    "google-site-verification": "dD8UWR2jFPLfVHce9jDMnjQGgCo3YnSr3883R_0VULQ",
    "fb:app_id": "617888837240926",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <PageTransitionLoader />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
