"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

interface SearchBarWithCategoryProps {
  categories: { id: string; categoryName: string }[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  searchText: string;
  onSearchChange: (value: string) => void;
  onSubmit: () => void;
}

export default function SearchBarWithCategory({
  categories = [],
  selectedCategory,
  onCategoryChange,
  searchText,
  onSearchChange,
  onSubmit,
}: SearchBarWithCategoryProps) {
  const { t } = useTranslation();

  // Nom de la catégorie sélectionnée
  const selectedCategoryName =
    categories.find((cat) => cat?.id === selectedCategory)?.categoryName ||
    t("products.allCategories");

  return (
    <div className="flex w-full max-w-3xl mx-auto rounded-md overflow-hidden shadow-sm border border-gray-300 dark:border-gray-700">
      {/* Zone catégorie + select invisible */}
      <div className="relative flex items-center min-w-[6rem] max-w-[9rem] sm:max-w-[12rem] border-r border-gray-300 dark:border-gray-600 bg-[var(--color-bg-primary)] ">
        {/* Select invisible qui couvre tout le bloc */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 bg-[var(--color-bg-primary)] "
        >
          {/* Option réinitialisation */}
          <option value="">{t("products.allCategories")}</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.categoryName}
            </option>
          ))}
        </select>

        {/* Texte + Icône */}
        <span className="flex items-center justify-between w-full px-2 sm:px-3 py-2 text-xs sm:text-sm text-[var(--color-text-primary)] ">
          <span className="truncate">{selectedCategoryName}</span>
          <ChevronDown className="w-4 h-4 ml-1 sm:ml-2  shrink-0" />
        </span>
      </div>

      {/* Champ texte */}
      <input
        type="text"
        placeholder={t("products.search")}
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-grow px-2 sm:px-4 py-2 text-sm sm:text-base text-[var(--color-text-primary)] 
                   bg-[var(--color-bg-primary)] 
                   focus:outline-none"
      />

      {/* Bouton recherche */}
      <button
        onClick={onSubmit}
        className="px-3 sm:px-4 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shrink-0"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
          />
        </svg>
      </button>
    </div>
  );
}
