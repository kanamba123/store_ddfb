"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function FeaturesPage() {
  const { t } = useTranslation();

  const features = [
    { key: "productManagement", icon: "📦" },
    { key: "orderTracking", icon: "🛒" },
    { key: "deliveryService", icon: "🚚" },
    { key: "advancedAnalytics", icon: "📊" },
    { key: "customerManagement", icon: "👥" },
    { key: "multiPlatform", icon: "🌐" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-bold">{t("features.title")}</h1>
        <p className="mt-4 text-lg text-gray-300">{t("hero.description")}</p>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <motion.div
            key={feature.key}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-700"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">
              {t(`features.${feature.key}.title`)}
            </h3>
            <p className="text-gray-400 text-sm">
              {t(`features.${feature.key}.description`)}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
