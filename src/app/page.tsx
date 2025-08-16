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
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors">
      {/* Header */}
      <header className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-[var(--color-primary)] sm:text-2xl">
            Win2cop
          </h1>
          <div className="flex space-x-3 sm:space-x-4">
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors sm:text-base"
            >
              Connexion
            </button>
            <button
              onClick={() => router.push("/register")}
              className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-sm font-medium rounded-lg transition-colors sm:px-6 sm:text-base"
            >
              Commencer
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero */}
          <h2 className="text-4xl font-bold mb-6 sm:text-5xl lg:text-6xl">
            Gérez votre boutique{" "}
            <span className="text-[var(--color-primary)]"> simplement</span>
          </h2>

          <p className="text-lg text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto sm:text-xl lg:mb-12">
            Tout ce dont vous avez besoin pour faire grandir votre business
          </p>

          <button
            onClick={() => router.push("/register")}
            className="w-full px-8 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold rounded-lg text-lg transition-colors mb-16 sm:w-auto sm:mb-20"
          >
            Essayer gratuitement
          </button>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {/* Produits */}
            <div className="text-center sm:text-left">
              <div className="w-12 h-12 bg-[var(--color-primary-light)] rounded-lg flex items-center justify-center mx-auto mb-4 sm:mx-0">
                <svg
                  className="w-6 h-6 text-[var(--color-primary)]"
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
              <h3 className="text-xl font-semibold mb-2 sm:text-lg">Produits</h3>
              <p className="text-[var(--color-text-secondary)] text-sm sm:text-base">
                Ajoutez et gérez vos produits en quelques clics
              </p>
            </div>

            {/* Commandes */}
            <div className="text-center sm:text-left">
              <div className="w-12 h-12 bg-[var(--color-primary-light)] rounded-lg flex items-center justify-center mx-auto mb-4 sm:mx-0">
                <svg
                  className="w-6 h-6 text-[var(--color-primary)]"
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
              <h3 className="text-xl font-semibold mb-2 sm:text-lg">Commandes</h3>
              <p className="text-[var(--color-text-secondary)] text-sm sm:text-base">
                Suivez toutes vos ventes en temps réel
              </p>
            </div>

            {/* Statistiques */}
            <div className="text-center sm:text-left sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-[var(--color-primary-light)] rounded-lg flex items-center justify-center mx-auto mb-4 sm:mx-0">
                <svg
                  className="w-6 h-6 text-[var(--color-primary)]"
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
              <h3 className="text-xl font-semibold mb-2 sm:text-lg">Statistiques</h3>
              <p className="text-[var(--color-text-secondary)] text-sm sm:text-base">
                Analysez vos performances facilement
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-6 border-t border-[var(--color-border)] sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-[var(--color-text-secondary)]">
            © 2025 Win2cop
          </p>
        </div>
      </footer>
    </div>
  );
}
