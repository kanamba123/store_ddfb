// app/dashboard/layout.jsx
import DashboardLayout from '@/layouts/DashboardLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Win2Cop | Dashboard vendeur",
  description:
    "Boostez vos ventes avec Win2Cop. Accédez au dashboard pour gérer vos produits, commandes et boutiques en ligne.",
  keywords: [
    "Win2Cop dashboard",
    "gestion boutique",
    "vendeurs",
    "e-commerce",
    "commandes",
    "produits",
  ],
  authors: [{ name: "Win2Cop Seller Team" }],
  metadataBase: new URL("https://s.win2cop.com"),
  alternates: {
    canonical: "/dashboard",
  },
  icons: {
    icon: "/logoApp.png",     
    shortcut: "/logoApp.png", 
    apple: "/logoApp.png",   
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    url: "https://s.win2cop.com/dashboard",
    title: "Win2Cop - Dashboard vendeur",
    description:
      "Gérez vos produits, commandes et boutiques en ligne avec Win2Cop.",
    siteName: "Win2Cop Sellers",
    locale: "fr_FR",
    images: [
      {
        url: "https://s.win2cop.com/online-selling.jpg",
        width: 1200,
        height: 630,
        alt: "Dashboard Win2Cop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@win2cop_sellers",
    creator: "@win2cop_sellers",
    title: "Win2Cop - Dashboard vendeur",
    description:
      "Accédez au dashboard Win2Cop pour gérer votre boutique en ligne facilement.",
    images: ["https://s.win2cop.com/online-selling.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
