"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Remplacer par ton vrai hook d'auth ou contexte
const useAuth = () => {
  return { isAuthenticated: false }; // ⬅ À remplacer
};

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth(); // 👈 Remplacer par ton vrai hook

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md w-full px-4 sm:px-6 py-4 flex justify-between items-center transition-colors duration-300">
        <h1 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
          Win2cop
        </h1>
        <div className="flex space-x-2 sm:space-x-4">
          <button
            onClick={() => router.push("/login")}
            className="text-sm px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200"
          >
            Connexion
          </button>
          <button
            onClick={() => router.push("/register")}
            className="text-sm px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl transition-colors duration-200"
          >
            S'inscrire
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6">
            Gérez votre boutique avec simplicité.
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-6 sm:mb-8">
            Une solution complète pour gérer vos produits, vos commandes et vos
            statistiques.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => router.push("/register")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-xl text-sm sm:text-base font-medium transition-colors duration-200"
            >
              Commencer maintenant
            </button>
            <button
              onClick={() => router.push("/features")}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl text-sm sm:text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              En savoir plus
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-inner py-4 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
        © {new Date().getFullYear()} Win2cop. Tous droits réservés.
      </footer>
    </div>
  );
}
