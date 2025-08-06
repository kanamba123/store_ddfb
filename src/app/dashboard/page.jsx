export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
        Bienvenue sur votre tableau de bord
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Cards */}
        <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-xl p-4 shadow-sm dark:shadow-none border border-blue-200/50 dark:border-blue-800/30">
          <p className="text-sm">Total Commandes</p>
          <p className="text-xl font-semibold">128</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 rounded-xl p-4 shadow-sm dark:shadow-none border border-green-200/50 dark:border-green-800/30">
          <p className="text-sm">Utilisateurs actifs</p>
          <p className="text-xl font-semibold">42</p>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 rounded-xl p-4 shadow-sm dark:shadow-none border border-yellow-200/50 dark:border-yellow-800/30">
          <p className="text-sm">Produits en stock</p>
          <p className="text-xl font-semibold">312</p>
        </div>
        <div className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-xl p-4 shadow-sm dark:shadow-none border border-red-200/50 dark:border-red-800/30">
          <p className="text-sm">Alertes</p>
          <p className="text-xl font-semibold">3</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow dark:shadow-none p-6 border border-gray-200/50 dark:border-gray-700/30">
        <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">
          Activité récente
        </h3>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
          <li>
            📦 Nouveau produit ajouté :{" "}
            <strong className="dark:text-gray-100">
              Chaussure Nike Air Max
            </strong>
          </li>
          <li>
            🛒 Nouvelle commande passée par{" "}
            <strong className="dark:text-gray-100">Jean Dupont</strong>
          </li>
          <li>
            👤 Nouvel utilisateur enregistré :{" "}
            <strong className="dark:text-gray-100">Sarah Leroy</strong>
          </li>
        </ul>
      </div>
    </div>
  );
}
