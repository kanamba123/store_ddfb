import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import PageTransitionLoader from "@/components/PageTransitionLoader";
import InternationalizationProvider from "@/components/InternationalizationProvider";

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
      "Libérez le potentiel de votre boutique en ligne avec Win2Cop ! Notre plateforme e-commerce vous offre tous les outils pour booster vos ventes, toucher plus de clients et faire grandir votre business rapidement. Rejoignez une communauté de vendeurs passionnés et transformez vos idées en succès concret.",
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
      "Transformez votre passion en succès avec Win2Cop ! Rejoignez la communauté de vendeurs qui développent leur business, optimisent leurs ventes et atteignent de nouveaux sommets. Votre réussite commence ici et maintenant !",
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
          <InternationalizationProvider>
            <PageTransitionLoader />
            <main>{children}</main>
          </InternationalizationProvider>
        </Providers>
      </body>
    </html>
  );
}