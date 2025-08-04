export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Bienvenue sur votre tableau de bord</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Exemple de statistiques ou widgets */}
        <div className="bg-blue-100 text-blue-800 rounded-xl p-4 shadow-sm">
          <p className="text-sm">Total Commandes</p>
          <p className="text-xl font-semibold">128</p>
        </div>
        <div className="bg-green-100 text-green-800 rounded-xl p-4 shadow-sm">
          <p className="text-sm">Utilisateurs actifs</p>
          <p className="text-xl font-semibold">42</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 rounded-xl p-4 shadow-sm">
          <p className="text-sm">Produits en stock</p>
          <p className="text-xl font-semibold">312</p>
        </div>
        <div className="bg-red-100 text-red-800 rounded-xl p-4 shadow-sm">
          <p className="text-sm">Alertes</p>
          <p className="text-xl font-semibold">3</p>
        </div>
      </div>

      {/* Section contenu */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Activité récente</h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>📦 Nouveau produit ajouté : <strong>Chaussure Nike Air Max</strong></li>
          <li>🛒 Nouvelle commande passée par <strong>Jean Dupont</strong></li>
          <li>👤 Nouvel utilisateur enregistré : <strong>Sarah Leroy</strong></li>
        </ul>
      </div>
    </div>
  );
}
