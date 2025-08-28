import { API_URL } from "@/config/API";
import React, { useState, useEffect } from "react";

type OptionType = {
  [key: string]: any;
  id?: string | number; // facultatif si tu utilises un autre champ comme clé
};

interface EditForeignViewEditProps {
  id: string | number;
  itemValue: string | number;
  endpoint: string;
  field: string;
  onSave?: (data: any) => void;
  editable?: boolean;
  options?: OptionType[];
  labelField: string; // ex: "productName"
  idField?: string;   // ex: "productId" (par défaut: "id")
}

const EditForeignViewEdit: React.FC<EditForeignViewEditProps> = ({
  id,
  itemValue,
  endpoint,
  field,
  onSave,
  editable = true,
  options = [],
  labelField,
  idField = "id",
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newValue, setNewValue] = useState<string | number>(itemValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNewValue(itemValue);
  }, [itemValue]);

  const getOptionDetails = (value: string | number) =>
    options.find((opt) => opt[idField] === value) || {
      [idField]: value,
      [labelField]: value,
    };

  const handleClick = () => {
    if (editable) setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setError(null);
  };

  const updateValue = async () => {
    if (newValue === itemValue) {
      setError("Aucune modification n'a été effectuée.");
      return;
    }

    if (!newValue) {
      setError("Ce champ ne peut pas être vide.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value: newValue }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Erreur");

      setNewValue(data[field]);
      if (onSave) onSave(data);
      handleClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentOption = getOptionDetails(newValue);

  return (
    <>
      {/* Conteneur cliquable */}
      <div
        className="cursor-pointer bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-md px-2 py-1 hover:bg-[var(--color-bg-secondary)] transition"
        onClick={handleClick}
      >
        <div className="text-sm font-medium">
          <strong>{currentOption[labelField]}</strong>
        </div>
      </div>

      {/* Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* ✅ Backdrop bleu → rouge */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-500/40 to-red-500/40 backdrop-blur-sm"
            onClick={handleClose}
          ></div>

          {/* ✅ Fenêtre du dialog */}
          <div className="relative bg-[var(--color-bg-primary)] rounded-lg shadow-lg w-full max-w-md z-10">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">
                Modifier <strong>{field}</strong>
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Valeur actuelle :</strong>{" "}
                {currentOption[labelField]}
              </p>

              {options.length > 0 ? (
                <select
                  value={newValue}
                  onChange={(e) =>
                    setNewValue(
                      typeof newValue === "number"
                        ? Number(e.target.value)
                        : e.target.value
                    )
                  }
                  disabled={loading}
                  className={`w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 ${
                    error
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-blue-300"
                  }`}
                >
                  {options.map((opt, i) => (
                    <option key={i} value={opt[idField]}>
                      {opt[labelField]}
                    </option>
                  ))}
                </select>
              ) : (
                <textarea
                  rows={3}
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  disabled={loading}
                  className={`w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 ${
                    error
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-blue-300"
                  }`}
                />
              )}

              {error && (
                <p className="text-red-500 text-xs mt-2">{error}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 px-4 py-3 border-t">
              <button
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={updateValue}
                disabled={loading}
                className="px-4 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Chargement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditForeignViewEdit;
