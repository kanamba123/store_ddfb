"use client";
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface SelectProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  isLoading?: boolean;
  isError?: boolean; // 🔹 Nouveau
  refetch?: () => void; // 🔹 Nouveau
}

const SearchableSelect: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  required = false,
  isLoading = false,
  isError = false,
  refetch,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // Filtrer les options basées sur la recherche
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Trouver l'option sélectionnée
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block mb-1 font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      {/* Champ de contrôle */}
      <div className="relative ">
        <input
          type="text"
          className={`w-full p-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] focus:ring-2 transition-all duration-200
            ${
              isError
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500 focus:border-transparent"
            }`}
          value={isOpen ? searchTerm : selectedOption?.label || ""}
          onChange={(e) => {
            if (!isOpen) setIsOpen(true);
            setSearchTerm(e.target.value);
          }}
          onClick={() => setIsOpen(!isOpen)}
          placeholder={
            isLoading
              ? t("Chargement en cours...")
              : t("SearchableSelect.searchPlaceholder")
          }
          readOnly={!isOpen}
          disabled={isLoading}
        />

        {/* Loader Spinner */}
        {isLoading ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : isError && refetch ? (
          // 🔹 Bouton Retry si erreur
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="button"
              onClick={refetch}
              className="text-red-500 hover:text-red-700"
              title={t("Recharger")}
            >
              ↻
            </button>
          </div>
        ) : (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Progress bar quand loading */}
      {isLoading && (
        <div className="w-full h-1 mt-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-1 bg-blue-500 animate-[progress_1.5s_linear_infinite]"></div>
        </div>
      )}

      {/* Liste des options */}
      {isOpen && !isLoading && !isError && (
        <div className="absolute z-10 w-full mt-1 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 ${
                  value === option.value ? "bg-blue-100 dark:bg-gray-600" : ""
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">
              {t("SearchableSelect.result")}
            </div>
          )}
        </div>
      )}

      {/* Champ caché pour react-hook-form */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)} // transforme event en string
        className="hidden"
        required={required}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Animation keyframes Tailwind */}
      <style jsx>{`
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-[progress_1.5s_linear_infinite] {
          animation: progress 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SearchableSelect;
