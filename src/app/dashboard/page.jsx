// app/dashboard/page.jsx
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Titre */}
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] ">
        Bienvenue sur votre tableau de bord
      </h2>

      {/* Cartes de stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[var(--color-info-bg)] text-[var(--color-info-text)] rounded-xl p-4 shadow-sm border border-[var(--color-info-border)]">
          <p className="text-sm">Total Commandes</p>
          <p className="text-xl font-semibold">128</p>
        </div>
        <div className="bg-[var(--color-success-bg)] text-[var(--color-success-text)] rounded-xl p-4 shadow-sm border border-[var(--color-success-border)]">
          <p className="text-sm">Utilisateurs actifs</p>
          <p className="text-xl font-semibold">42</p>
        </div>
        <div className="bg-[var(--color-warning-bg)] text-[var(--color-warning-text)] rounded-xl p-4 shadow-sm border border-[var(--color-warning-border)]">
          <p className="text-sm">Produits en stock</p>
          <p className="text-xl font-semibold">312</p>
        </div>
        <div className="bg-[var(--color-danger-bg)] text-[var(--color-danger-text)] rounded-xl p-4 shadow-sm border border-[var(--color-danger-border)]">
          <p className="text-sm">Alertes</p>
          <p className="text-xl font-semibold">3</p>
        </div>
      </div>

      {/* Activité récente */}
      <div className="bg-[var(--color-bg-primary)] rounded-xl shadow-sm p-6 border border-[var(--color-border)]">
        <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-secondary)]">
          Activité récente
        </h3>
        <ul className="text-sm text-[var(--color-text-secondary)] space-y-2">
          <li>
            📦 Nouveau produit ajouté :{" "}
            <strong className="text-[var(--color-text-secondary)]">
              Chaussure Nike Air Max
            </strong>
          </li>
          <li>
            🛒 Nouvelle commande passée par{" "}
            <strong className="text-[var(--color-text-secondary)]">
              Jean Dupont
            </strong>
          </li>
          <li>
            👤 Nouvel utilisateur enregistré :{" "}
            <strong className="text-[var(--color-text-secondary)]">
              Sarah Leroy
            </strong>
          </li>
        </ul>
      </div>
    </div>
  );
}
