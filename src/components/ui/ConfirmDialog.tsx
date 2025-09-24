"use client";

import { ReactNode } from "react";

type ConfirmDialogProps = {
  isOpen: boolean;
  title?: string;
  message: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 to-red-500/40 backdrop-blur-sm" />

      {/* Dialog */}
      <div className="relative bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-lg shadow-lg p-6 w-full max-w-md space-y-4 z-10">
        {title && <h2 className="text-lg font-semibold">{title}</h2>}
        <div className="text-sm">{message}</div>

        <div className="flex justify-end space-x-2 pt-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded hover:bg-[var(--color-bg-secondary)]"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
