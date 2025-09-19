"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

// ✅ Type pour un employé
interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Exemple de données simulées (à remplacer par API)
const initialEmployees: Employee[] = [
  { id: 1, name: "Alice Dupont", email: "alice@example.com", role: "Vendeur" },
  { id: 2, name: "Bob Martin", email: "bob@example.com", role: "Livreur" },
  { id: 3, name: "Clara Niyonzima", email: "clara@example.com", role: "Caissier" },
];

export default function EmployeesPage() {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    // Ici tu pourrais fetch depuis ton API
    setEmployees(initialEmployees);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("sidebar.hrEmployees")}</h1>
        <Link
          href="/dashboard/hr/employees/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("employees.addNew")}
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("employees.name")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("employees.email")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("employees.role")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("employees.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td className="px-6 py-4 whitespace-nowrap">{emp.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{emp.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  <Link
                    href={`/dashboard/hr/employees/${emp.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {t("employees.view")}
                  </Link>
                  <Link
                    href={`/dashboard/hr/employees/${emp.id}/edit`}
                    className="text-green-600 hover:text-green-800"
                  >
                    {t("employees.edit")}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
