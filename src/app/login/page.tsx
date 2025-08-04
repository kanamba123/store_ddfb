'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const demoUser = {
      email: 'admin@example.com',
      password: '123456',
    };

    if (email === demoUser.email && password === demoUser.password) {
      setErrorMsg('');
      router.push('/dashboard');
    } else {
      setErrorMsg('Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Connexion</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-600 text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
          >
            Se connecter
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Créer un compte
          </Link>
        </p>

        <div className="text-xs text-center text-gray-400 pt-2">
          <p>Démo : admin@example.com / 123456</p>
        </div>
      </div>
    </div>
  );
}
