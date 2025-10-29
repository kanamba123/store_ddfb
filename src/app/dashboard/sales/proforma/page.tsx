"use client";

import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash, FaPrint, FaSyncAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProformas } from "@/hooks/apis/useProformas";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { notifyInfo, notifySuccess } from "@/components/ui/ToastNotification";

export default function ViewProforma() {
  const { data: proformas, isLoading, isError, refetch } = useProformas();
  const [selectedProformas, setSelectedProformas] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  const handlePrint = () => {
    notifySuccess("🖨 Impression des proformas sélectionnés...");
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      {/* 🔹 Toolbar / Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/sales/proforma/create">
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition-all">
              ➕ Nouveau Proforma
            </button>
          </Link>

          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="border border-blue-500 text-blue-600 px-3 py-2 rounded-lg text-sm hover:bg-blue-600 hover:text-white flex items-center gap-2 transition-all"
          >
            <FaSyncAlt className={isLoading ? "animate-spin" : ""} /> Rafraîchir
          </button>


          <button
            onClick={handlePrint}
            className="border border-green-500 text-green-600 px-3 py-2 rounded-lg text-sm hover:bg-green-600 hover:text-white flex items-center gap-2 transition-all"
          >
            <FaPrint /> Imprimer
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 🔹 Table des proformas */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        {isLoading ? (
          <LoadingSpinner text="Chargement des proformas..." isLoading />
        ) : isError ? (
          <LoadingSpinner
            text="Erreur lors du chargement."
            showRetryButton
            onRetry={refetch}
            isError
          />
        ) : filteredProformas?.length === 0 ? (
          <LoadingSpinner text="Aucun proforma trouvé." isEmpty />
        ) : (
          <table className="min-w-full text-sm text-center border-collapse">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="p-3">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedProformas(
                        e.target.checked
                          ? filteredProformas.map((p: any) => p.id)
                          : []
                      )
                    }
                    checked={
                      selectedProformas.length === filteredProformas.length
                    }
                  />
                </th>
                <th className="p-3">#ID</th>
                <th className="p-3">Client</th>
                <th className="p-3">Montant total</th>
                <th className="p-3">Date</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProformas?.map((proforma: any, index: number) => (
                <tr
                  key={proforma.id}
                  className={`${index % 2 === 0
                    ? "bg-gray-50 hover:bg-gray-100"
                    : "bg-white hover:bg-gray-100"
                    } transition-colors`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedProformas.includes(proforma.id)}
                      onChange={() => handleSelect(proforma.id)}
                    />
                  </td>
                  <td className="p-3 text-gray-700 font-medium">
                    {proforma.id}
                  </td>
                  <td className="p-3 text-gray-700">
                    {proforma.customer
                      ? `${proforma.customer.firstName} ${proforma.customer.lastName}`
                      : "Client inconnu"}
                  </td>
                  <td className="p-3 font-semibold text-green-600">
                    {parseFloat(proforma.total).toLocaleString()} FBu
                  </td>
                  <td className="p-3 text-gray-500">
                    {new Date(proforma.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${proforma.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : proforma.status === "validated"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {proforma.status || "En attente"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center gap-3">
                      <FaEye
                        className="text-blue-500 cursor-pointer hover:scale-125 transition-transform"
                        onClick={() => router.push(`/dashboard/sales/proforma/${proforma.id}`)}
                      />
                      <FaEdit
                        className="text-yellow-500 cursor-pointer hover:scale-125 transition-transform"
                        onClick={() =>
                          notifyInfo(`Modifier proforma #${proforma.id}`)
                        }
                      />
                      <FaTrash
                        className="text-red-500 cursor-pointer hover:scale-125 transition-transform"
                        onClick={() =>
                          notifyInfo(`Supprimer proforma #${proforma.id}`)
                        }
                      />
                      <FaPrint
                        className="text-teal-500 cursor-pointer hover:scale-125 transition-transform"
                        onClick={() =>
                          notifyInfo(`Impression du proforma #${proforma.id}`)
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
