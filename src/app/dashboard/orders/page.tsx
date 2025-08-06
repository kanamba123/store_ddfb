"use client";

import { useEffect, useState } from "react";

interface Order {
  id: number;
  customer: string;
  status: "En attente" | "Expédiée" | "Annulée";
  total: number;
  date: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Simulation de données
    const mockOrders: Order[] = [
      {
        id: 1,
        customer: "Alice Dupont",
        status: "En attente",
        total: 149.99,
        date: "2025-08-03",
      },
      {
        id: 2,
        customer: "Jean Martin",
        status: "Expédiée",
        total: 89.5,
        date: "2025-08-01",
      },
      {
        id: 3,
        customer: "Sophie Durand",
        status: "Annulée",
        total: 29.9,
        date: "2025-07-28",
      },
    ];

    setOrders(mockOrders);
  }, []);

  const getStatusClasses = (status: string) => {
    const baseClasses =
      "inline-block px-2 py-1 rounded-full text-xs font-semibold";

    switch (status) {
      case "En attente":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200`;
      case "Expédiée":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200`;
      case "Annulée":
        return `${baseClasses} bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className="p-6 dark:bg-gray-900 ">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Commandes
      </h1>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-xl border dark:border-gray-700">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-700 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-600 dark:text-gray-400">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="px-4 py-3 font-medium dark:text-gray-300">
                  {order.id}
                </td>
                <td className="px-4 py-3 dark:text-gray-300">
                  {order.customer}
                </td>
                <td className="px-4 py-3 dark:text-gray-300">{order.date}</td>
                <td className="px-4 py-3">
                  <span className={getStatusClasses(order.status)}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold dark:text-gray-300">
                  {order.total.toFixed(2)} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <p className="p-6 text-center text-gray-500 dark:text-gray-400">
            Aucune commande trouvée.
          </p>
        )}
      </div>
    </div>
  );
}
