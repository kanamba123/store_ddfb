"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useRouter } from "next/navigation";
import { useDeleteUserForEmployee, useEmployeeDetail } from "@/hooks/apis/useEmployee";
import FullScreenLoaderMain from "@/components/ui/FullScreenLoaderMain";
import { Edit, Trash, Mail, User, Calendar, MapPin, Phone, Briefcase, Slash } from "lucide-react";
import { on } from "events";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function EmployeeDetailPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { id } = useParams();
    const { data: employee, isLoading, isError } = useEmployeeDetail(id as string);
    const deleteUserForEmployee = useDeleteUserForEmployee();
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleEdit = () => router.push(`/dashboard/hr/employees/${id}/edit`);

    const handleDelete = () => {
        deleteUserForEmployee.mutate(id as string, {
            onSuccess: () => {
                alert(t("employees.deleteSuccess"));
                router.push("/dashboard/hr/employees");
            }
        });

    };

    const handleDisableUser = async () => {
        if (!employee?.User) return;
        setIsProcessing(true);
        try {
            // Ici tu appelleras ton API pour désactiver le user ou retirer le service
            // Exemple fictif : await disableUserAPI(employee.User.id);
            console.log("Disable user", employee.User.id);

        } catch (err) {
            console.error(err);
            alert("Erreur lors de la désactivation de l'utilisateur.");
        } finally {
            setIsProcessing(false);
        }
    };

    // pas besoin de employee ici
    if (isLoading) return <FullScreenLoaderMain message={t("employees.loading")} />;
    if (isError) return <p className="p-6 text-red-500">{t("employees.error")}</p>;
    if (!employee) return <p className="p-6">{t("employees.notFound")}</p>;

    return (
        <div className="p-4 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <h1 className="text-2xl font-bold">{employee.firstName} {employee.lastName}</h1>
                <div className="flex flex-col sm:flex-row sm:space-x-2 w-full sm:w-auto space-y-2 sm:space-y-0">
                    <button
                        onClick={handleEdit}
                        className="flex items-center justify-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition w-full sm:w-auto"
                    >
                        <Edit className="w-4 h-4 mr-1" /> {t("employees.edit")}
                    </button>
                    {employee.User && (
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
                        <Trash className="w-4 h-4 mr-1" /> {t("employees.deleteUser")}
                    </button>
                </div>
            </div>


            {/* Personal Info Card */}
            <div className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] shadow rounded-lg p-4 space-y-4 border border-[var(--color-border)]">
                <h2 className="font-bold text-lg mb-2">Infos personnelles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-blue-500" />
                        <span>{employee.User?.email || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-purple-500" />
                        <span>{employee.User?.role || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-pink-500" />
                        <span>{employee.gender || employee.User?.gender || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-green-500" />
                        <span>{employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : "-"} / {employee.placeOfBirth || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-red-500" />
                        <span>{employee.address || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-yellow-500" />
                        <span>{employee.employeeContactPhone || "-"}</span>
                    </div>
                </div>
            </div>

            {/* Professional Info Card */}
            <div className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] shadow rounded-lg p-4 space-y-4 border border-[var(--color-border)]">
                <h2 className="font-bold text-lg mb-2">Infos professionnelles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-indigo-500" />
                        <span>{employee.position || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Département:</span> <span>{employee.department || "-"}</span>
                    </div>
                    <div>
                        <span className="font-semibold">Contrat:</span><br />
                        {employee.contractType || "-"} ({employee.contractStartDate ? new Date(employee.contractStartDate).toLocaleDateString() : "-"} - {employee.contractEndDate ? new Date(employee.contractEndDate).toLocaleDateString() : "-"})
                    </div>
                    <div>
                        <span className="font-semibold">Salaire de base:</span> {employee.baseSalary || "0.00"}
                    </div>
                    <div>
                        <span className="font-semibold">Statut:</span>
                        <span className={`ml-2 px-2 py-0.5 rounded text-white ${employee.employeeStatus === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
                            {employee.employeeStatus}
                        </span>
                    </div>
                    <div>
                        <span className="font-semibold">Ville / Pays:</span> {employee.city || "-"} / {employee.country || "-"}
                    </div>
                </div>
            </div>

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
