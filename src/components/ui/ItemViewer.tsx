import React, { useState } from "react";
import { toast } from "react-toastify";
import { API_URL } from "@/config/API";

type Option = string | { value: string; label: string };

interface ItemViewerProps {
  id: string | number;
  itemValue: string;
  endpoint: string;
  field: string;
  onSave: (data: any) => void;
  maxWidth?: number;
  maxHeight?: number;
  editable?: boolean;
  options?: Option[];
}

const ItemViewer: React.FC<ItemViewerProps> = ({
  id,
  itemValue,
  endpoint,
  field,
  onSave,
  maxWidth = 200,
  maxHeight = 50,
  editable = true,
  options = [],
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newValue, setNewValue] = useState(itemValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLabel = (value: string) => {
    const option = options.find((opt) =>
      typeof opt === "object" ? opt.value === value : opt === value
    );
    return option
      ? typeof option === "object"
        ? option.label
        : option
      : value;
  };

  const handleClick = () => {
    if (editable) {
      setNewValue(itemValue);
      setDialogOpen(true);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setError(null);
  };

  const updateValue = async () => {
    if (!newValue || newValue.trim() === "") {
      setError("Ce champ ne peut pas être vide.");
      return;
    }

    if (newValue === itemValue) {
      handleClose();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = { field, value: newValue };
      const response = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      if (!response.ok)
        throw new Error(responseData.message || "Échec de la mise à jour");

      toast.success("Modification réussie !");
      onSave(responseData);
      setDialogOpen(false);
    } catch (err: any) {
      setError(err.message);
      toast.error("Erreur lors de la mise à jour !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Petit bloc cliquable */}
      <div
        onClick={handleClick}
        title={editable ? "Cliquez pour modifier" : ""}
        className="cursor-pointer border border-gray-300 rounded-md px-2 py-1 bg-transparent hover:shadow-sm"
        style={{ maxWidth: `${maxWidth}px` }}
      >
        <div
          className="truncate"
          style={{ maxHeight: `${maxHeight}px` }}
        >
          {getLabel(itemValue)}
        </div>
      </div>

      {/* Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop bleu → rouge */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-500/40 to-red-500/40 backdrop-blur-sm"
            onClick={handleClose}
          ></div>

          <div className="relative bg-white rounded-lg shadow-lg w-96 p-6 z-10 animate-scaleIn">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
              Modifier {field}
            </h3>

            {options.length > 0 ? (
              <select
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                disabled={loading}
                className="w-full border rounded-md p-2 mb-3"
              >
                {options.map((opt) => {
                  const val = typeof opt === "object" ? opt.value : opt;
                  const label = typeof opt === "object" ? opt.label : opt;
                  return (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  );
                })}
              </select>
            ) : (
              <textarea
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                rows={3}
                disabled={loading}
                className={`w-full border rounded-md p-2 mb-3 ${error ? "border-red-500" : ""
                  }`}
              />
            )}

            {error && (
              <p className="text-red-500 text-sm mb-2">{error}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={updateValue}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
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

export default ItemViewer;
