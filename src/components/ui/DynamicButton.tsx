"use client";

import React, { useState } from "react";
import { notifySuccess } from "@/components/ui/ToastNotification";

interface DynamicButtonProps {
  label: string;
  description?: string;
  className?: string;
  onConfirm?: () => void;
}

const DynamicButton: React.FC<DynamicButtonProps> = ({
  label,
  description,
  className = "",
  onConfirm,
}) => {
  const [showDesc, setShowDesc] = useState(false);

  const handleClick = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      notifySuccess("✅ Action effectuée avec succès (aucune logique ajoutée)");
    }
  };

  return (
    <div
      className="relative flex items-center justify-end w-full"
      onMouseEnter={() => setShowDesc(true)}
      onMouseLeave={() => setShowDesc(false)}
    >
      <button
        onClick={handleClick}
        className={`px-4 py-2 rounded-lg font-medium shadow-md transition-all duration-200 text-white bg-green-600 hover:bg-green-700 active:scale-95 ${className}`}
      >
        {label}
      </button>

      {showDesc && description && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 w-64 p-3 bg-white border border-gray-200 rounded-xl shadow-lg z-20 animate-fade-in">
          <p className="text-sm text-gray-700">{description}</p>
        </div>
      )}
    </div>
  );
};

export default DynamicButton;
