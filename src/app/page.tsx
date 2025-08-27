"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Remplacer par ton vrai hook d'auth ou contexte
const useAuth = () => {
  return { isAuthenticated: false }; // ⬅️ À remplacer
};

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors relative overflow-hidden">
      {/* Image de fond avec overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('https://www.flagshipcompany.com/app/uploads/2017/02/international_shipping-1.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-[var(--color-bg-secondary)] mix-blend-multiply"></div>
      </div>

      {/* Contenu */}
      <div className="relative z-10">
        {/* Header */}
        <header className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-[var(--color-text-primary)] sm:text-2xl md:text-3xl">
                Win2cop
              </h1>
              <span className="ml-2 text-xs  text-[var(--color-secondary)] px-2 py-1 rounded-full hidden sm:block">
                Business
              </span>
            </div>
            <div className="flex space-x-2 sm:space-x-3 md:space-x-4">
              <button
                onClick={() => router.push("/login")}
                className="px-3 py-1 text-xs font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-action-add-hover)] border border-action-add rounded-2xl transition-colors sm:text-sm md:px-4 md:py-1 md:text-base"
              >
                Connexion
              </button>
              <button
                onClick={() => router.push("/register")}
                className="px-3 py-1.5  hover:bg-blue-50 text-blue-700 text-xs font-medium rounded-lg transition-colors shadow-md hover:shadow-lg sm:text-sm md:px-4 md:py-2 md:text-base"
              >
                Commencer
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 py-6 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Hero */}
            <h2 className="text-1xl font-bold mb-4 sm:text-4xl md:text-4xl lg:text-4xl lg:mb-6">
              Gérez votre boutique simplement
            </h2>

            <p className="text-base text-[var(--color-text-primary)] mb-6 max-w-2xl mx-auto sm:text-lg md:text-xl lg:mb-8">
              Tout ce dont vous avez besoin pour faire grandir votre business, avec un service de livraison intégré pour maximiser vos ventes.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12 sm:mb-16 md:mb-20">
              <button
                onClick={() => router.push("/register")}
                className="w-full px-6 py-3 bg-white hover:bg-blue-50 text-blue-700 font-semibold rounded-lg text-base transition-colors shadow-md hover:shadow-lg sm:w-auto md:px-8 md:py-4 md:text-lg"
              >
                Essayer gratuitement
              </button>
              <button
                onClick={() => router.push("/features")}
                className="w-full px-6 py-3 bg-[var(--color-bg-secondary)] hover:bg-white/20 text-[var(--color-secondary)] font-semibold rounded-lg text-base transition-colors border border-white/20 sm:w-auto md:px-8 md:py-4 md:text-lg"
              >
                Voir les fonctionnalités
              </button>
            </div>

          </div>

          {/* Features */}
          <div className="max-w-6xl mx-auto mt-12 sm:mt-16 md:mt-20">
            <h3 className="text-xl font-bold text-center mb-8 sm:text-2xl md:text-3xl md:mb-12">Tout pour gérer votre business</h3>
            
            <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-10">
              {/* Produits */}
              <div className="bg-[var(--color-bg-secondary)] backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/15 transition-all sm:p-5 md:p-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3 sm:w-12 sm:h-12 sm:mb-4">
                  <svg
                    className="w-5 h-5 text-blue-300 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-1 sm:text-xl sm:mb-2">Gestion des produits</h3>
                <p className="text-[var(--color-text-secondary)] text-sm sm:text-base">
                  Ajoutez et gérez vos produits en quelques clics avec des photos et descriptions détaillées.
                </p>
              </div>

              {/* Commandes */}
              <div className="bg-[var(--color-bg-secondary)] backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/15 transition-all sm:p-5 md:p-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3 sm:w-12 sm:h-12 sm:mb-4">
                  <svg
                    className="w-5 h-5 text-blue-300 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-1 sm:text-xl sm:mb-2">Suivi des commandes</h3>
                <p className="text-[var(--color-text-secondary)] text-sm sm:text-base">
                  Suivez toutes vos ventes en temps réel et gérez les statuts de chaque commande.
                </p>
              </div>

              {/* Livraison */}
              <div className="bg-[var(--color-bg-secondary)] backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/15 transition-all sm:p-5 md:p-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3 sm:w-12 sm:h-12 sm:mb-4">
                  <svg
                    className="w-5 h-5 text-blue-300 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-1 sm:text-xl sm:mb-2">Service de livraison</h3>
                <p className="text-[var(--color-text-secondary)] text-sm sm:text-base">
                  Les magasins connectés bénéficient de notre service de livraison intégré pour étendre leur zone de chalandise.
                </p>
              </div>

              {/* Statistiques */}
              <div className="bg-[var(--color-bg-secondary)] backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/15 transition-all sm:p-5 md:p-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3 sm:w-12 sm:h-12 sm:mb-4">
                  <svg
                    className="w-5 h-5 text-blue-300 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-1 sm:text-xl sm:mb-2">Analytiques avancées</h3>
                <p className="text-[var(--color-text-secondary)] text-sm sm:text-base">
                  Analysez vos performances avec des rapports détaillés sur les ventes, stocks et tendances.
                </p>
              </div>

              {/* Clients */}
              <div className="bg-[var(--color-bg-secondary)] backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/15 transition-all sm:p-5 md:p-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3 sm:w-12 sm:h-12 sm:mb-4">
                  <svg
                    className="w-5 h-5 text-blue-300 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-1 sm:text-xl sm:mb-2">Gestion des clients</h3>
                <p className="text-[var(--color-text-secondary)] text-sm sm:text-base">
                  Centralisez les informations clients et fidélisez votre audience avec des outils marketing.
                </p>
              </div>

              {/* Synchronisation */}
              <div className="bg-[var(--color-bg-secondary)] backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/15 transition-all sm:p-5 md:p-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3 sm:w-12 sm:h-12 sm:mb-4">
                  <svg
                    className="w-5 h-5 text-blue-300 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-1 sm:text-xl sm:mb-2">Multi-plateformes</h3>
                <p className="text-[var(--color-text-secondary)] text-sm sm:text-base">
                  Synchronisez vos données entre plusieurs points de vente et canaux de vente en ligne.
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Section */}
          <div className="max-w-6xl mx-auto mt-12 p-6 bg-[var(--color-bg-secondary)] backdrop-blur-sm rounded-2xl border border-white/10 sm:mt-16 md:mt-20 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="md:w-1/2">
                <h3 className="text-xl font-bold mb-3 sm:text-2xl md:text-3xl md:mb-4">Service de livraison intégré</h3>
                <p className="text-white/80 mb-4 text-sm sm:text-base md:mb-6">
                  Chaque magasin connecté à Win2cop bénéficie automatiquement de notre service de livraison performant. 
                  Étendez votre zone de vente, proposez la livraison à domicile à vos clients et suivez chaque colis en temps réel.
                </p>
                <ul className="space-y-2 mb-4 md:mb-6">
                  <li className="flex items-center text-sm sm:text-base">
                    <svg className="w-4 h-4 text-blue-300 mr-2 flex-shrink-0 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Livraison suivie en temps réel</span>
                  </li>
                  <li className="flex items-center text-sm sm:text-base">
                    <svg className="w-4 h-4 text-blue-300 mr-2 flex-shrink-0 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Tarifs préférentiels pour les magasins partenaires</span>
                  </li>
                  <li className="flex items-center text-sm sm:text-base">
                    <svg className="w-4 h-4 text-blue-300 mr-2 flex-shrink-0 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Gestion simplifiée des retours</span>
                  </li>
                </ul>
                <button
                  onClick={() => router.push("/delivery")}
                  className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 font-medium rounded-lg transition-colors text-sm sm:text-base md:px-6 md:py-3"
                >
                  En savoir plus
                </button>
              </div>
              <div className="md:w-1/2 mt-6 md:mt-0">
                <div className="bg-[var(--color-bg-secondary)] backdrop-blur-sm p-4 rounded-xl border border-white/10 sm:p-5 md:p-6">
                  <div className="flex justify-between items-center mb-4 md:mb-6">
                    <div className="text-sm font-medium sm:text-base">Livraison express</div>
                    <div className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full sm:text-sm">Disponible</div>
                  </div>
                  <div className="h-32 bg-white/5 rounded-lg mb-4 flex items-center justify-center sm:h-36 md:h-40">
                    <svg className="w-10 h-10 text-blue-300 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-semibold mb-1 sm:text-lg md:mb-2">Livraison sécurisée</div>
                    <p className="text-xs text-white/70 sm:text-sm">Chaque colis est assuré jusqu'à 1000€</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-4 py-8 mt-12 bg-white/5 backdrop-blur-sm border-t border-white/10 sm:px-6 sm:py-10 sm:mt-16 lg:px-8 lg:py-12 lg:mt-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 gap-6 mb-6 sm:grid-cols-4 sm:gap-8 sm:mb-8">
              <div className="col-span-2 sm:col-span-1">
                <h4 className="text-base font-semibold mb-2 sm:text-lg sm:mb-4">Win2cop</h4>
                <p className=" text-xs sm:text-sm">
                  La solution tout-en-un pour gérer et développer votre commerce.
                </p>
              </div>
              <div>
                <h4 className="text-base font-semibold mb-2 sm:text-lg sm:mb-4">Fonctionnalités</h4>
                <ul className="space-y-1 text-xs  sm:text-sm sm:space-y-2">
                  <li>Gestion des produits</li>
                  <li>Suivi des commandes</li>
                  <li>Service de livraison</li>
                  <li>Analyses et rapports</li>
                </ul>
              </div>
              <div>
                <h4 className="text-base font-semibold mb-2 sm:text-lg sm:mb-4">Légal</h4>
                <ul className="space-y-1 text-xs  sm:text-sm sm:space-y-2">
                  <li>Conditions d'utilisation</li>
                  <li>Politique de confidentialité</li>
                  <li>Mentions légales</li>
                  <li>Cookies</li>
                </ul>
              </div>
            </div>
            <div className="pt-6 border-t border-white/10 text-center sm:pt-8">
              <p className="text-xs  sm:text-sm">
                © 2025 Win2cop. Tous droits réservés.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}