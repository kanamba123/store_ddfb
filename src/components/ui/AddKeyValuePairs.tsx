"use client"
import React, { useState, useEffect, useCallback } from "react";
import { FiPlus as Add, FiTrash2 as Delete } from "react-icons/fi";

interface AddKeyValuePairsProps {
  title: string;
  keyPlaceholder: string;
  valuePlaceholder: string;
  onAdd: (items: Record<string, string>) => void;
}

const AddKeyValuePairs: React.FC<AddKeyValuePairsProps> = ({
  title=null,
  keyPlaceholder,
  valuePlaceholder,
  onAdd,
}) => {
  const [items, setItems] = useState<Record<string, string>>({});
  const [keyInput, setKeyInput] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [errors, setErrors] = useState({ key: false, value: false });
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAdd = useCallback((newItems: Record<string, string>) => {
    onAdd(newItems);
  }, [onAdd]);

  useEffect(() => {
    handleAdd(items);
  }, [items, handleAdd]);

  const addItem = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    const newErrors = { 
      key: !keyInput.trim(), 
      value: !valueInput.trim() 
    };

    if (newErrors.key || newErrors.value) {
      setErrors(newErrors);
      return;
    }

    setItems((prevItems) => ({
      ...prevItems,
      [keyInput.trim()]: valueInput.trim(),
    }));

    setKeyInput("");
    setValueInput("");
    setErrors({ key: false, value: false });
  };

  const removeItem = (key: string) => {
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      delete updatedItems[key];
      return updatedItems;
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-1 mb-4 transition-colors duration-200">
      <h5 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-100">
        {title}
      </h5>

      <div 
        className="flex flex-col sm:flex-row gap-3 mb-4"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addItem();
          }
        }}
      >
        <div className="flex-1">
          <input
            type="text"
            placeholder={keyPlaceholder}
            value={keyInput}
            onChange={(e) => {
              setKeyInput(e.target.value);
              setErrors((prev) => ({ ...prev, key: false }));
            }}
            className={`w-full p-2.5 border rounded-lg transition-all duration-200 ${
              errors.key
                ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-900"
                : "border-gray-300 dark:border-gray-600 focus:ring-blue-200 dark:focus:ring-blue-900"
            } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:outline-none`}
          />
          {errors.key && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
              Ce champ est requis
            </p>
          )}
        </div>

        <div className="flex-1">
          <input
            type="text"
            placeholder={valuePlaceholder}
            value={valueInput}
            onChange={(e) => {
              setValueInput(e.target.value);
              setErrors((prev) => ({ ...prev, value: false }));
            }}
            className={`w-full p-2.5 border rounded-lg transition-all duration-200 ${
              errors.value
                ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-900"
                : "border-gray-300 dark:border-gray-600 focus:ring-blue-200 dark:focus:ring-blue-900"
            } bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:outline-none`}
          />
          {errors.value && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
              Ce champ est requis
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-colors duration-200 shadow-sm whitespace-nowrap"
        >
          <Add className="mr-1.5" size={18} />
          {!isSmallScreen && "Ajouter"}
        </button>
      </div>

      {Object.keys(items).length > 0 && (
        <div className="mt-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg transition-colors duration-200">
          <h6 className="font-medium mb-3 text-gray-700 dark:text-gray-200">
            {title} ajoutés
          </h6>
          <ul className="border dark:border-gray-600 rounded-lg divide-y dark:divide-gray-600 overflow-hidden">
            {Object.entries(items).map(([key, value]) => (
              <li
                key={key}
                className="p-3 flex justify-between items-center relative hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
              >
                <div className="flex items-center overflow-hidden">
                  <span className="font-bold text-gray-800 dark:text-gray-100 truncate mr-2">
                    {key}:
                  </span>
                  <span className="text-green-600 dark:text-green-400 truncate">
                    {value}
                  </span>
                </div>
                <button
                  onClick={() => removeItem(key)}
                  aria-label="Supprimer"
                  className="text-red-500 hover:bg-red-500 hover:text-white p-1.5 rounded-full transition-colors duration-200 ml-2"
                >
                  <Delete size={16} />
                  {!isSmallScreen && (
                    <span className="sr-only">Supprimer</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddKeyValuePairs;