import { API_URL } from "@/config/API";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Edit3, Trash2, PlusCircle, X } from "lucide-react";

type TdDynJSOBWithoutKeyCustomProps = {
  title?: string;          // Titre de la modal
  sectionTitle?: string;   // Titre affiché dans l'UI parent
  field: string;
  id: string | number;
  value?: string[];
  onSave?: (data: any) => void;
  endpoint: string;
  editable?: boolean;
};

const TdDynJSOBWithoutKeyCustom: React.FC<TdDynJSOBWithoutKeyCustomProps> = ({
  title = "Informations",
  sectionTitle,
  field,
  id,
  value = [],
  onSave,
  endpoint,
  editable = false,
}) => {
  const [updatedSpecs, setUpdatedSpecs] = useState<string[]>(Array.isArray(value) ? value : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [newSpecValue, setNewSpecValue] = useState("");
  const [showAddField, setShowAddField] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setEditMode(null);
    setShowAddField(false);
    setModalOpen(false);
    setError(null);
  };

  const updateValue = async (index: number, newValue: string) => {
    if (!newValue.trim()) return setError("La valeur ne peut pas être vide.");
    if (newValue === updatedSpecs[index]) return setEditMode(null);

    setLoading(true);
    setError(null);
    const newSpecs = [...updatedSpecs];
    newSpecs[index] = newValue;

    try {
      const payload = { field, value: newSpecs };
      const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || "Erreur de mise à jour");

      setUpdatedSpecs(newSpecs);
      onSave?.(responseData);
      toast.success("Modification réussie !");
    } catch (err: any) {
      setError(err.message);
      toast.error("Erreur lors de la mise à jour !");
    } finally {
      setLoading(false);
      setEditMode(null);
    }
  };

  const handleAddNewSpec = async () => {
    if (!newSpecValue.trim()) return setError("La valeur est requise.");

    const newSpecs = [...updatedSpecs, newSpecValue];
    try {
      const payload = { field, value: newSpecs };
      const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || "Erreur d'ajout");

      setUpdatedSpecs(newSpecs);
      setNewSpecValue("");
      setShowAddField(false);
      onSave?.(responseData);
      toast.success("Nouvelle valeur ajoutée !");
    } catch (err: any) {
      setError(err.message);
      toast.error("Erreur lors de l'ajout !");
    }
  };

  const handleDeleteSpec = async (index: number) => {
    const newSpecs = updatedSpecs.filter((_, i) => i !== index);
    try {
      const payload = { field, value: newSpecs };
      const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || "Erreur de suppression");

      setUpdatedSpecs(newSpecs);
      onSave?.(responseData);
      toast.success("Valeur supprimée !");
    } catch (err: any) {
      setError(err.message);
      toast.error("Erreur lors de la suppression !");
    }
  };

  const visibleItems = updatedSpecs.slice(0, 3);
  const hiddenCount = updatedSpecs.length - visibleItems.length;

  return (
    <div className="mb-1.5">
      {/* --- Titre de section --- */}
      {sectionTitle && (
        <h4 className="text-xl sm:text-base md:text-2xl font-medium text-[var(--color-secondary)] mb-1">
          {sectionTitle}
        </h4>
      )}

      {/* --- Résumé dans la cellule avec indication hover --- */}
      <div
        className="relative flex flex-wrap items-center gap-1 cursor-pointer group"
        onClick={handleOpenModal}
      >
        {visibleItems.length > 0 ? (
          <>
            {visibleItems.map((item, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs sm:text-sm px-2 py-0.5 rounded-full truncate max-w-[120px] sm:max-w-xs"
                title={item}
              >
                {item}
              </span>
            ))}

            {hiddenCount > 0 && (
              <span className="bg-gray-200 text-gray-700 text-xs sm:text-sm px-2 py-0.5 rounded-full">
                +{hiddenCount} autres
              </span>
            )}

            {/* Tooltip / indication hover */}
            <span className="absolute right-0 top-0 -translate-y-full bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Cliquer pour voir plus
            </span>
          </>
        ) : (
          <span className="text-gray-400 text-sm">Aucune donnée</span>
        )}
      </div>



      {/* --- Modal responsive --- */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6"
          onClick={handleCloseModal}
        >
          <div
            className="bg-[var(--color-bg-primary)] rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* --- Header de la modal --- */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-secondary)]">{title}</h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            {/* --- Liste des valeurs --- */}
            {updatedSpecs.map((val, index) => (
              <div key={index} className="flex items-center mb-2 gap-2">
                {editMode === index ? (
                  <input
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="text"
                    value={updatedSpecs[index] || ""}
                    onChange={(e) => {
                      const newSpecs = [...updatedSpecs];
                      newSpecs[index] = e.target.value;
                      setUpdatedSpecs(newSpecs);
                    }}
                    onBlur={() => updateValue(index, updatedSpecs[index])}
                    disabled={loading}
                  />
                ) : (
                  <div
                    className={`flex-1 truncate ${editable ? "cursor-pointer" : ""}`}
                    onClick={() => editable && setEditMode(index)}
                  >
                    {val ?? "empty"}
                  </div>
                )}

                {editable && (
                  <div className="flex items-center gap-1">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => setEditMode(index)}
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteSpec(index)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* --- Ajouter une nouvelle valeur --- */}
            {editable && !editMode && !showAddField && (
              <button
                className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm mt-3"
                onClick={() => setShowAddField(true)}
              >
                <PlusCircle size={18} /> Ajouter
              </button>
            )}

            {editable && showAddField && (
              <div className="mt-3">
                <input
                  className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                  type="text"
                  placeholder="Nouvelle valeur"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    className="bg-gray-200 hover:bg-gray-300 text-sm sm:text-base rounded-md px-3 py-1"
                    onClick={() => setShowAddField(false)}
                  >
                    Annuler
                  </button>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white text-sm sm:text-base rounded-md px-3 py-1"
                    onClick={handleAddNewSpec}
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            )}

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

            {/* --- Fermer --- */}
            <div className="flex justify-end mt-5">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-sm sm:text-base rounded-md px-3 py-1"
                onClick={handleCloseModal}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TdDynJSOBWithoutKeyCustom;
