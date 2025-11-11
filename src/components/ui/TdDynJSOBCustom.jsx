import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import { API_URL } from "@/config/API";

const LANG_OPTIONS = [
  { code: "fr", label: "Français 🇫🇷" },
  { code: "en", label: "Anglais 🇬🇧" },
  { code: "kir", label: "Kirundi 🇧🇮" },
  { code: "sw", label: "Swahili 🇹🇿" },
];

const TdDynJSOBCustom = ({
  field = "description",
  id,
  value = {},
  onSave,
  endpoint,
  editable = false,
}) => {
  const [descriptions, setDescriptions] = useState(value || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editLang, setEditLang] = useState(null);
  const [newLang, setNewLang] = useState("");
  const [newText, setNewText] = useState("");
  const [showAddField, setShowAddField] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setEditLang(null);
    setShowAddField(false);
    setModalOpen(false);
    setError(null);
  };

  const patchData = async (newData) => {
    setLoading(true);
    try {
      const payload = { field, value: newData };
      const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur de mise à jour");
      onSave && onSave(data);
      toast.success("Mise à jour réussie !");
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lang, text) => {
    const newData = { ...descriptions, [lang]: text };
    setDescriptions(newData);
  };

  const handleSaveEdit = async () => {
    await patchData(descriptions);
    setEditLang(null);
  };

  const handleDelete = async (lang) => {
    const newData = { ...descriptions };
    delete newData[lang];
    setDescriptions(newData);
    await patchData(newData);
  };

  const handleAddNew = async () => {
    if (!newLang || !newText.trim()) {
      setError("Veuillez sélectionner une langue et saisir une description.");
      return;
    }
    if (descriptions[newLang]) {
      setError("Cette langue existe déjà.");
      return;
    }

    const newData = { ...descriptions, [newLang]: newText };
    setDescriptions(newData);
    setNewLang("");
    setNewText("");
    setShowAddField(false);
    await patchData(newData);
  };

  const firstLang = Object.entries(descriptions)[0];

  return (
    <>
      <div
        className="whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer max-w-[300px]"
        onClick={handleOpenModal}
      >
        {firstLang &&
        typeof firstLang[1] === "string" &&
        firstLang[1].trim() !== ""
          ? `${firstLang[0].toUpperCase()}: ${firstLang[1].substring(0, 20)}...`
          : "Aucune description"}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div className="bg-white dark:bg-gray-800 relative rounded-lg shadow-lg w-96 p-6 z-10">
            <h2 className="mb-4 text-lg font-semibold">
              Gérer les descriptions multilingues
            </h2>

            {Object.entries(descriptions).map(([lang, text]) => (
              <div
                key={lang}
                className="flex items-center justify-between mb-3"
              >
                <span className="font-semibold w-14">
                  {lang.toUpperCase()}:
                </span>
                {editLang === lang ? (
                  <input
                    className="flex-1 border rounded px-2 py-1 text-sm"
                    value={text}
                    onChange={(e) => handleEdit(lang, e.target.value)}
                    onBlur={handleSaveEdit}
                    disabled={loading}
                  />
                ) : (
                  <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                    {text}
                  </span>
                )}
                {editable && (
                  <div className="flex gap-2 ml-2">
                    <FaEdit
                      className="text-blue-600 cursor-pointer hover:scale-110"
                      onClick={() => setEditLang(lang)}
                    />
                    <FaTrash
                      className="text-red-600 cursor-pointer hover:scale-110"
                      onClick={() => handleDelete(lang)}
                    />
                  </div>
                )}
              </div>
            ))}

            {editable && !showAddField && (
              <button
                className="mt-3 w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
                onClick={() => setShowAddField(true)}
              >
                Ajouter une autre langue
              </button>
            )}

            {editable && showAddField && (
              <div className="mt-3">
                <select
                  className="w-full border rounded px-2 py-1 mb-2 text-sm"
                  value={newLang}
                  onChange={(e) => setNewLang(e.target.value)}
                >
                  <option value="">Choisir une langue</option>
                  {LANG_OPTIONS.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>

                <input
                  className="w-full border rounded px-2 py-1 mb-2 text-sm"
                  placeholder="Texte dans la langue choisie"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                />

                <div className="flex justify-end gap-2">
                  <button
                    className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
                    onClick={() => setShowAddField(false)}
                  >
                    Annuler
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                    onClick={handleAddNew}
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            )}

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

            <div className="flex justify-end mt-4">
              <button
                className="px-3 py-1 rounded bg-gray-400 hover:bg-gray-500 text-white"
                onClick={handleCloseModal}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TdDynJSOBCustom;
