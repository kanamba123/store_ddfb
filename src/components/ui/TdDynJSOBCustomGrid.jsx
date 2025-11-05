import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import { API_URL } from "@/config/API";

const TdDynJSOBCustomGrid = ({
  field,
  id,
  value = {},
  onSave,
  endpoint,
  editable = false,
}) => {
 
  const [specs, setSpecs] = useState(
  Object.entries(value || {}).map(([key, val]) => ({ key, value: val }))
);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [newSpec, setNewSpec] = useState({ key: "", value: "" });
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  const handleUpdateSpec = async (index) => {
    const spec = specs[index];
    if (!spec.value.trim()) {
      toast.error("La valeur ne peut pas être vide !");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        field,
        value: Object.fromEntries(specs.map((s) => [s.key, s.value])),
      };
      const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur de mise à jour");
      setEditIndex(null);
      onSave && onSave(data);
      toast.success("Modification réussie !");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSpec = async (index) => {
    const updatedSpecs = specs.filter((_, i) => i !== index);
    setSpecs(updatedSpecs);
    try {
      const payload = {
        field,
        value: Object.fromEntries(updatedSpecs.map((s) => [s.key, s.value])),
      };
      const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur de suppression");
      onSave && onSave(data);
      toast.success("Valeur supprimée !");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAddSpec = async () => {
    if (!newSpec.key.trim() || !newSpec.value.trim()) {
      toast.error("Nom et valeur requis !");
      return;
    }
    if (specs.some((s) => s.key === newSpec.key)) {
      toast.error("Cette valeur existe déjà !");
      return;
    }
    const updatedSpecs = [...specs, newSpec];
    setSpecs(updatedSpecs);
    setNewSpec({ key: "", value: "" });
    setAdding(false);
    try {
      const payload = {
        field,
        value: Object.fromEntries(updatedSpecs.map((s) => [s.key, s.value])),
      };
      const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur d'ajout");
      onSave && onSave(data);
      toast.success("Nouvelle valeur ajoutée !");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mt-6 sm:mt-8">
      <div className="bg-[var(--color-bg-primary)] rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)]">
            Spécifications techniques
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
          {specs.map((spec, index) => (
            <div
              key={index}
              className={`p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700
                ${index % 2 === 0 ? "sm:border-r bg-gray-50/50 dark:bg-gray-700/30" : "bg-[var(--color-bg-primary)]"}
                ${index >= specs.length - (specs.length % 2 === 0 ? 2 : 1) ? "border-b-0" : ""}`}
            >
              <div className="flex justify-between items-center">
                {editIndex === index ? (
                  <input
                    className="form-edit-input text-xs sm:text-sm"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => {
                      specs[index].value = editValue;
                      handleUpdateSpec(index);
                    }}
                    disabled={loading}
                  />
                ) : (
                  <>
                    <dt className="font-medium text-[var(--color-text-primary)] flex-shrink-0 mr-2 sm:mr-4 text-xs sm:text-sm">
                      {spec.key}
                    </dt>
                    <dd className="font-medium text-[var(--color-text-primary)] text-right text-xs sm:text-sm break-all">
                      {spec.value}
                    </dd>
                  </>
                )}

                {editable && (
                  <div className="flex gap-2 ml-2">
                    <FaEdit
                      className="text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
                      onClick={() => {
                        setEditIndex(index);
                        setEditValue(spec.value);
                        setShowConfirmDelete(null);
                      }}
                    />
                    {showConfirmDelete === index ? (
                      <div className="flex gap-1">
                        <button
                          className="text-white bg-red-600 px-2 rounded text-xs"
                          onClick={() => handleDeleteSpec(index)}
                        >
                          Supprimer
                        </button>
                        <button
                          className="text-gray-700 bg-gray-200 px-2 rounded text-xs"
                          onClick={() => setShowConfirmDelete(null)}
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <FaTrash
                        className="text-red-600 cursor-pointer hover:text-red-700 transition-colors"
                        onClick={() => setShowConfirmDelete(index)}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {editable && adding && (
            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 flex flex-col gap-2">
              <input
                className="form-edit-input text-xs sm:text-sm"
                placeholder="Nom"
                value={newSpec.key}
                onChange={(e) => setNewSpec({ ...newSpec, key: e.target.value })}
              />
              <input
                className="form-edit-input text-xs sm:text-sm"
                placeholder="Valeur"
                value={newSpec.value}
                onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
              />
              <div className="flex gap-2">
                <button
                  className="form-edit-btn cancel"
                  onClick={() => setAdding(false)}
                >
                  Annuler
                </button>
                <button
                  className="form-edit-btn confirm"
                  onClick={handleAddSpec}
                >
                  Ajouter
                </button>
              </div>
            </div>
          )}
        </div>

        {editable && !adding && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              className="form-edit-btn confirm"
              onClick={() => setAdding(true)}
            >
              Ajouter une autre information
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TdDynJSOBCustomGrid;
