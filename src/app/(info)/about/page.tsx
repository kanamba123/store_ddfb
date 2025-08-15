// app/about-win2cop/page.tsx
import { API_URL } from "@/config/API";
import { Metadata } from "next";
import Image from "next/image";

const siteUrl =  "https://www.win2cop.com";
const pageUrl = `${siteUrl}/about-win2cop`;
const pageTitle = "À propos de Win2Cop | Notre histoire et valeurs";
const pageDescription = "Découvrez l'histoire, la mission et les valeurs de Win2Cop, leader dans son secteur d'activité.";

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
    images: [
      {
        url: `${siteUrl}/images/og/winwin.png`,
        width: 1200,
        height: 630,
        alt: "L'équipe Win2Cop réunie dans nos locaux",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [`${siteUrl}/images/og/winwin.png`],
  },
};

async function getAboutContent(): Promise<string> {
  const res = await fetch(`${API_URL}/about-win2cop`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Erreur lors du chargement du contenu.");
  return await res.text();
}

export default async function AboutWin2copPage() {
  let content: string;

  try {
    content = await getAboutContent();
  } catch (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center text-red-600">
        Erreur : Impossible de charger le contenu.
        <p className="text-sm mt-2">{(error as Error).message}</p>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "À propos de Win2Cop",
    description: pageDescription,
    publisher: {
      "@type": "Organization",
      name: "Win2Cop",
      url: siteUrl,
      logo: `${siteUrl}/images/og/win2copLogo.png`,
    },
    image: `${siteUrl}/images/og/win2copLogo.jpg`,
    url: pageUrl,
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <header className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">À propos de Win2Cop</h1>
        <p className="text-lg text-gray-600">Notre histoire, notre passion</p>
      </header>


      <article
        className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-600"
        dangerouslySetInnerHTML={{
          __html: content || "<p>Notre histoire est en cours de rédaction.</p>",
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