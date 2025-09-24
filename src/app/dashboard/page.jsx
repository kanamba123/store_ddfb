"use client";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 p-2 bg-[var(--color-bg-primary)]">
      {/* Titre */}
      <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
        {t("dashboard.welcome")}
      </h2>

      {/* Cartes de stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[var(--color-info-bg)] text-[var(--color-info-text)] rounded-xl p-4 shadow-sm border border-[var(--color-border)]">
          <p className="text-sm">{t("dashboard.totalOrders")}</p>
          <p className="text-xl font-semibold">128</p>
        </div>
        <div className="bg-[var(--color-success-bg)] text-[var(--color-success-text)] rounded-xl p-4 shadow-sm border border-[var(--color-border)]">
          <p className="text-sm">{t("dashboard.activeUsers")}</p>
          <p className="text-xl font-semibold">42</p>
        </div>
        <div className="bg-[var(--color-warning-bg)] text-[var(--color-warning-text)] rounded-xl p-4 shadow-sm border border-[var(--color-border)]">
          <p className="text-sm">{t("dashboard.productsInStock")}</p>
          <p className="text-xl font-semibold">312</p>
        </div>
        <div className="bg-[var(--color-danger-bg)] text-[var(--color-danger-text)] rounded-xl p-4 shadow-sm border border-[var(--color-border)]">
          <p className="text-sm">{t("dashboard.alerts")}</p>
          <p className="text-xl font-semibold">3</p>
        </div>
      </div>

      {/* Activité récente */}
      <div className="bg-[var(--color-bg-primary)] rounded-xl shadow-sm p-6 border border-[var(--color-border)]">
        <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-secondary)]">
          {t("dashboard.recentActivity")}
        </h3>
        <ul className="text-sm text-[var(--color-text-secondary)] space-y-2">
          <li>
            📦 {t("dashboard.newProduct")}:{" "}
            <strong className="text-[var(--color-text-secondary)]">
              {t("dashboard.exampleProduct")}
            </strong>
          </li>
          <li>
            🛒 {t("dashboard.newOrder")}{" "}
            <strong className="text-[var(--color-text-secondary)]">
              Jean Dupont
            </strong>
          </li>
          <li>
            👤 {t("dashboard.newUser")}{" "}
            <strong className="text-[var(--color-text-secondary)]">
              Sarah Leroy
            </strong>
          </li>
        </ul>
      </div>
    </div>
  );
}
