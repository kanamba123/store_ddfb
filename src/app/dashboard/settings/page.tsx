'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    // Simuler une requête API
    await new Promise((r) => setTimeout(r, 1000));

    setIsSaving(false);
    setMessage('Paramètres sauvegardés avec succès !');
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Paramètres</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
        >
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>

        {message && (
          <p className="mt-4 text-green-600 font-medium text-center">{message}</p>
        )}
      </div>
    </div>
  );
}
