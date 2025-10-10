import { deleteAcountStore } from "@/libs/api/settingsActount";
import { Shield, Download, Trash2, Eye, EyeOff, Lock, Database, Key, Cookie } from "lucide-react";
import { useState } from "react";
import { loginUser } from "@/services/authService";
interface PrivacyTabProps {
  settings: {
    privacyMode: boolean;
    dataCollection: boolean;
    analyticsTracking: boolean;
    cookieConsent: boolean;
    searchHistory: boolean;
    autoDeleteData: string;
    twoFactorAuth: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function PrivacyTab({
  settings,
  handleChange,
}: PrivacyTabProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("json");
  const [password, setPassword] = useState("");
  const [deleteType, setDeleteType] = useState<"data" | "account">("data");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Fonction pour exporter les données
  const handleExportData = () => {
    console.log("Exportation des données au format:", exportFormat);

    // Simulation d'export de données
    const userData = {
      profile: { name: "Utilisateur", email: "user@example.com" },
      settings: settings,
      preferences: { theme: "dark", language: "fr" },
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    // Création d'un lien de téléchargement
    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = `mes-donnees-${new Date().getTime()}.${exportFormat}`;
    link.click();

    setShowExportModal(false);
    alert("Exportation terminée !");
  };

  // Fonction pour supprimer les données avec confirmation par mot de passe
  const handleDeleteData = (type: "data" | "account") => {
    setDeleteType(type);
    setShowDeleteConfirm(true);
    setPassword("");
    setPasswordError("");
  };

  // Fonction pour confirmer la suppression avec mot de passe
  const confirmDeletionWithPassword = async () => {
    if (!password) {
      setPasswordError("Veuillez entrer votre mot de passe");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsLoading(true);
    setPasswordError("");

    try {
      const data = await loginUser(password);
      if (!data) {
        setPasswordError("Mot de passe incorrect");
        setIsLoading(false);
        return;
      }

      // Si le mot de passe est valide, procéder à la suppression
      if (deleteType === "data") {
        console.log("Suppression de toutes les données utilisateur");
        // Ici, appeler l'API pour supprimer les données
        alert("Toutes vos données ont été supprimées avec succès.");
      } else {

        try {
          try {

            await deleteAcountStore();

            alert("Votre compte a été supprimé avec succès.");
            window.location.reload();
          } catch (error) {
            console.error("Failed to delete variant", error);
          }
        } catch (err) {
          alert("Erreur lors de la suppression");
        }
      }

      // Réinitialiser les états
      setShowDeleteConfirm(false);
      setPassword("");
      setPasswordError("");

    } catch (error) {
      console.error("Erreur lors de la vérification du mot de passe:", error);
      setPasswordError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour réinitialiser les consentements
  const handleResetConsent = () => {
    if (window.confirm("Réinitialiser tous vos consentements ?")) {
      console.log("Réinitialisation des consentements");
      // Réinitialiser les paramètres liés aux consentements
      const event = {
        target: {
          name: "cookieConsent",
          type: "checkbox",
          checked: false
        }
      } as React.ChangeEvent<HTMLInputElement>;

      handleChange(event);
      alert("Consentements réinitialisés.");
    }
  };

  // Fonction pour gérer l'authentification à deux facteurs
  const handleTwoFactorSetup = () => {
    if (!settings.twoFactorAuth) {
      if (window.confirm("Voulez-vous activer l'authentification à deux facteurs ?")) {
        console.log("Configuration 2FA");
        // Ici, rediriger vers la page de configuration 2FA
        alert("Redirection vers la configuration 2FA...");
      }
    } else {
      if (window.confirm("Voulez-vous désactiver l'authentification à deux facteurs ?")) {
        console.log("Désactivation 2FA");
        const event = {
          target: {
            name: "twoFactorAuth",
            type: "checkbox",
            checked: false
          }
        } as React.ChangeEvent<HTMLInputElement>;
        handleChange(event);
      }
    }
  };

  // Fonction pour vider l'historique
  const handleClearHistory = () => {
    if (window.confirm("Voulez-vous supprimer tout votre historique de recherche ?")) {
      console.log("Historique de recherche supprimé");
      alert("Historique supprimé avec succès.");
    }
  };

  // Fonction pour annuler la suppression
  const cancelDeletion = () => {
    setShowDeleteConfirm(false);
    setPassword("");
    setPasswordError("");
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Shield size={18} />
        Confidentialité et Sécurité
      </h2>

      <div className="space-y-4">
        {/* Mode privé */}
        <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
          <div className="flex items-start gap-3">
            <EyeOff className="w-5 h-5 mt-0.5 text-gray-500" />
            <div>
              <h3 className="text-sm font-medium">Mode privé</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Limite le suivi et le stockage des données
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="privacyMode"
              checked={settings.privacyMode}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[var(--color-bg-primary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Collection de données */}
        <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 mt-0.5 text-gray-500" />
            <div>
              <h3 className="text-sm font-medium">Collection de données</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Autoriser la collecte de données d'usage
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="dataCollection"
              checked={settings.dataCollection}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Analytics et tracking */}
        <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
          <div className="flex items-start gap-3">
            <Eye className="w-5 h-5 mt-0.5 text-gray-500" />
            <div>
              <h3 className="text-sm font-medium">Analytics et tracking</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Suivi des analytics et mesures d'audience
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="analyticsTracking"
              checked={settings.analyticsTracking}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Historique de recherche */}
        <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
          <div className="flex items-start gap-3">
            <Eye className="w-5 h-5 mt-0.5 text-gray-500" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">Historique de recherche</h3>
                {settings.searchHistory && (
                  <button
                    onClick={handleClearHistory}
                    className="text-xs text-red-500 hover:text-red-700 underline"
                  >
                    Vider
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sauvegarder l'historique de vos recherches
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="searchHistory"
              checked={settings.searchHistory}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Authentification à deux facteurs */}
        <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 mt-0.5 text-gray-500" />
            <div>
              <h3 className="text-sm font-medium">Authentification à deux facteurs</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sécurisez votre compte avec une double vérification
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTwoFactorSetup}
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              {settings.twoFactorAuth ? "Désactiver" : "Activer"}
            </button>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="twoFactorAuth"
                checked={settings.twoFactorAuth}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Gestion des cookies */}
        <div className="p-4 border rounded-lg dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-start gap-3">
              <Cookie className="w-5 h-5 mt-0.5 text-gray-500" />
              <div>
                <h3 className="text-sm font-medium">Gestion des cookies</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Consentement aux cookies
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="cookieConsent"
                checked={settings.cookieConsent}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <button
            onClick={handleResetConsent}
            className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline"
          >
            Réinitialiser mes consentements
          </button>
        </div>

        {/* Suppression automatique des données */}
        <div className="p-4 border rounded-lg dark:border-gray-700">
          <div className="flex items-start gap-3 mb-3">
            <Trash2 className="w-5 h-5 mt-0.5 text-gray-500" />
            <div>
              <h3 className="text-sm font-medium">Suppression automatique des données</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Période de conservation automatique de vos données
              </p>
            </div>
          </div>
          <select
            name="autoDeleteData"
            value={settings.autoDeleteData}
            onChange={handleChange}
            className="w-full p-2 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-600"
          >
            <option value="never">Jamais</option>
            <option value="3months">3 mois</option>
            <option value="6months">6 mois</option>
            <option value="1year">1 an</option>
            <option value="2years">2 ans</option>
          </select>
        </div>

        {/* Gestion des données */}
        <div className="p-4 border rounded-lg dark:border-gray-700">
          <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
            <Database className="w-4 h-4" />
            Gestion des données
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => setShowExportModal(true)}
              className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 text-action-add-hover dark:border-gray-600 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Exporter mes données</span>
              </div>
              <span className="text-xs text-gray-500">JSON, CSV</span>
            </button>

            <button
              onClick={() => handleDeleteData("data")}
              className="w-full flex items-center justify-between p-3 border border-red-200 rounded-lg hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20 transition-colors"
            >
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Supprimer toutes mes données</span>
              </div>
              <span className="text-xs text-red-500">Irréversible</span>
            </button>

            <button
              onClick={() => handleDeleteData("account")}
              className="w-full flex items-center justify-between p-3 border border-red-200 rounded-lg hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20 transition-colors"
            >
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Supprimer mon compte</span>
              </div>
              <span className="text-xs text-red-500">Définitif</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal d'exportation */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--color-bg-primary)] p-6 rounded-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Exporter mes données</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Format d'export</label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-gray-700"
                >
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="xml">XML</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Exporter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation suppression avec mot de passe */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--color-bg-primary)] p-6 rounded-lg w-96">
            <div className="flex items-center gap-2 text-red-600 mb-4">
              <Lock className="w-5 h-5" />
              <h3 className="text-lg font-semibold">
                {deleteType === "account" ? "Supprimer mon compte" : "Supprimer mes données"}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                  ⚠️ Action irréversible
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {deleteType === "account"
                    ? "Votre compte et toutes vos données seront définitivement supprimés. Cette action ne peut pas être annulée."
                    : "Toutes vos données personnelles seront définitivement supprimées. Cette action ne peut pas être annulée."
                  }
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirmez avec votre mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={isLoading}
                />
                {passwordError && (
                  <p className="text-xs text-red-600 mt-1">{passwordError}</p>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={cancelDeletion}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDeletionWithPassword}
                  disabled={isLoading || !password}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      {deleteType === "account" ? "Supprimer le compte" : "Supprimer les données"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}