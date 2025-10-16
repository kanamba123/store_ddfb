"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/config/API";

export default function CreateUserForEmployeePage() {
  const { token, targetUserName } = useParams<{ token: string; targetUserName: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });

  // ✅ Validation du token
  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await axios.get(`${API_URL}/public-upload/validateSiginUpEmployee/${targetUserName}/${token}`);
        if (!res.data.valid) {
          setError(res.data.error || "⛔ Lien invalide ou expiré.");
        }
      } catch {
        setError("⛔ Erreur lors de la validation du lien.");
      } finally {
        setLoading(false);
      }
    };
    validateToken();
  }, [token, targetUserName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/public-upload/createUserForEmployeeByToken`, {
        token,
        targetUserName,
        email: form.email,
        password: form.password,
      });

      if (res.data.success) {
        setSubmitted(true);
      } else {
        setError(res.data.error || "Erreur lors de la création du compte.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Erreur lors de la création du compte.");
    }
  };

  if (loading)
    return <div className="text-center mt-20">⏳ Vérification du lien...</div>;

  if (error)
    return (
      <div className="max-w-md mx-auto mt-20 p-4 bg-red-100 text-red-600 rounded text-center">
        {error}
      </div>
    );

  if (submitted)
    return (
      <div className="max-w-md mx-auto mt-20 p-4 bg-green-100 text-green-700 rounded text-center">
        ✅ Votre compte a été créé avec succès !
      </div>
    );

  return (
    <div className="max-w-md mx-auto mt-20 bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4 text-center">Créer votre compte utilisateur</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Créer mon compte
        </button>
      </form>
    </div>
  );
}
