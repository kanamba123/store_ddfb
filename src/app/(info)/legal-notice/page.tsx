// app/legal-notice/page.tsx
import { API_URL } from "@/config/API";
import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.win2cop.com";

export const metadata: Metadata = {
  title: "Mentions Légales | Win2Cop",
  description: "Informations légales et réglementaires concernant notre site et notre société.",
  openGraph: {
    title: "Mentions Légales | Win2Cop",
    description: "Informations légales et réglementaires concernant notre site et notre société.",
    url: `${siteUrl}/legal-notice`,
    type: "website",
    siteName: "Win2Cop",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mentions Légales | Win2Cop",
    description: "Retrouvez ici les informations légales de notre site Win2Cop.",
  },
  alternates: {
    canonical: `${siteUrl}/legal-notice`,
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(siteUrl),
};

async function getLegalNotice() {
  const res = await fetch(`${API_URL}/legal-notice`, {
    next: { revalidate: 86400 }, // Revalidation every 24h
  });
  if (!res.ok) throw new Error("Failed to load legal notice");
  return await res.text();
}

export default async function LegalNoticePage() {
  try {
    const content = await getLegalNotice();

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Mentions Légales",
      url: `${siteUrl}/legal-notice`,
      description: "Informations légales et réglementaires concernant notre site et notre société.",
      publisher: {
        "@type": "Organization",
        name: "Win2Cop",
        url: siteUrl,
      },
    };

    return (
      <main className="max-w-4xl mx-auto px-4 py-8" lang="fr">
        <h1 className="text-3xl font-bold mb-6 text-center">Mentions Légales</h1>
        <article
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </main>
    );
  } catch (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center text-red-600">
        Erreur : Impossible de charger les mentions légales
      </div>
    );
  }
}
