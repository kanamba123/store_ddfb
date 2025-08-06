"use client";

import { useEffect, useState } from "react";

interface ReportData {
  month: string;
  sales: number;
  orders: number;
  customers: number;
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportData[]>([]);

  useEffect(() => {
    // Simulation des données de rapport mensuelles
    const mockData: ReportData[] = [
      { month: "Janvier", sales: 12345, orders: 320, customers: 280 },
      { month: "Février", sales: 15000, orders: 350, customers: 300 },
      { month: "Mars", sales: 17000, orders: 400, customers: 320 },
      { month: "Avril", sales: 13000, orders: 310, customers: 290 },
      { month: "Mai", sales: 16000, orders: 370, customers: 310 },
    ];

    setData(mockData);
  }, []);

  // Calcul des totaux simples
  const totalSales = data.reduce((acc, curr) => acc + curr.sales, 0);
  const totalOrders = data.reduce((acc, curr) => acc + curr.orders, 0);
  const totalCustomers = data.reduce((acc, curr) => acc + curr.customers, 0);

  return (
    <div className="p-6 dark:bg-gray-900 ">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Rapports
      </h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 shadow dark:shadow-none rounded-xl p-6 text-center border dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">Ventes Totales</p>
          <p className="text-3xl font-semibold text-green-600 dark:text-green-400">
            {totalSales.toLocaleString()} €
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow dark:shadow-none rounded-xl p-6 text-center border dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">Commandes</p>
          <p className="text-3xl font-semibold text-blue-600 dark:text-blue-400">
            {totalOrders}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow dark:shadow-none rounded-xl p-6 text-center border dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">Clients</p>
          <p className="text-3xl font-semibold text-purple-600 dark:text-purple-400">
            {totalCustomers}
          </p>
        </div>
      </div>

      {/* Tableau de données */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow dark:shadow-none rounded-xl border dark:border-gray-700">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-700 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3">Mois</th>
              <th className="px-4 py-3">Ventes (€)</th>
              <th className="px-4 py-3">Commandes</th>
              <th className="px-4 py-3">Clients</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-600 dark:text-gray-400">
            {data.map(({ month, sales, orders, customers }) => (
              <tr
                key={month}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="px-4 py-3 font-medium dark:text-gray-300">
                  {month}
                </td>
                <td className="px-4 py-3 dark:text-gray-300">
                  {sales.toLocaleString()}
                </td>
                <td className="px-4 py-3 dark:text-gray-300">{orders}</td>
                <td className="px-4 py-3 dark:text-gray-300">{customers}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <p className="p-6 text-center text-gray-500 dark:text-gray-400">
            Pas de données disponibles.
          </p>
        )}
      </div>
    </div>
  );
}
