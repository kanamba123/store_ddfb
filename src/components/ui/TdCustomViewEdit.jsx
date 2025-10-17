import React, { useState } from "react";
import { notifyError, notifySuccess } from "./ToastNotification";
import { API_URL } from "@/config/API";

const TdCustomViewEdit = ({
  id,
  field,
  value,
  onSave,
  endpoint,
  emptyText = "Empty",
  editable = false,
  useDialog = false,

  // 🆕 Nouveau prop
  modifiable = true,

  className = "",
  inputClassName = "",
  overlayClassName = "fixed inset-0 flex justify-center items-center z-50 bg-gradient-to-br from-blue-500/40 to-red-500/40",
  dialogClassName = "bg-[var(--color-bg-primary)] p-6 w-80 rounded-lg shadow-lg",
  buttonCancelClassName = "px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50",
  buttonSaveClassName = "px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 flex items-center gap-2",
}) => {
  const [editMode, setEditMode] = useState(false);
  const [newValue, setNewValue] = useState(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEditClick = () => {
    // ✅ On vérifie le nouveau prop avant d'autoriser l'édition
    if (editable && modifiable) setEditMode(true);
  };

  const updateValue = async () => {
    if (!field) {
      setError("Champ manquant.");
      return;
    }
    if (String(newValue).trim() === "") {
      setError("La valeur ne peut pas être vide.");
      return;
    }
    if (newValue === value) {
      setEditMode(false);
      return;
    }

    setLoading(true);
    setError(null);

    const apiUrl = `${API_URL}/${endpoint}/${id}`;
    const payload = { field, value: newValue };

    try {
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Erreur de mise à jour");
      }

      onSave && onSave(responseData);
      notifySuccess("Modification réussie !");
      setNewValue(responseData[field]);
      setEditMode(false);
    } catch (err) {
      console.error("⚠️ Erreur dans updateValue:", err);
      setError(err.message);
      notifyError("Erreur lors de la mise à jour !");
    } finally {
      setLoading(false);
    }
  };

  const Loader = () => (
    <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
  );

  return (
    <>
      {!useDialog ? (
        <span
          onClick={handleEditClick}
          className={`${editable && modifiable ? "cursor-pointer font-bold" : "cursor-not-allowed opacity-60"} ${className}`}
        >
          {editMode ? (
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onBlur={updateValue}
              autoFocus
              disabled={loading || !modifiable}
              className={`w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
            />
          ) : loading ? (
            <Loader />
          ) : (
            value || <span className="text-red-500">{emptyText}</span>
          )}
        </span>
      ) : (
        <>
          <span
            className={`truncate ${modifiable ? "cursor-pointer" : "cursor-not-allowed opacity-60"} ${className}`}
            onClick={handleEditClick}
          >
            {value || <span className="text-red-500">{emptyText}</span>}
          </span>

          {editMode && modifiable && (
            <div className={overlayClassName}>
              <div className={dialogClassName}>
                <h3 className="mb-3 text-lg font-semibold">
                  Modifier {field}
                </h3>

                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  disabled={loading}
                  autoFocus
                  className={`w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
                />

                {error && (
                  <p className="text-red-500 text-sm mb-3">{error}</p>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    className={buttonCancelClassName}
                    onClick={() => setEditMode(false)}
                    disabled={loading}
                  >
                    Annuler
                  </button>
                  <button
                    className={buttonSaveClassName}
                    onClick={updateValue}
                    disabled={loading}
                  >
                    {loading ? <Loader /> : "Enregistrer"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default TdCustomViewEdit;
