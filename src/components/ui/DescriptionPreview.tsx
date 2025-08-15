"use client";

import { useState } from "react";
import { Eye } from "lucide-react";

interface DescriptionPreviewProps {
  text?: string;
  maxLength?: number;
}

export default function DescriptionPreview({
  text = "Aucune description",
  maxLength = 50,
}: DescriptionPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isTruncated = text.length > maxLength;
  const preview = isTruncated ? text.slice(0, maxLength) + "..." : text;

  return (
    <>
      <div className="flex items-center gap-2">
        <span>{preview}</span>
        {isTruncated && (
          <button
            onClick={() => setIsOpen(true)}
            className="relative text-indigo-600 hover:text-indigo-800"
          >
            <Eye className="w-4 h-4" />
            {/* Tooltip au survol */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Voir plus
            </span>
          </button>
        )}
      </div>

      {/* Modal avec backdrop blur */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <h2 className="text-lg font-semibold mb-4">Description complète</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {text}
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
