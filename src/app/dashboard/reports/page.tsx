'use client';

import { useEffect, useState } from 'react';

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
      { month: 'Janvier', sales: 12345, orders: 320, customers: 280 },
      { month: 'Février', sales: 15000, orders: 350, customers: 300 },
      { month: 'Mars', sales: 17000, orders: 400, customers: 320 },
      { month: 'Avril', sales: 13000, orders: 310, customers: 290 },
      { month: 'Mai', sales: 16000, orders: 370, customers: 310 },
    ];

    setData(mockData);
  }, []);

  // Calcul des totaux simples
  const totalSales = data.reduce((acc, curr) => acc + curr.sales, 0);
  const totalOrders = data.reduce((acc, curr) => acc + curr.orders, 0);
  const totalCustomers = data.reduce((acc, curr) => acc + curr.customers, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Rapports</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p className="text-gray-500">Ventes Totales</p>
          <p className="text-3xl font-semibold text-green-600">{totalSales.toLocaleString()} €</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p className="text-gray-500">Commandes</p>
          <p className="text-3xl font-semibold text-blue-600">{totalOrders}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p className="text-gray-500">Clients</p>
          <p className="text-3xl font-semibold text-purple-600">{totalCustomers}</p>
        </div>
      </div>

      {/* Tableau de données */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <tr>
              <th className="px-4 py-3">Mois</th>
              <th className="px-4 py-3">Ventes (€)</th>
              <th className="px-4 py-3">Commandes</th>
              <th className="px-4 py-3">Clients</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-600">
            {data.map(({ month, sales, orders, customers }) => (
              <tr key={month} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{month}</td>
                <td className="px-4 py-3">{sales.toLocaleString()}</td>
                <td className="px-4 py-3">{orders}</td>
                <td className="px-4 py-3">{customers}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <p className="p-6 text-center text-gray-500">Pas de données disponibles.</p>
        )}
      </div>
    </div>
  );
}
