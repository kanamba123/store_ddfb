"use client";

import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash, FaPrint, FaSyncAlt, FaCheck, FaTimes, FaSearch, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProformas, useDeleteProforma } from "@/hooks/apis/useProformas";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { notifyInfo, notifySuccess, notifyError } from "@/components/ui/ToastNotification";
import ConfirmationDialog from "./components/ConfirmationDialog";

export default function ViewProforma() {
  const { data: proformas, isLoading, isError, refetch } = useProformas();
  const deleteProformaMutation = useDeleteProforma();
  const [selectedProformas, setSelectedProformas] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    type: "single",
    id: "",
    count: 0
  });
  const router = useRouter();

  const filteredProformas = proformas?.filter((p: any) =>
    `${p.customer?.firstName ?? ""} ${p.customer?.lastName ?? ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleSelect = (id: string) => {
    setSelectedProformas((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedProformas(
      checked && filteredProformas
        ? filteredProformas.map((p: any) => p.id)
        : []
    );
  };

  const handlePrint = () => {
    if (selectedProformas.length === 0) {
      notifyInfo("Veuillez sélectionner au moins un proforma à imprimer.");
      return;
    }
    notifySuccess(`🖨 Impression de ${selectedProformas.length} proforma(s) sélectionné(s)...`);
  };

  const handleEdit = (proformaId: string) => {
    router.push(`/dashboard/sales/proforma/edit/${proformaId}`);
  };

  // Ouvrir la dialog de suppression
  const openDeleteDialog = (type: "single" | "multiple", id: string = "") => {
    if (type === "single" && !id) return;
    
    if (type === "multiple" && selectedProformas.length === 0) {
      notifyInfo("Veuillez sélectionner au moins un proforma à supprimer.");
      return;
    }

    setDeleteDialog({
      open: true,
      type,
      id,
      count: type === "multiple" ? selectedProformas.length : 1
    });
  };

  // Fermer la dialog
  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      type: "single",
      id: "",
      count: 0
    });
  };

  // Confirmer la suppression
  const confirmDelete = async () => {
    try {
      if (deleteDialog.type === "single") {
        await deleteProformaMutation.mutateAsync(deleteDialog.id);
        notifySuccess("Proforma supprimé avec succès !");
      } else {
        const deletePromises = selectedProformas.map(id => 
          deleteProformaMutation.mutateAsync(id)
        );
        await Promise.all(deletePromises);
        notifySuccess(`${selectedProformas.length} proforma(s) supprimé(s) avec succès !`);
        setSelectedProformas([]);
      }
    } catch (error) {
      notifyError("Erreur lors de la suppression");
    } finally {
      closeDeleteDialog();
    }
  };

  // Obtenir le texte de confirmation
  const getDeleteMessage = () => {
    if (deleteDialog.type === "single") {
      const proforma = proformas?.find((p: any) => p.id === deleteDialog.id);
      const clientName = proforma?.customer 
        ? `${proforma.customer.firstName} ${proforma.customer.lastName}`
        : "ce proforma";
      return `Êtes-vous sûr de vouloir supprimer le proforma de ${clientName} ? Cette action est irréversible.`;
    } else {
      return `Êtes-vous sûr de vouloir supprimer les ${deleteDialog.count} proforma(s) sélectionné(s) ? Cette action est irréversible.`;
    }
  };

  // Icônes responsive
  const ActionIcon = ({ icon: Icon, onClick, title, color }: { 
    icon: React.ComponentType<any>, 
    onClick: () => void, 
    title: string, 
    color: string 
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 sm:p-2 rounded-lg transition-all hover:scale-110 ${color} bg-white border border-gray-200 shadow-sm hover:shadow-md`}
    >
      <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* 🔹 Dialog de confirmation de suppression */}
        <ConfirmationDialog
          open={deleteDialog.open}
          onClose={closeDeleteDialog}
          onConfirm={confirmDelete}
          title={deleteDialog.type === "single" ? "Supprimer le proforma" : "Supprimer les proformas"}
          message={getDeleteMessage()}
        />

        {/* 🔹 Header Principal */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Gestion des Proformas
              </h1>
              <p className="text-sm text-gray-600">
                Consultez et gérez tous vos proformas en un seul endroit
              </p>
            </div>
            
            {/* Indicateurs rapides */}
            <div className="flex flex-wrap gap-2">
              <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium">
                {filteredProformas?.length || 0} proforma(s)
              </div>
              {selectedProformas.length > 0 && (
                <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium">
                  {selectedProformas.length} sélectionné(s)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 🔹 Toolbar / Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Actions principales */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Link href="/dashboard/sales/proforma/create">
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
                  <FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Nouveau Proforma</span>
                  <span className="xs:hidden">Nouveau</span>
                </button>
              </Link>

              <button
                onClick={() => refetch()}
                disabled={isLoading}
                className="border border-blue-500 text-blue-600 px-3 sm:px-4 py-2 rounded-lg text-sm hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <FaSyncAlt className={`w-3 h-3 sm:w-4 sm:h-4 ${isLoading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Rafraîchir</span>
              </button>

              {selectedProformas.length > 0 && (
                <>
                  <button
                    onClick={handlePrint}
                    className="border border-green-500 text-green-600 px-3 sm:px-4 py-2 rounded-lg text-sm hover:bg-green-600 hover:text-white flex items-center gap-2 transition-all"
                  >
                    <FaPrint className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Imprimer</span>
                    <span className="sm:hidden">({selectedProformas.length})</span>
                  </button>

                  <button
                    onClick={() => openDeleteDialog("multiple")}
                    disabled={deleteProformaMutation.isPending}
                    className="border border-red-500 text-red-600 px-3 sm:px-4 py-2 rounded-lg text-sm hover:bg-red-600 hover:text-white flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Supprimer</span>
                    <span className="sm:hidden">({selectedProformas.length})</span>
                  </button>

                  <button
                    onClick={() => setSelectedProformas([])}
                    className="border border-gray-500 text-gray-600 px-3 sm:px-4 py-2 rounded-lg text-sm hover:bg-gray-600 hover:text-white flex items-center gap-2 transition-all"
                  >
                    <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Annuler</span>
                  </button>
                </>
              )}
            </div>

            {/* Recherche */}
            <div className="relative flex-1 max-w-md">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher un client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 Table des proformas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8">
              <LoadingSpinner text="Chargement des proformas..." isLoading />
            </div>
          ) : isError ? (
            <div className="p-8">
              <LoadingSpinner
                text="Erreur lors du chargement."
                showRetryButton
                onRetry={refetch}
                isError
              />
            </div>
          ) : filteredProformas?.length === 0 ? (
            <div className="p-8 text-center">
              <LoadingSpinner text="Aucun proforma trouvé." isEmpty />
            </div>
          ) : (
            <>
              {/* Table Desktop */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="p-4 text-left">
                        <input
                          type="checkbox"
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          checked={
                            selectedProformas.length > 0 &&
                            selectedProformas.length === filteredProformas.length
                          }
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="p-4 text-left font-semibold text-gray-700">#ID</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Client</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Montant total</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Date</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Statut</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProformas?.map((proforma: any) => (
                      <tr
                        key={proforma.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          selectedProformas.includes(proforma.id) 
                            ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                            : ''
                        }`}
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedProformas.includes(proforma.id)}
                            onChange={() => handleSelect(proforma.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="p-4 font-medium text-gray-900">
                          #{proforma.id}
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {proforma.customer
                                ? `${proforma.customer.firstName} ${proforma.customer.lastName}`
                                : "Client inconnu"}
                            </div>
                            {proforma.customer?.phoneNumber && (
                              <div className="text-xs text-gray-500 mt-1">
                                {proforma.customer.phoneNumber}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-green-600">
                          {parseFloat(proforma.total).toLocaleString()} FBu
                        </td>
                        <td className="p-4 text-gray-500">
                          {new Date(proforma.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              proforma.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : proforma.status === "validated"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {proforma.status || "En attente"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <ActionIcon
                              icon={FaEye}
                              onClick={() => router.push(`/dashboard/sales/proforma/${proforma.id}`)}
                              title="Voir les détails"
                              color="text-blue-600 hover:text-blue-700"
                            />
                            <ActionIcon
                              icon={FaEdit}
                              onClick={() => handleEdit(proforma.id)}
                              title="Modifier"
                              color="text-yellow-600 hover:text-yellow-700"
                            />
                            <ActionIcon
                              icon={FaTrash}
                              onClick={() => openDeleteDialog("single", proforma.id)}
                              title="Supprimer"
                              color="text-red-600 hover:text-red-700"
                            />
                            <ActionIcon
                              icon={FaPrint}
                              onClick={() => notifyInfo(`Impression du proforma #${proforma.id}`)}
                              title="Imprimer"
                              color="text-teal-600 hover:text-teal-700"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards Mobile */}
              <div className="lg:hidden p-4 space-y-4">
                {filteredProformas?.map((proforma: any) => (
                  <div
                    key={proforma.id}
                    className={`bg-white border border-gray-200 rounded-xl p-4 shadow-sm ${
                      selectedProformas.includes(proforma.id) 
                        ? 'border-l-4 border-l-blue-500 bg-blue-50' 
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedProformas.includes(proforma.id)}
                          onChange={() => handleSelect(proforma.id)}
                          className="rounded border-gray-300"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            #{proforma.id}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(proforma.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          proforma.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : proforma.status === "validated"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {proforma.status || "En attente"}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {proforma.customer
                            ? `${proforma.customer.firstName} ${proforma.customer.lastName}`
                            : "Client inconnu"}
                        </div>
                        {proforma.customer?.phoneNumber && (
                          <div className="text-xs text-gray-500">
                            {proforma.customer.phoneNumber}
                          </div>
                        )}
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        {parseFloat(proforma.total).toLocaleString()} FBu
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <div className="flex gap-2">
                        <ActionIcon
                          icon={FaEye}
                          onClick={() => router.push(`/dashboard/sales/proforma/${proforma.id}`)}
                          title="Voir les détails"
                          color="text-blue-600 hover:text-blue-700"
                        />
                        <ActionIcon
                          icon={FaEdit}
                          onClick={() => handleEdit(proforma.id)}
                          title="Modifier"
                          color="text-yellow-600 hover:text-yellow-700"
                        />
                      </div>
                      <div className="flex gap-2">
                        <ActionIcon
                          icon={FaTrash}
                          onClick={() => openDeleteDialog("single", proforma.id)}
                          title="Supprimer"
                          color="text-red-600 hover:text-red-700"
                        />
                        <ActionIcon
                          icon={FaPrint}
                          onClick={() => notifyInfo(`Impression du proforma #${proforma.id}`)}
                          title="Imprimer"
                          color="text-teal-600 hover:text-teal-700"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 🔹 Pied de page */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600">
          <span>
            Total: {filteredProformas?.length || 0} proforma(s)
          </span>
          {selectedProformas.length > 0 && (
            <span className="text-blue-600 font-medium">
              {selectedProformas.length} proforma(s) sélectionné(s)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}