"use client";

import { useState, useEffect } from "react";

type Sale = {
  id: string;
  clientName: string;
  date: string;
  amount: number;
  status: "Payée" | "En attente" | "Annulée";
};

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    // Simuler fetch de données
    const fetchSales = () => {
      const data: Sale[] = [
        {
          id: "CMD-1001",
          clientName: "Alice Dupont",
          date: "2025-08-01",
          amount: 250.0,
          status: "Payée",
        },
        {
          id: "CMD-1002",
          clientName: "Bob Martin",
          date: "2025-08-02",
          amount: 180.5,
          status: "En attente",
        },
        {
          id: "CMD-1003",
          clientName: "Claire Bernard",
          date: "2025-08-02",
          amount: 320.99,
          status: "Annulée",
        },
        {
          id: "CMD-1004",
          clientName: "David Morel",
          date: "2025-08-03",
          amount: 450.0,
          status: "Payée",
        },
        {
          id: "CMD-1005",
          clientName: "Emma Lefèvre",
          date: "2025-08-04",
          amount: 99.99,
          status: "Payée",
        },
      ];

      setSales(data);
    };

    fetchSales();
  }, []);

  const statusColors = {
    Payée:
      "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
    "En attente":
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200",
    Annulée: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200",
  };

  // Filtrer selon id, clientName ou status
  const filteredSales = sales.filter((sale) => {
    const lowerFilter = filterText.toLowerCase();
    return (
      sale.id.toLowerCase().includes(lowerFilter) ||
      sale.clientName.toLowerCase().includes(lowerFilter) ||
      sale.status.toLowerCase().includes(lowerFilter)
    );
  });

  return (
    <div className="p-6 bg-[var(--color-bg-primary)] ">
      <h1 className="text-3xl font-bold mb-6 ">
        Ventes des clients
      </h1>

      <input
        type="text"
        placeholder="Rechercher par commande, client ou statut..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="mb-6 w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400  dark:border-gray-700  dark:placeholder-gray-400"
      />

      {sales.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          Chargement des ventes...
        </p>
      ) : filteredSales.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          Aucune vente trouvée.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-gray-200  shadow rounded-lg overflow-hidden dark:shadow-none">
            <thead className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
              <tr>
                <th className="text-left px-6 py-3  font-semibold">
                  Commande
                </th>
                <th className="text-left px-6 py-3  font-semibold">
                  Client
                </th>
                <th className="text-left px-6 py-3  font-semibold">
                  Date
                </th>
                <th className="text-right px-6 py-3  font-semibold">
                  Montant (€)
                </th>
                <th className="text-left px-6 py-3  font-semibold">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr
                  key={sale.id}
                  className="border-b dark:border-gray-700 last:border-none hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <td className="px-6 py-4 ">{sale.id}</td>
                  <td className="px-6 py-4 ">
                    {sale.clientName}
                  </td>
                  <td className="px-6 py-4 ">
                    {new Date(sale.date).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 text-right font-medium ">
                    {sale.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        statusColors[sale.status]
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
