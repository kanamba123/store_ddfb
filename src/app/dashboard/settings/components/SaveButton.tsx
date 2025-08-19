interface SaveButtonProps {
  isSaving: boolean;
  message: string | null;
  handleSave: () => void;
}

export default function SaveButton({
  isSaving,
  message,
  handleSave,
}: SaveButtonProps) {
  return (
    <div className="mt-8 pt-6 border-t dark:border-gray-700">
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center"
      >
        {isSaving ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Sauvegarde en cours...
          </>
        ) : (
          "Sauvegarder les paramètres"
        )}
      </button>

      {message && (
        <p className="mt-4 text-green-600 dark:text-green-400 font-medium text-center">
          {message}
        </p>
      )}
    </div>
  );
}
