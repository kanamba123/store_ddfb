import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";

const URLUploader = ({ onUrlsChange, loading }) => {
  const [urls, setUrls] = useState([]);
  const [urlInput, setUrlInput] = useState("");

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;

    const updatedUrls = [...urls, urlInput];
    setUrls(updatedUrls);
    setUrlInput("");

    onUrlsChange(updatedUrls);
  };

  const handleRemoveUrl = (index) => {
    const updatedUrls = urls.filter((_, i) => i !== index);
    setUrls(updatedUrls);
    onUrlsChange(updatedUrls);
  };

  return (
    <div className="space-y-3">
      {/* Champ d'URL */}
      <input
        type="url"
        placeholder="Ajouter une image par URL"
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
      />

      {/* Bouton */}
      <button
        onClick={handleAddUrl}
        disabled={loading || !urlInput}
        className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white ${
          loading || !urlInput
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : "Ajouter URL"}
      </button>

      {/* Liste des URL ajoutées */}
      {urls.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Liste des URL ajoutées</h4>
          <ul className="space-y-1">
            {urls.map((url, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-100 px-3 py-1 rounded-lg"
              >
                <span className="truncate text-sm">{url}</span>
                <button
                  onClick={() => handleRemoveUrl(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Aucune URL ajoutée</p>
      )}
    </div>
  );
};

export default URLUploader;
