"use client";

import { useState, useEffect } from "react";
import { Copy, Trash, Check, Share2, Plus, X } from "lucide-react";
import API from "@/config/Axios";

type LinkRecord = {
  id: number;
  token: string;
  targetUserName: string;
  targetType: string;
  expiresAt: string;
  used: boolean;
  url?: string;
};

export default function PrivateLinksPage() {
  // --- Form state ---

  const [targetType, setTargetType] = useState<string>("employee");
  const [targetUserName, setTargetUserName] = useState<string>("");
  const [validHours, setValidHours] = useState<number>(2);

  // --- Other state ---
  const [links, setLinks] = useState<LinkRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [fetching, setFetching] = useState(true);

  // --- Fetch links ---
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setFetching(true);
        const res = await API.get(`/public-upload`);
        setLinks(res.data);
      } catch (err) {
        console.error("❌ Erreur lors du chargement des liens :", err);
      } finally {
        setFetching(false);
      }
    };
    fetchLinks();
  }, []);

  // --- Generate new link ---
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { targetType, validHours, targetUserName };
      const res = await API.post(`/public-upload/generateLinkToSiginUp`, payload);
      setLinks((prev) => [res.data, ...prev]);
      setShowModal(false);
      setTargetUserName("");
      setValidHours(48);
    } catch (err) {
      console.error("❌ Erreur génération lien :", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Copy ---
  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopySuccess(url);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  // --- Share ---
  const handleShare = async (url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Lien d’inscription employé",
          text: "Voici ton lien sécurisé pour finaliser ton inscription :",
          url,
        });
      } catch {
        /* ignore */
      }
    } else {
      await handleCopy(url);
      alert("Lien copié (partage non pris en charge sur cet appareil).");
    }
  };

  // --- Delete single ---
  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce lien ?")) return;
    try {
      await API.delete(`/public-upload/${id}`);
      setLinks((prev) => prev.filter((link) => link.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    } catch (err) {
      console.error("❌ Erreur suppression lien :", err);
    }
  };

  // --- Delete multiple ---
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Supprimer ${selectedIds.length} lien(s) sélectionné(s) ?`)) return;
    try {
      await Promise.all(selectedIds.map((id) => API.delete(`/public-upload/${id}`)));
      setLinks((prev) => prev.filter((link) => !selectedIds.includes(link.id)));
      setSelectedIds([]);
    } catch (err) {
      console.error("❌ Erreur suppression multiple :", err);
    }
  };

  // --- Select / deselect ---
  const toggleSelect = (id: number) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleSelectAll = () =>
    setSelectedIds(selectedIds.length === links.length ? [] : links.map((l) => l.id));

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">🔐 Génération de liens privés</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Nouveau lien
        </button>
      </div>

      {/* --- Links table with scroll --- */}

      <div className="rounded-lg border shadow bg-[var(--color-bg-primary)] max-h-[70vh] overflow-y-auto">
        <div className="flex justify-between items-center px-4 py-2 bg-[var(--color-bg-primary)] border-b sticky top-0">
          <span className="text-sm ">
            {selectedIds.length > 0
              ? `${selectedIds.length} lien(s) sélectionné(s)`
              : "Aucun lien sélectionné"}
          </span>
          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Supprimer la sélection
            </button>
          )}
        </div>

        <table className="min-w-full divide-y">
          <thead className="sticky top-0 bg-[var(--color-bg-primary)] z-10">
            <tr>
              <th className="px-4 py-2 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length === links.length && links.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-4 py-2 text-left">Lien</th>
              <th className="px-4 py-2 text-left">Utilisateur</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Expiration</th>
              <th className="px-4 py-2 text-left">Statut</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {fetching ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  Chargement des liens...
                </td>
              </tr>
            ) : links.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
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
                  <tr
                    key={link.id ?? link.token} // clé unique
                    className={`border-t hover:bg-[var(--color-bg-secondary)] ${selectedIds.includes(link.id) ? "bg-[var(--color-primary)]" : ""
                      }`}
                  >
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(link.id)}
                        onChange={() => toggleSelect(link.id)}
                      />
                    </td>
                    <td className="px-4 py-2 text-sm text-blue-600 underline truncate max-w-[300px]">
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {shortUrl}
                      </a>
                    </td>
                    <td className="px-4 py-2">{link.targetUserName}</td>
                    <td className="px-4 py-2 capitalize">{link.targetType}</td>
                    <td className="px-4 py-2">{new Date(link.expiresAt).toLocaleString()}</td>
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

      {/* --- Modal --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-bg-primary)] p-6 rounded-lg shadow-xl w-full max-w-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4">➕ Générer un nouveau lien</h2>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Type de cible */}
                <div>
                  <label className="block mb-1 text-sm font-medium">Type de cible</label>
                  <select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value)}
                    className="w-full p-2 border rounded bg-[var(--color-bg-primary)] focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="seller">Seller</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>

                {/* Nom d'utilisateur cible */}
                <div>
                  <label className="block mb-1 text-sm font-medium">Nom d'utilisateur cible</label>
                  <input
                    type="text"
                    value={targetUserName}
                    onChange={(e) => setTargetUserName(e.target.value)}
                    required
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
                    placeholder="ex: 61010131"
                  />
                </div>

                {/* Durée de validité */}
                <div className="sm:col-span-2">
                  <label className="block mb-1 text-sm font-medium">
                    Durée de validité (heures) : {validHours}h
                  </label>

                  <input
                    type="range"
                    min={1}
                    max={72}
                    step={1}
                    value={validHours}
                    onChange={(e) => setValidHours(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                   dark:bg-gray-700"
                  />

                  <div className="flex justify-between text-xs mt-1 text-gray-500">
                    <span>1h</span>
                    <span>72h</span>
                  </div>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Génération..." : "Créer le lien"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
