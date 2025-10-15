"use client";

import { useState, useEffect } from "react";
import { Copy, Trash, Check, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import API from "@/config/Axios";
import { API_URL } from "@/config/API";

type LinkRecord = {
  id: number;
  token: string;
  targetUserName: string;
  targetType: string;
  targetId: number;
  userId: number;
  expiresAt: string;
  used: boolean;
  url?: string; // 👈 ajouté pour afficher le lien
};

export default function PrivateLinksPage() {
  const { t } = useTranslation();

  // --- États du formulaire ---
  const [userId, setUserId] = useState<number>(9);
  const [targetId, setTargetId] = useState<number>(0);
  const [targetType, setTargetType] = useState<string>("seller");
  const [targetUserName, setTargetUserName] = useState<string>("");
  const [validHours, setValidHours] = useState<number>(48);

  // --- Autres états ---
  const [links, setLinks] = useState<LinkRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // --- Charger les liens existants ---
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

  // --- Génération d’un nouveau lien ---
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { userId, targetId, targetType, validHours, targetUserName };
      const res = await API.post(`/public-upload/generateLinkToSiginUp`, payload);

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
  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopySuccess(url);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  // --- Partager un lien ---
  const handleShare = async (url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Lien d’inscription employé",
          text: "Voici ton lien sécurisé pour finaliser ton inscription :",
          url,
        });
      } catch (err) {
        console.warn("Le partage a été annulé ou a échoué :", err);
      }
    } else {
      await handleCopy(url);
      alert("Lien copié dans le presse-papier (partage non pris en charge sur cet appareil).");
    }
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
    <div className="p-4 max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">
        {t("privateLinks.title") || "🔐 Génération de liens privés"}
      </h1>

      {/* --- Formulaire --- */}
      <form
        onSubmit={handleGenerate}
        className="space-y-4 p-4 rounded-lg border shadow bg-white dark:bg-gray-800"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">
              Type de cible
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

          <div>
            <label className="block mb-1 text-sm font-medium">
              Nom d'utilisateur cible
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

          <div>
            <label className="block mb-1 text-sm font-medium">
              Durée de validité (heures)
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
          {loading ? "Génération..." : "Générer le lien"}
        </button>
      </form>

      {/* --- Liste des liens --- */}
      <div className="overflow-x-auto rounded-lg border shadow bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-4 py-2 text-left">Lien</th>
              <th className="px-4 py-2 text-left">Utilisateur</th>
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
              links.map((link) => {
                const url =
                  link.url ||
                  `${window.location.origin}/rf/employees/generate/${link.targetUserName}/${link.token}`;

                const shortUrl = url.length > 45 ? url.slice(0, 45) + "..." : url;

                return (
                  <tr key={link.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-2 text-sm text-blue-600 underline truncate max-w-[300px]">
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {shortUrl}
                      </a>
                    </td>
                    <td className="px-4 py-2">{link.targetUserName}</td>
                    <td className="px-4 py-2 capitalize">{link.targetType}</td>
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
                        onClick={() => handleCopy(url)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        title="Copier le lien"
                      >
                        {copySuccess === url ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-600" />
                        )}
                      </button>

                      <button
                        onClick={() => handleShare(url)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        title="Partager"
                      >
                        <Share2 className="w-5 h-5 text-blue-600" />
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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
