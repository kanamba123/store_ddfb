'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Remplacer par ton vrai hook d'auth ou contexte
const useAuth = () => {
  return { isAuthenticated: false }; // ⬅ À remplacer
};

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth(); // 👈 Remplacer par ton vrai hook

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow-md w-full px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-blue-600">Win2cop</h1>
        <div className="space-x-4">
          <button
            onClick={() => router.push('/login')}
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Connexion
          </button>
          <button
            onClick={() => router.push('/register')}
            className="text-sm px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
          >
            S’inscrire
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
          Gérez votre boutique avec simplicité.
        </h2>
        <p className="text-lg text-gray-600 max-w-xl mb-6">
          Une solution complète pour gérer vos produits, vos commandes et vos statistiques.
        </p>
        <button
          onClick={() => router.push('/register')}
          className="text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-sm font-medium"
        >
          Commencer maintenant
        </button>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Win2cop. Tous droits réservés.
      </footer>
    </div>
  );
}
