"use client";

import React, { useState } from "react";
import { FieldErrors, Path, UseFormRegister } from "react-hook-form";
import { VariantsProduct } from "@/types/VariantsProduct"; // importe ton type

interface Props {
    register: any; 
    errors: any;
}

const languages = [
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "kir", label: "Kirundi", flag: "🇧🇮" },
    { code: "sw", label: "Swahili", flag: "🇰🇪" },
    { code: "en", label: "Anglais", flag: "🇬🇧" },
];

const inputClass =
    "mt-1 block w-full rounded-lg border border-gray-300 p-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500";

export default function MultiLangDescription({ register, errors }: Props) {
    const [selectedLangs, setSelectedLangs] = useState<string[]>(["fr"]);

    const toggleLang = (lang: string) => {
        setSelectedLangs((prev) =>
            prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
        );
    };

    return (
        <div className="space-y-4">
            {/* Sélecteur de langues */}
            <div className="flex flex-wrap gap-2">
                {languages.map((lang) => {
                    const isSelected = selectedLangs.includes(lang.code);
                    return (
                        <button
                            key={lang.code}
                            type="button"
                            onClick={() => toggleLang(lang.code)}
                            className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1 transition
                ${isSelected
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                }`}
                        >
                            <span>{lang.flag}</span>
                            {lang.label}
                        </button>
                    );
                })}
            </div>

            {/* Champs de description */}
            {selectedLangs.map((lang) => {
                const fieldName = `description.${lang}` as Path<VariantsProduct>;
                const hasError = (errors.description as any)?.[lang];

                return (
                    <div key={lang}>
                        <textarea
                            {...register(fieldName, {
                                required:
                                    lang === "fr"
                                        ? "La description en français est obligatoire"
                                        : false,
                            })}
                            className={`${inputClass} ${hasError ? "border-red-500 focus:border-red-500" : ""
                                }`}
                            rows={2}
                            placeholder={`Description (${languages.find((l) => l.code === lang)?.label})`}
                        />
                        {hasError && (
                            <p className="mt-1 text-sm text-red-500">
                                {String(hasError.message)}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
