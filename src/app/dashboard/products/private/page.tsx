"use client";

import { useState, useEffect } from "react";
import { Copy, Trash, Check, Share2, Plus, X, Search, User } from "lucide-react";
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

type Employee = {
  id: number;
  firstName: string;
  email?: string;
  position?: string;
};

export default function PrivateLinksPage() {
  // --- Form state ---
  const [targetType, setTargetType] = useState<string>("employee");
  const [targetUserName, setTargetUserName] = useState<string>("");
  const [validHours, setValidHours] = useState<number>(48);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // --- Other state ---
  const [links, setLinks] = useState<LinkRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

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

  // --- Fetch employees ---
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await API.get(`/employees`); // Adaptez l'endpoint selon votre API
        setEmployees(res.data);
      } catch (err) {
        console.error("❌ Erreur lors du chargement des employés :", err);
      }
    };
    fetchEmployees();
  }, []);

  // --- Filter employees based on search ---
  const filteredEmployees = employees.filter(employee =>
    employee?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Generate new link ---
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        targetType,
        validHours,
        targetUserName: selectedEmployee ? selectedEmployee.firstName : targetUserName,
        userId: 9, // À adapter selon votre logique d'authentification
        targetId: selectedEmployee?.id
      };
      
      const res = await API.post(`/public-upload/generate-upload-link`, payload);
      setLinks((prev) => [res.data, ...prev]);
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("❌ Erreur génération lien :", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Reset form ---
  const resetForm = () => {
    setTargetUserName("");
    setValidHours(48);
    setSelectedEmployee(null);
    setSearchTerm("");
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
          title: "Lien d'inscription",
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

  // --- Format date ---
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              🔗 Liens d'Inscription Privés
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Générez et gérez les liens d'inscription sécurisés
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
          >
            <Plus className="w-5 h-5" />
            Nouveau Lien
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{links.length}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Total des liens</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600">
              {links.filter(l => !l.used).length}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Liens actifs</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-red-600">
              {links.filter(l => l.used).length}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Liens utilisés</div>
          </div>
        </div>

        {/* Links Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Liens Générés
              </h2>
              {selectedIds.length > 0 && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                  {selectedIds.length} sélectionné(s)
                </span>
              )}
            </div>
            
            {selectedIds.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
              >
                <Trash className="w-4 h-4" />
                Supprimer la sélection
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-h-[60vh]">
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-50 dark:bg-gray-900/95 backdrop-blur-sm z-10">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === links.length && links.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Lien
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Expiration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {fetching ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 mt-2">Chargement des liens...</p>
                    </td>
                  </tr>
                ) : links.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="text-gray-400 dark:text-gray-500">
                        <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-lg font-medium">Aucun lien généré</p>
                        <p className="text-sm">Commencez par créer votre premier lien d'inscription</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  links.map((link) => {
                    const url =
                      link.url ||
                      `${window.location.origin}/rf/employees/generate/${link.targetUserName}/${link.token}`;
                    const shortUrl = url.length > 40 ? url.slice(0, 40) + "..." : url;

                    return (
                      <tr
                        key={link.id ?? link.token}
                        className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(link.id)}
                            onChange={() => toggleSelect(link.id)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium text-sm truncate block max-w-[300px]"
                            title={url}
                          >
                            {shortUrl}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {link.targetUserName}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 capitalize">
                            {link.targetType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(link.expiresAt)}
                        </td>
                        <td className="px-6 py-4">
                          {link.used ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                              Utilisé
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                              Actif
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end items-center space-x-2">
                            <button
                              onClick={() => handleCopy(url)}
                              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 group"
                              title="Copier le lien"
                            >
                              {copySuccess === url ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-600 group-hover:text-gray-800 dark:group-hover:text-gray-300" />
                              )}
                            </button>
                            <button
                              onClick={() => handleShare(url)}
                              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 group"
                              title="Partager"
                            >
                              <Share2 className="w-4 h-4 text-gray-600 group-hover:text-gray-800 dark:group-hover:text-gray-300" />
                            </button>
                            <button
                              onClick={() => handleDelete(link.id)}
                              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200 group"
                              title="Supprimer"
                            >
                              <Trash className="w-4 h-4 text-red-600 group-hover:text-red-700 dark:group-hover:text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Créer un Nouveau Lien
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Générez un lien d'inscription sécurisé
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleGenerate} className="p-6 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Type de cible */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type de cible
                    </label>
                    <select
                      value={targetType}
                      onChange={(e) => setTargetType(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="seller">Vendeur</option>
                      <option value="employee">Employé</option>
                    </select>
                  </div>

                  {/* Durée de validité */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Durée de validité: <span className="text-blue-600 font-semibold">{validHours}h</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={72}
                      step={1}
                      value={validHours}
                      onChange={(e) => setValidHours(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <span>1h</span>
                      <span>72h</span>
                    </div>
                  </div>
                </div>

                {/* Sélection d'employé */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sélectionner un employé (optionnel)
                  </label>
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setShowEmployeeDropdown(true);
                        }}
                        onFocus={() => setShowEmployeeDropdown(true)}
                        placeholder="Rechercher un employé..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>

                    {showEmployeeDropdown && filteredEmployees.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {filteredEmployees.map((employee) => (
                          <div
                            key={employee.id}
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setTargetUserName(employee.firstName);
                              setShowEmployeeDropdown(false);
                              setSearchTerm("");
                            }}
                            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors duration-150 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900 dark:text-white">
                              {employee.firstName}
                            </div>
                            {employee.email && (
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {employee.email}
                              </div>
                            )}
                            {employee.position && (
                              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {employee.position}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Employé sélectionné */}
                  {selectedEmployee && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-green-800 dark:text-green-300">
                            {selectedEmployee.firstName}
                          </div>
                          {selectedEmployee.email && (
                            <div className="text-sm text-green-600 dark:text-green-400">
                              {selectedEmployee.email}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedEmployee(null);
                            setTargetUserName("");
                          }}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Nom d'utilisateur manuel */}
                {!selectedEmployee && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nom d'utilisateur cible
                    </label>
                    <input
                      type="text"
                      value={targetUserName}
                      onChange={(e) => setTargetUserName(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="ex: john.doe ou 61010131"
                    />
                  </div>
                )}

                {/* Boutons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Génération...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Créer le Lien
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-webkit-slider-track {
          background: #e5e7eb;
          border-radius: 10px;
          height: 8px;
        }
        
        .slider::-moz-range-track {
          background: #e5e7eb;
          border-radius: 10px;
          height: 8px;
          border: none;
        }
        
        @media (max-width: 640px) {
          .slider::-webkit-slider-thumb {
            height: 16px;
            width: 16px;
          }
        }
      `}</style>
    </div>
  );
}