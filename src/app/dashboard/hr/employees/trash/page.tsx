"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import FullScreenLoaderMain from "@/components/ui/FullScreenLoaderMain";
import { useEmployeesDeleted, usePermanentDeleteUser, useRestoreUser } from "@/hooks/apis/useEmployee";
import CreateUserModal from "@/components/modals/CreateUserModal";
import { Trash, Edit, UserPlus, Eye, RotateCcw } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function EmployeesPage() {
  const { t } = useTranslation();
  const { data: employees, isLoading, isError, refetch } = useEmployeesDeleted();
  const deleteEmployee = usePermanentDeleteUser();
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const restoreEmployeeMutation = useRestoreUser();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrage
  const filteredEmployees = useMemo(() => {
    if (!employees) return [];
    return employees.filter((emp: any) => {
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      return fullName.includes(search.toLowerCase()) ||
        (emp.User?.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (emp.department || "").toLowerCase().includes(search.toLowerCase()) ||
        (emp.position || "").toLowerCase().includes(search.toLowerCase());
    });
  }, [employees, search]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const closeModal = () => {
    setSelectedEmployee(null);
    setIsModalOpen(false);
  };

  const handleRestore = async (id: number) => {
    if (!confirm(t("employees.confirmRestore") || "Restaurer cet employé ?")) return;
    try {
      await restoreEmployeeMutation.mutateAsync(id);
      refetch(); // recharger la liste
    } catch (error) {
      console.error("Erreur restauration :", error);
    }
  };

  const handleDelete = () => {
    deleteEmployee.mutate(selectedEmployee, {
      onSuccess: () => {
        setShowConfirmDelete(false);
        setSelectedEmployee(null);
      }
    });

  };

  return (
    <div className="p-2 space-y-6 h-screen">
      {/* Loader / Error */}
      {isLoading && <FullScreenLoaderMain message={t("products.loading")} />}
      {isError && <p className="p-6 text-red-500">{t("employees.error")}</p>}

      {!isLoading && !isError && (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <h1 className="text-2xl font-bold whitespace-nowrap">{t("sidebar.hrEmployees")}</h1>
            <Link
              href="/dashboard/hr/employees/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center whitespace-nowrap"
            >
              {t("employees.addNew")}
            </Link>
          </div>

          {/* Search */}
          <div className="flex justify-end">
            <input
              type="text"
              placeholder={t("employees.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 border rounded w-full sm:w-64"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto text-[var(--color-text-primary)] rounded-lg shadow ">
            <table className="min-w-full table-auto divide-y divide-gray-200 whitespace-nowrap">
              <thead className="bg-[var(--color-bg-primary)]">
                <tr>
                  <th className="px-2 py-1.5">id</th>
                  <th className="px-2 py-1.5">{t("employees.name")}</th>
                  <th className="px-2 py-1.5">{t("employees.email")}</th>
                  <th className="px-2 py-1.5">{t("employees.role")}</th>
                  <th className="px-2 py-1.5">{t("employees.gender")}</th>
                  <th className="px-2 py-1.5">{t("employees.birth")}</th>
                  <th className="px-2 py-1.5">{t("employees.contract")}</th>
                  <th className="px-2 py-1.5">{t("employees.position")}</th>
                  <th className="px-2 py-1.5">{t("employees.department")}</th>
                  <th className="px-2 py-1.5">{t("employees.status")}</th>
                  <th className="px-2 text-right">{t("employees.actions")}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {paginatedEmployees.map((emp: any) => (
                  <tr key={emp.id}>
                    <td className="px-2 py-1.5">{emp.id}</td>
                    <td className="px-2 py-1.5">{emp.firstName} {emp.lastName}</td>
                    <td className="px-2 py-1.5">{emp.User?.email || "-"}</td>
                    <td className="px-2 py-1.5">{emp.User?.role || "-"}</td>
                    <td className="px-2 py-1.5">{emp.gender || "-"}</td>
                    <td className="px-2 py-1.5">{emp.dateOfBirth ? new Date(emp.dateOfBirth).toLocaleDateString() : "-"} / {emp.placeOfBirth || "-"}</td>
                    <td className="px-2 v">{emp.contractType || "-"} {emp.contractStartDate && <>({new Date(emp.contractStartDate).toLocaleDateString()} - {emp.contractEndDate ? new Date(emp.contractEndDate).toLocaleDateString() : "-"})</>}</td>
                    <td className="px-2 py-1.5">{emp.position || "-"}</td>
                    <td className="px-2 py-1.5">{emp.department || "-"}</td>
                    <td className="px-2 py-1.5">{emp.employeeStatus}</td>
                    <td className="text-right flex justify-end space-x-2 px-2 py-1.5">
                      {/* View */}
                      <Link
                        href={`/dashboard/hr/employees/${emp.id}/detail`}
                        className="relative group"
                      >
                        <Eye className="w-5 h-5 text-blue-600 hover:text-blue-800" />
                        <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                          {t("employees.view")}
                        </span>
                      </Link>

                      {/* Edit */}
                      <Link
                        href={`/dashboard/hr/employees/${emp.id}/edit`}
                        className="relative group"
                      >
                        <Edit className="w-5 h-5 text-green-600 hover:text-green-800" />
                        <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                          {t("employees.edit")}
                        </span>
                      </Link>

                      {/* Restore button */}
                      <button
                        onClick={() => handleRestore(emp.id)}
                        className="relative group"
                      >
                        <RotateCcw className="w-5 h-5 text-green-600 hover:text-green-800" />
                        <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                          {t("employees.restore")}
                        </span>
                      </button>

                      {/* Delete */}
                      <button className="relative group" onClick={() => { setSelectedEmployee(emp.id); setShowConfirmDelete(true); }}>
                        <Trash className="w-5 h-5 text-red-600 hover:text-red-800" />
                        <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                          {t("employees.deteleEmployee")}
                        </span>
                      </button>

                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end items-center space-x-2 mt-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              {"<"}
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded ${currentPage === idx + 1 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              {">"}
            </button>
          </div>

          {/* Modal */}
          {isModalOpen && selectedEmployee && (
            <CreateUserModal employee={selectedEmployee} onClose={closeModal} />
          )}
        </>
      )}
      <ConfirmDialog
        isOpen={showConfirmDelete}
        title={t("employees.deleteTitle")}
        message={t("employees.confirmDelete")}
        confirmLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmDelete(false)}
      />
    </div>
  );
}
