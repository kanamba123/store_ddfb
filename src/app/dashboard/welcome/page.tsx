"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ShoppingCart, Users, BarChart, ArrowRight, CheckCircle } from "lucide-react";


export default function WelcomePage() {
  const { t } = useTranslation();

  return (
    <div className="p-4 space-y-10 min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold break-words leading-tight">
            {t("welcomeDashboard.title")}{" "}
            <span className="text-blue-600">StoreDDFB</span>
          </h1>

         
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center whitespace-nowrap shadow"
        >
          {t("welcomeDashboard.startButton")}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>

      {/* Description */}
      <p className="text-lg leading-relaxed max-w-3xl text-center sm:text-left">
        {t("welcomeDashboard.description")}
      </p>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full">
        {/* Products Card */}
        <Link
          href="/dashboard/products"
          className="bg-[var(--color-bg-primary)] border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1 active:scale-95 cursor-pointer p-6 flex flex-col items-center text-center space-y-3"
        >
          <ShoppingCart size={40} className="text-yellow-500" />
          <h2 className="text-lg font-bold">
            {t("welcomeDashboard.cards.products.title")}
          </h2>
          <p className="text-sm opacity-80">
            {t("welcomeDashboard.cards.products.desc")}
          </p>
        </Link>

        {/* Clients Card */}
        <Link
          href="/dashboard/customers"
          className="bg-[var(--color-bg-primary)] border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1 active:scale-95 cursor-pointer p-6 flex flex-col items-center text-center space-y-3"
        >
          <Users size={40} className="text-green-500" />
          <h2 className="text-lg font-bold">
            {t("welcomeDashboard.cards.clients.title")}
          </h2>
          <p className="text-sm opacity-80">
            {t("welcomeDashboard.cards.clients.desc")}
          </p>
        </Link>

        {/* Statistics Card */}
        <Link
          href="/dashboard/analytics"
          className="bg-[var(--color-bg-primary)] border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1 active:scale-95 cursor-pointer p-6 flex flex-col items-center text-center space-y-3"
        >
          <BarChart size={40} className="text-blue-500" />
          <h2 className="text-lg font-bold">
            {t("welcomeDashboard.cards.statistics.title")}
          </h2>
          <p className="text-sm opacity-80">
            {t("welcomeDashboard.cards.statistics.desc")}
          </p>
        </Link>
      </div>


      {/* Guidelines */}
      <div className="mt-12 text-center md:text-left space-y-4 text-sm md:text-base max-w-3xl mx-auto">
        <p className="font-semibold text-blue-600">
          {t("welcomeDashboard.guidelines.motivation")}
        </p>
        <ul className="space-y-2">
          {(t("welcomeDashboard.guidelines.points", { returnObjects: true }) as string[]).map(
            (point, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
