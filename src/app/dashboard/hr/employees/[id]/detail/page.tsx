"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useRouter } from "next/navigation";
import { useDeleteUserForEmployee, useEmployeeDetail } from "@/hooks/apis/useEmployee";
import FullScreenLoaderMain from "@/components/ui/FullScreenLoaderMain";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { Edit, Trash, Mail, User, Calendar, MapPin, Phone, Briefcase, Slash, Copy, Share2, Link } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/config/API";

export default function EmployeeDetailPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { id } = useParams();
    const { data: employee, isLoading, isError } = useEmployeeDetail(id as string);
    const deleteUserForEmployee = useDeleteUserForEmployee();
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // 🔹 Gestion du lien d’invitation
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [loadingLink, setLoadingLink] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleEdit = () => router.push(`/dashboard/hr/employees/${id}/edit`);

    const handleDelete = () => {
        deleteUserForEmployee.mutate(id as string, {
            onSuccess: () => {
                alert(t("employees.deleteSuccess"));
                router.push("/dashboard/hr/employees");
            },
        });
    };

    const handleDisableUser = async () => {
        if (!employee?.User) return;
        setIsProcessing(true);
        try {
            console.log("Disable user", employee.User.id);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la désactivation de l'utilisateur.");
        } finally {
            setIsProcessing(false);
        }
    };

    /** ------------------------------
     * 🎟️ Génération du lien privé
     * ------------------------------ */
    const handleGenerateInvite = async () => {
        if (!employee) return;
        setLoadingLink(true);
        try {
            const res = await axios.post(`${API_URL}/public-upload/generate`, {
                userId: employee.store?.userId || null,
                targetId: employee.id,
                targetType: "employee",
                validHours: 48,
                targetUserName: employee.employeeCode || employee.id, 
            });
            const url =
                res.data?.url ||
                `${window.location.origin}/rf/employees/generate/${employee.employeeCode}/${res.data.token}`;
            setInviteLink(url);
        } catch (err: any) {
            console.error("Erreur génération lien:", err);
            alert(err.response?.data?.error || "Erreur lors de la génération du lien.");
        } finally {
            setLoadingLink(false);
        }
    };

    const handleCopy = () => {
        if (!inviteLink) return;
        navigator.clipboard.writeText(inviteLink);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const handleShare = async () => {
        if (navigator.share && inviteLink) {
            await navigator.share({ title: "Lien d'inscription", url: inviteLink });
        } else {
            alert("Le partage n'est pas supporté sur ce navigateur.");
        }
    };

    if (isLoading) return <FullScreenLoaderMain message={t("employees.loading")} />;
    if (isError) return <p className="p-6 text-red-500">{t("employees.error")}</p>;
    if (!employee) return <p className="p-6">{t("employees.notFound")}</p>;

    return (
        <div className="p-4 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h1 className="text-2xl font-bold">{employee.firstName} {employee.lastName}</h1>
                <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
                    <button onClick={handleEdit} className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                        <Edit className="w-4 h-4 mr-1" /> {t("employees.edit")}
                    </button>
                    {employee.User && (
                        <button onClick={handleDisableUser} disabled={isProcessing}
                            className="flex items-center px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700">
                            <Slash className="w-4 h-4 mr-1" /> {t("employees.disableUser")}
                        </button>
                    )}
                    <button onClick={() => setShowConfirmDelete(true)}
                        className="flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
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

            {/* 🔹 Section lien d’invitation */}
            <div className="bg-[var(--color-bg-primary)] border shadow rounded-lg p-4 space-y-4">
                <h2 className="font-bold text-lg mb-2 flex items-center">
                    <Link className="w-5 h-5 mr-2 text-blue-600" /> Lien d’invitation pour créer un compte utilisateur
                </h2>

                {!inviteLink ? (
                    <button
                        onClick={handleGenerateInvite}
                        disabled={loadingLink}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loadingLink ? "Génération..." : "Générer un lien"}
                    </button>
                ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border p-3 rounded">
                        <a href={inviteLink} target="_blank" rel="noopener noreferrer"
                            className="text-blue-600 underline break-all">{inviteLink}</a>
                        <div className="flex space-x-2">
                            <button onClick={handleCopy}
                                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                                {copySuccess ? "✅ Copié" : <Copy className="w-4 h-4" />}
                            </button>
                            <button onClick={handleShare}
                                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                                <Share2 className="w-4 h-4 text-blue-600" />
                            </button>
                        </div>
                    </div>
                )}
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
