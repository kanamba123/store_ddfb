// app/privacy-policy/page.tsx
import { API_URL } from "@/config/API";
import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.win2cop.com";
const pageUrl = `${siteUrl}/privacy-policy`;
const pageTitle = "Politique de Confidentialité | Win2Cop";
const pageDescription =
  "Consultez notre politique de confidentialité pour comprendre comment vos données personnelles sont collectées, utilisées et protégées.";

// 📌 Métadonnées dynamiques SSR
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
    // images: [`${siteUrl}/images/privacy-og.jpg`],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    // images: [`${siteUrl}/images/privacy-og.jpg`],
  },
};

// ✅ SSR data fetch
async function getPrivacyContent(): Promise<string> {
  const res = await fetch(`${API_URL}/privancy-police`, {
    cache: "no-store", // ou 'force-cache' si contenu statique
  });

  if (!res.ok)
    throw new Error(
      "Erreur lors du chargement de la politique de confidentialité."
    );

  return await res.text();
}

export default async function PrivacyPolicyPage() {
  let content: string;

  try {
    content = await getPrivacyContent();
  } catch (error) {
    return (
      <div className="max-w-4xl mx-auto px-1 py-10 text-center text-red-600">
        Erreur : Impossible de charger le contenu de la politique de
        confidentialité.
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Politique de Confidentialité",
    description: pageDescription,
    url: pageUrl,
    publisher: {
      "@type": "Organization",
      name: "Win2Cop",
      url: siteUrl,
    },
  };

  return (
    <main className="max-w-4xl mx-auto px-1 py-10" aria-live="polite">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Politique de Confidentialité
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
