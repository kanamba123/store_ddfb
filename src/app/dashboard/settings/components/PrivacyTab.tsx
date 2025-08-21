import { Shield } from "lucide-react";

interface PrivacyTabProps {
  settings: {
    privacyMode: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PrivacyTab({
  settings,
  handleChange,
}: PrivacyTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold  flex items-center gap-2">
        <Shield size={18} />
        Confidentialité
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium ">
              Mode privé
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Limite le suivi et le stockage des données
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="privacyMode"
              checked={settings.privacyMode}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 peer-focus:outline-none rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="pt-4 border-t dark:border-gray-700">
          <h3 className="text-sm font-medium  mb-3">
            Gestion des données
          </h3>

          <div className="space-y-3">
            <button className="s text-sm font-medium">
              Exporter mes données
            </button>

            <button className="text-red-600 dark:text-red-400 text-sm font-medium">
              Supprimer mon compte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
