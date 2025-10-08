"use client";
import { useTranslation } from "react-i18next";
import { TrendingUp, Users, Package, ShoppingCart, AlertCircle, DollarSign, Eye, Star } from "lucide-react";

export default function DashboardPage() {
  const { t } = useTranslation();

  // Données simulées - à remplacer par vos appels API
  const statsData = {
    revenue: { current: 12480, previous: 9820, trend: 27.1 },
    orders: { current: 342, previous: 298, trend: 14.8 },
    customers: { current: 1247, previous: 1120, trend: 11.3 },
    products: { current: 156, previous: 142, trend: 9.9 },
    conversion: { value: 3.2, trend: 5.2 },
    averageOrder: { value: 156.50, trend: 8.7 }
  };

  const recentOrders = [
    { id: 1, customer: "Jean Dupont", amount: 189.90, status: "delivered", date: "2024-01-15" },
    { id: 2, customer: "Marie Lambert", amount: 245.50, status: "processing", date: "2024-01-15" },
    { id: 3, customer: "Pierre Martin", amount: 89.99, status: "shipped", date: "2024-01-14" },
    { id: 4, customer: "Sophie Chen", amount: 156.00, status: "pending", date: "2024-01-14" }
  ];

  const topProducts = [
    { name: "iPhone 15 Pro", sales: 42, revenue: 12580, rating: 4.8 },
    { name: "AirPods Pro", sales: 38, revenue: 4560, rating: 4.6 },
    { name: "MacBook Air", sales: 25, revenue: 14975, rating: 4.9 },
    { name: "Apple Watch", sales: 31, revenue: 3720, rating: 4.7 }
  ];

  const getStatusColor = (status) => {
    const colors = {
      delivered: "text-green-600 bg-green-50",
      processing: "text-blue-600 bg-blue-50",
      shipped: "text-orange-600 bg-orange-50",
      pending: "text-gray-600 bg-gray-50"
    };
    return colors[status] || "text-gray-600 bg-gray-50";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-[var(--color-bg-primary)]">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
            {t("dashboard.welcome")}
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Aperçu de vos performances et activités
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)]">
            <option>Aujourd'hui</option>
            <option>Cette semaine</option>
            <option>Ce mois</option>
            <option>Cette année</option>
          </select>
        </div>
      </div>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Revenu */}
        <div className="rounded-2xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)]">Revenu total</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">
                {formatCurrency(statsData.revenue.current)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">
                  +{statsData.revenue.trend}%
                </span>
                <span className="text-sm text-[var(--color-text-secondary)] ml-1">
                  vs période précédente
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Commandes */}
        <div className=" rounded-2xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)]">Commandes</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">
                {statsData.orders.current}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">
                  +{statsData.orders.trend}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Clients */}
        <div className=" rounded-2xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)]">Clients</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">
                {statsData.customers.current}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">
                  +{statsData.customers.trend}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Produits */}
        <div className=" rounded-2xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)]">Produits</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">
                {statsData.products.current}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">
                  +{statsData.products.trend}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Deuxième ligne de métriques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Taux de conversion */}
        <div className=" rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)]">Taux de conversion</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">
                {statsData.conversion.value}%
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">
                  +{statsData.conversion.trend}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl">
              <Eye className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Panier moyen */}
        <div className=" rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)]">Panier moyen</p>
              <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">
                {formatCurrency(statsData.averageOrder.value)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">
                  +{statsData.averageOrder.trend}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <ShoppingCart className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Grille inférieure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commandes récentes */}
        <div className=" rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Commandes récentes
            </h3>
            <button className="text-sm text-[var(--color-primary)] font-medium hover:text-[var(--color-primary-dark)]">
              Voir tout
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)]">
                      {order.customer}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {new Date(order.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[var(--color-text-primary)]">
                    {formatCurrency(order.amount)}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Produits populaires */}
        <div className=" rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Produits populaires
            </h3>
            <button className="text-sm text-[var(--color-primary)] font-medium hover:text-[var(--color-primary-dark)]">
              Voir tout
            </button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)]">
                      {product.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-[var(--color-text-secondary)] ml-1">
                          {product.rating}
                        </span>
                      </div>
                      <span className="text-xs text-[var(--color-text-secondary)]">
                        {product.sales} ventes
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[var(--color-text-primary)]">
                    {formatCurrency(product.revenue)}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Revenu
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertes et notifications */}
      <div className=" rounded-2xl p-6 shadow-sm border border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center">
            <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
            Alertes importantes
          </h3>
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">3 nouvelles</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-sm font-medium text-red-800">Stock faible sur 5 produits</p>
            </div>
            <button className="text-red-600 hover:text-red-800 text-sm font-medium">
              Vérifier
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <p className="text-sm font-medium text-yellow-800">3 commandes en attente de traitement</p>
            </div>
            <button className="text-yellow-600 hover:text-yellow-800 text-sm font-medium">
              Traiter
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm font-medium text-blue-800">Mise à jour système disponible</p>
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Mettre à jour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}