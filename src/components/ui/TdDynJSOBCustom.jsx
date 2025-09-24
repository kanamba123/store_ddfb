import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import { API_URL } from "@/config/API";

const TdDynJSOBCustom = ({
  field,
  id,
  value = {},
  onSave,
  endpoint,
  editable = false,
}) => {
  const [updatedSpecs, setUpdatedSpecs] = useState(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [showAddField, setShowAddField] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setEditMode(null);
    setShowAddField(false);
    setModalOpen(false);
    setError(null);
  };

  const updateValue = async (key) => {
    const newValue = updatedSpecs[key]?.trim();
    if (!newValue) {
      setError("La valeur ne peut pas être vide.");
      return;
    }
    if (newValue === value[key]) {
      setEditMode(null);
      return;
    }

    setLoading(true);
    setError(null);
    const payload = { field, value: { ...value, [key]: newValue } };
    try {
      const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      if (!response.ok)
        throw new Error(responseData.message || "Erreur de mise à jour");

      onSave && onSave(responseData);
      toast.success("Modification réussie !");
      handleCloseModal();
    } catch (err) {
      setError(err.message);
      toast.error("Erreur lors de la mise à jour !");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewSpec = async () => {
    if (!newSpecKey.trim() || !newSpecValue.trim()) {
      setError("Le nom et la valeur sont requis.");
      return;
    }
    if (updatedSpecs[newSpecKey]) {
      setError("Cette valeur existe déjà.");
      return;
    }

    const newSpecs = { ...updatedSpecs, [newSpecKey]: newSpecValue };
    setUpdatedSpecs(newSpecs);
    setNewSpecKey("");
    setNewSpecValue("");
    setShowAddField(false);

    try {
      const payload = { field, value: newSpecs };
      const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      if (!response.ok)
        throw new Error(responseData.message || "Erreur d'ajout");

      onSave && onSave(responseData);
      toast.success("Nouvelle valeur ajoutée !");
    } catch (err) {
      setError(err.message);
      toast.error("Erreur lors de l'ajout !");
    }
  };

  const handleDeleteSpec = async (key) => {
    const newSpecs = { ...updatedSpecs };
    delete newSpecs[key];
    setUpdatedSpecs(newSpecs);

    try {
      const payload = { field, value: newSpecs };
      const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      if (!response.ok)
        throw new Error(responseData.message || "Erreur de suppression");

      onSave && onSave(responseData);
      toast.success("Valeur supprimée !");
    } catch (err) {
      setError(err.message);
      toast.error("Erreur lors de la suppression !");
    }
  };

  const specEntries = Object.entries(updatedSpecs || {});
  const firstSpec = specEntries[0];

  return (
    <>
      {/* Cellule cliquable */}
      <div
        className="whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer max-w-[300px]"
        onClick={handleOpenModal}
      >
        {firstSpec ? `${firstSpec[0]}: ${firstSpec[1]}...` : "empty"}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 to-red-500/40 backdrop-blur-sm"></div>
          <div className="bg-[var(--color-bg-primary)] relative rounded-lg shadow-lg w-96 p-6 z-10 animate-scaleIn">
            <h2 className="mb-3 text-lg font-semibold">
              Modifier les informations
            </h2>

            {specEntries.map(([key, val]) => (
              <div
                key={key}
                className="flex justify-between items-center mb-3 w-full"
              >
                <div className="flex items-center">
                  <strong>{key}:</strong>
                  {editMode === key ? (
                    <input
                      className="ml-2 border rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring focus:ring-blue-200"
                      value={updatedSpecs[key]}
                      onChange={(e) =>
                        setUpdatedSpecs({
                          ...updatedSpecs,
                          [key]: e.target.value,
                        })
                      }
                      onBlur={() => updateValue(key)}
                      disabled={loading}
                    />
                  ) : (
                    <span className="ml-2">{val}</span>
                  )}
                </div>

                {editable && (
                  <div className="flex gap-3">
                    <FaEdit
                      className="text-teal-600 cursor-pointer hover:scale-110 transition"
                      onClick={() => {
                        setEditMode(key);
                        setShowAddField(false);
                      }}
                    />
                    <FaTrash
                      className="text-red-600 cursor-pointer hover:scale-110 transition"
                      onClick={() => handleDeleteSpec(key)}
                    />
                  </div>
                )}
              </div>
            ))}

            {/* Ajouter champ */}
            {editable && !editMode && !showAddField && (
              <button
                className="mt-2 w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
                onClick={() => setShowAddField(true)}
              >
                Ajouter une autre information
              </button>
            )}

            {editable && showAddField && (
              <div className="mt-3">
                <input
                  className="w-full border rounded px-2 py-1 mb-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Nom de l'information"
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                />
                <input
                  className="w-full border rounded px-2 py-1 mb-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Valeur"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 transition"
                    onClick={() => setShowAddField(false)}
                  >
                    Annuler
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition"
                    onClick={handleAddNewSpec}
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            )}

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

            <div className="flex justify-end mt-4">
              <button
                className="px-3 py-1 rounded bg-gray-400 hover:bg-gray-500 text-white transition"
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
