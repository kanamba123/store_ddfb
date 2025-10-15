"use client";

import { useState, useEffect } from "react";
import { Copy, Trash, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { API_URL } from "@/config/API";
import API from "@/config/Axios";

type LinkRecord = {
  id: number;
  token: string;
  targetUserName: string;
  targetType: string;
  targetId: number;
  userId: number;
  expiresAt: string;
  used: boolean;
};

export default function PrivateLinksPage() {
  const { t } = useTranslation();

  // --- États du formulaire ---
  const [userId, setUserId] = useState<number>(9); // Par défaut (admin ou HR)
  const [targetId, setTargetId] = useState<number>(0);
  const [targetType, setTargetType] = useState<string>("seller");
  const [targetUserName, setTargetUserName] = useState<string>("");
  const [validHours, setValidHours] = useState<number>(48);

  // --- Autres états ---
  const [links, setLinks] = useState<LinkRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // --- Récupération des liens existants ---
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await API.get(`/public-upload`);
        setLinks(res.data);
      } catch (err) {
        console.error("❌ Erreur lors du chargement des liens :", err);
      }
    };
    fetchLinks();
  }, []);

  // --- Génération d’un lien privé ---
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        userId,
        targetId,
        targetType,
        validHours,
        targetUserName,
      };

      const res = await API.post(`/public-upload/generateLinkToSiginUp`, payload);

      // Ajoute le nouveau lien à la liste
      setLinks((prev) => [res.data, ...prev]);
      setTargetUserName("");
      setTargetId(0);
      setValidHours(48);
    } catch (err) {
      console.error("❌ Erreur génération lien :", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Copier un lien ---
  const handleCopy = async (token: string, username: string) => {
    const url = `${window.location.origin}/rf/employees/generate/${username}/${token}`;
    await navigator.clipboard.writeText(url);
    setCopySuccess(token);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  // --- Supprimer un lien ---
  const handleDelete = async (id: number) => {
    if (!confirm(t("common.confirmDelete") || "Supprimer ce lien ?")) return;

    try {
      await API.delete(`/public-upload/${id}`);
      setLinks((prev) => prev.filter((link) => link.id !== id));
    } catch (err) {
      console.error("❌ Erreur suppression lien :", err);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">
        {t("privateLinks.title") || "🔐 Génération de liens privés"}
      </h1>

      {/* --- Formulaire --- */}
      <form
        onSubmit={handleGenerate}
        className="space-y-4 p-4 rounded-lg border shadow bg-white dark:bg-gray-800"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Type de cible */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              {t("privateLinks.targetType") || "Type de cible"}
            </label>
            <select
              value={targetType}
              onChange={(e) => setTargetType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="seller">Seller</option>
              <option value="store">Store</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          {/* Nom d'utilisateur */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              {t("privateLinks.username") || "Nom d'utilisateur cible"}
            </label>
            <input
              type="text"
              value={targetUserName}
              onChange={(e) => setTargetUserName(e.target.value)}
              required
              className="w-full p-2 border rounded"
              placeholder="ex: 61010131"
            />
          </div>

          {/* Target ID */}
          <div>
            <label className="block mb-1 text-sm font-medium">Target ID</label>
            <input
              type="number"
              value={targetId}
              onChange={(e) => setTargetId(Number(e.target.value))}
              required
              className="w-full p-2 border rounded"
              placeholder="ex: 12"
            />
          </div>

          {/* Durée (heures) */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              {t("privateLinks.validHours") || "Durée de validité (heures)"}
            </label>
            <input
              type="number"
              value={validHours}
              onChange={(e) => setValidHours(Number(e.target.value))}
              required
              min={1}
              className="w-full p-2 border rounded"
              placeholder="ex: 48"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading
            ? t("privateLinks.generating") || "Génération..."
            : t("privateLinks.generate") || "Générer le lien"}
        </button>
      </form>

      {/* --- Liste des liens --- */}
      <div className="overflow-x-auto rounded-lg border shadow bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-4 py-2 text-left">Token</th>
              <th className="px-4 py-2 text-left">{t("privateLinks.username") || "Utilisateur"}</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Expiration</th>
              <th className="px-4 py-2 text-left">Statut</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Aucun lien généré pour le moment.
                </td>
              </tr>
            ) : (
              links.map((link) => (
                <tr key={link.id} className="border-t">
                  <td className="px-4 py-2 font-mono text-xs">
                    {link.token.slice(0, 15)}...
                  </td>
                  <td className="px-4 py-2">{link.targetUserName}</td>
                  <td className="px-4 py-2">{link.targetType}</td>
                  <td className="px-4 py-2">
                    {new Date(link.expiresAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {link.used ? (
                      <span className="text-red-600 font-semibold">Utilisé</span>
                    ) : (
                      <span className="text-green-600 font-semibold">Actif</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right flex justify-end space-x-2">
                    <button
                      onClick={() => handleCopy(link.token, link.targetUserName)}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      title="Copier le lien"
                    >
                      {copySuccess === link.token ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-600" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(link.id)}
                      className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900"
                      title="Supprimer"
                    >
                      <Trash className="w-5 h-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
