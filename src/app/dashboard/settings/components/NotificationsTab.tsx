import { Bell } from "lucide-react";

interface NotificationsTabProps {
  settings: {
    notifications: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function NotificationsTab({
  settings,
  handleChange,
}: NotificationsTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold  flex items-center gap-2">
        <Bell size={18} />
        Notifications
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium ">
              Activer les notifications
            </h3>
            <p className="text-xs ">
              Recevez des alertes et mises à jour
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="notifications"
              checked={settings.notifications}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6  peer-focus:outline-none rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
