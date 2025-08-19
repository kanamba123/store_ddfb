'use client';

import Link from 'next/link';

type Props = {
  mode?: 'notfound' | 'comingsoon';
};

export default function InfoPage({ mode = 'notfound' }: Props) {
  const isNotFound = mode === 'notfound';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-indigo-100 via-blue-50 to-white px-6">
      <div className="max-w-md text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto mb-6 w-40 h-40 text-indigo-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={
              isNotFound
                ? 'M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z' // Croix pour 404
                : 'M12 4v16m8-8H4' // Icône "plus" pour en construction
            }
          />
        </svg>

        <h1 className="text-5xl font-extrabold text-indigo-700 mb-4">
          {isNotFound ? '404' : 'En construction'}
        </h1>

        <p className="text-lg text-indigo-600 mb-6">
          {isNotFound
            ? 'Oups ! La page que vous cherchez n’existe pas.'
            : 'Cette page est en cours de construction. Revenez bientôt !'}
        </p>

        <Link
          href="/"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
}
