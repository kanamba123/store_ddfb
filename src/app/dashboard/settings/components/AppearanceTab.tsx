import { Palette } from "lucide-react";

interface AppearanceTabProps {
  settings: {
    theme: string;
    language: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function AppearanceTab({
  settings,
  handleChange,
}: AppearanceTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
        <Palette size={18} />
        Apparence
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Thème
        </label>
        <select
          name="theme"
          value={settings.theme}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="system">Système</option>
          <option value="light">Clair</option>
          <option value="dark">Sombre</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Langue
        </label>
        <select
          name="language"
          value={settings.language}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="de">Deutsch</option>
        </select>
      </div>
    </div>
  );
}
