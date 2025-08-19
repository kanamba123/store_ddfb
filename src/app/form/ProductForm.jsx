'use client';

import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext'; // ton AuthProvider

export default function ProductForm() {
  const { user, token, logout } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          userId: user?.id || user?.Id_Utilisateur, // adapte au schéma de ton user
        }),
      });

      if (response.status === 401) {
        // Token expiré ou invalide
        alert('Session expirée. Veuillez vous reconnecter.');
        logout(); // déclenche le logout global
        return;
      }

      if (!response.ok) {
        throw new Error('Erreur lors de l’enregistrement');
      }

      const result = await response.json();
      alert('Produit enregistré avec succès');
      reset();

    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white rounded shadow max-w-xl">
      <h2 className="text-lg font-semibold">Ajouter un produit</h2>

      <div>
        <label className="block mb-1 font-medium">Nom du produit</label>
        <input
          {...register('name', { required: true })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.name && <p className="text-red-500 text-sm">Champ requis</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Prix</label>
        <input
          type="number"
          {...register('price', { required: true })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.price && <p className="text-red-500 text-sm">Champ requis</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          rows={3}
          {...register('description')}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </form>
  );
}
