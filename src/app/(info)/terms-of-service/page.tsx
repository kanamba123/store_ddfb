// app/terms-and-conditions/page.tsx
import { API_URL } from "@/config/API";
import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.win2cop.com";
const pageUrl = `${siteUrl}/terms-and-conditions`;
const pageTitle = "Conditions Générales d'Utilisation | Win2Cop";
const pageDescription =
  "Consultez nos conditions générales d'utilisation pour comprendre vos droits et obligations.";

// 📌 Génération des métadonnées dynamiques SSR
export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  robots: "index, follow",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    type: "website",
    siteName: "Win2Cop",
    // images: [`${siteUrl}/images/cgu-og.jpg`],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    // images: [`${siteUrl}/images/cgu-og.jpg`],
  },
};

// ✅ SSR data fetch
async function getTermsContent(): Promise<string> {
  const res = await fetch(`${API_URL}/terms-and-conditions`, {
    next: { revalidate: 86400 }, // Revalidation chaque 24h
  });

  if (!res.ok) throw new Error("Erreur lors du chargement des conditions.");
  return await res.text();
}

export default async function TermsConditionsPage() {
  let content: string;

  try {
    content = await getTermsContent();
  } catch (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center text-red-600">
        Erreur : Impossible de charger les conditions générales d'utilisation.
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Conditions Générales d'Utilisation",
    description: pageDescription,
    url: pageUrl,
    publisher: {
      "@type": "Organization",
      name: "Win2Cop",
      url: siteUrl,
    },
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10" aria-live="polite">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Conditions Générales d'Utilisation
      </h1>

      <article
        className="prose prose-blue max-w-none"
        dangerouslySetInnerHTML={{
          __html: content || "<p>Aucun contenu disponible pour le moment.</p>",
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </main>
  );
}
