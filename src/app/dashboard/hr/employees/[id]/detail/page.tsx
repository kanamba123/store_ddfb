"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useRouter } from "next/navigation";
import { useEmployeeDetail } from "@/hooks/apis/useEmployee";
import FullScreenLoaderMain from "@/components/ui/FullScreenLoaderMain";
import { Edit, Trash, Mail, User, Calendar, MapPin, Phone, Briefcase, Slash } from "lucide-react";

export default function EmployeeDetailPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { id } = useParams();
    const { data: employee, isLoading, isError } = useEmployeeDetail(id as string);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(employee);

    const handleEdit = () => router.push(`/dashboard/hr/employees/${id}/edit`);

    const handleDelete = () => {
        console.log("Delete employee", id);
        router.push("/dashboard/hr/employees");
    };

    const handleDisableUser = async () => {
        if (!currentEmployee?.User) return;
        setIsProcessing(true);
        try {
            // Ici tu appelleras ton API pour désactiver le user ou retirer le service
            // Exemple fictif : await disableUserAPI(currentEmployee.User.id);
            console.log("Disable user", currentEmployee.User.id);

            // Mise à jour locale : retirer l'utilisateur
            setCurrentEmployee({ ...currentEmployee, User: null });
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la désactivation de l'utilisateur.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) return <FullScreenLoaderMain message={t("employees.loading")} />;
    if (isError) return <p className="p-6 text-red-500">{t("employees.error")}</p>;
    if (!currentEmployee) return <p className="p-6">{t("employees.notFound")}</p>;

    return (
        <div className="p-4 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <h1 className="text-2xl font-bold">{currentEmployee.firstName} {currentEmployee.lastName}</h1>
                <div className="flex flex-col sm:flex-row sm:space-x-2 w-full sm:w-auto space-y-2 sm:space-y-0">
                    <button
                        onClick={handleEdit}
                        className="flex items-center justify-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition w-full sm:w-auto"
                    >
                        <Edit className="w-4 h-4 mr-1" /> {t("employees.edit")}
                    </button>
                    {currentEmployee.User && (
                        <button
                            onClick={handleDisableUser}
                            disabled={isProcessing}
                            className="flex items-center justify-center px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition w-full sm:w-auto"
                        >
                            <Slash className="w-4 h-4 mr-1" /> {t("employees.disableUser")}
                        </button>
                    )}
                    <button
                        onClick={() => setShowConfirmDelete(true)}
                        className="flex items-center justify-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition w-full sm:w-auto"
                    >
                        <Trash className="w-4 h-4 mr-1" /> {t("employees.delete")}
                    </button>
                </div>
            </div>


            {/* Personal Info Card */}
            <div className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] shadow rounded-lg p-4 space-y-4 border border-[var(--color-border)]">
                <h2 className="font-bold text-lg mb-2">Infos personnelles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-blue-500" />
                        <span>{currentEmployee.User?.email || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-purple-500" />
                        <span>{currentEmployee.User?.role || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-pink-500" />
                        <span>{currentEmployee.gender || currentEmployee.User?.gender || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-green-500" />
                        <span>{currentEmployee.dateOfBirth ? new Date(currentEmployee.dateOfBirth).toLocaleDateString() : "-"} / {currentEmployee.placeOfBirth || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-red-500" />
                        <span>{currentEmployee.address || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-yellow-500" />
                        <span>{currentEmployee.employeeContactPhone || "-"}</span>
                    </div>
                </div>
            </div>

            {/* Professional Info Card */}
            <div className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] shadow rounded-lg p-4 space-y-4 border border-[var(--color-border)]">
                <h2 className="font-bold text-lg mb-2">Infos professionnelles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-indigo-500" />
                        <span>{currentEmployee.position || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Département:</span> <span>{currentEmployee.department || "-"}</span>
                    </div>
                    <div>
                        <span className="font-semibold">Contrat:</span><br />
                        {currentEmployee.contractType || "-"} ({currentEmployee.contractStartDate ? new Date(currentEmployee.contractStartDate).toLocaleDateString() : "-"} - {currentEmployee.contractEndDate ? new Date(currentEmployee.contractEndDate).toLocaleDateString() : "-"})
                    </div>
                    <div>
                        <span className="font-semibold">Salaire de base:</span> {currentEmployee.baseSalary || "0.00"}
                    </div>
                    <div>
                        <span className="font-semibold">Statut:</span>
                        <span className={`ml-2 px-2 py-0.5 rounded text-white ${currentEmployee.employeeStatus === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
                            {currentEmployee.employeeStatus}
                        </span>
                    </div>
                    <div>
                        <span className="font-semibold">Ville / Pays:</span> {currentEmployee.city || "-"} / {currentEmployee.country || "-"}
                    </div>
                </div>
            </div>

            {/* Confirmation Delete */}
            {showConfirmDelete && (
                <div className="fixed inset-0 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex items-center justify-center">
                    <div className=" p-6 rounded shadow space-y-4">
                        <p>{t("employees.confirmDelete")}</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowConfirmDelete(false)}
                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                {t("common.cancel")}
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                {t("common.delete")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
