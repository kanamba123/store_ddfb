"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useRouter } from "next/navigation";
import {
  useDeleteUserForEmployee,
  useEmployeeDetail,
  useDeletedUserDetail,
  useRestoreUser,
  usePermanentDeleteUser,
} from "@/hooks/apis/useEmployee"; // Hooks à créer pour deleted/restoration
import FullScreenLoaderMain from "@/components/ui/FullScreenLoaderMain";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  Edit,
  Trash,
  Mail,
  User,
  Calendar,
  MapPin,
  Phone,
  Briefcase,
  Slash,
  Copy,
  Share2,
  Link as LinkIcon,
  RotateCw,
} from "lucide-react";
import API from "@/config/Axios";

export default function EmployeeDetailPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useParams();
  const { data: employee, isLoading, isError } = useEmployeeDetail(id as string);
  const { data: deletedUser, isLoading: isLoadingDeleted } = useDeletedUserDetail(id as string);
  const deleteUserForEmployee = useDeleteUserForEmployee();
  const restoreUser = useRestoreUser();
  const permanentDeleteUser = usePermanentDeleteUser();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmPermanentDelete, setShowConfirmPermanentDelete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 🔹 Lien d’invitation
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [loadingLink, setLoadingLink] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  /** ------------------------------
   * ✏️ Edition & Suppression
   * ------------------------------ */
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
      // TODO: API désactivation
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
      const res = await API.post(
        `/public-upload/generateLinkToCreateUserHimself`,
        {
          targetId: employee.id,
          targetType: "employee",
          validHours: 1,
          targetUserName: employee.employeeContactPhone || employee.id,
        }
      );

      const data = res.data;
      const url =
        data?.url ||
        `${window.location.origin}/rf/employees/generate/${data.targetUserName}/${data.token}`;

      setInviteLink(url);
    } catch (err: any) {
      console.error("Erreur génération lien:", err);
      alert(
        err.response?.data?.error ||
          "Erreur lors de la génération du lien d’inscription."
      );
    } finally {
      setLoadingLink(false);
    }
  };

  /** ------------------------------
   * 📋 Copier / 🔗 Partager
   * ------------------------------ */
  const handleCopy = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share && inviteLink) {
      await navigator.share({
        title: "Lien d'inscription",
        url: inviteLink,
      });
    } else {
      alert("Le partage n'est pas supporté sur ce navigateur.");
    }
  };

  /** ------------------------------
   * 🔄 Restauration et suppression définitive
   * ------------------------------ */
  const handleRestoreUser = () => {
    if (!deletedUser) return;
    restoreUser.mutate(deletedUser.id, {
      onSuccess: () => {
        alert("Utilisateur restauré avec succès !");
        router.refresh();
      },
    });
  };

  const handlePermanentDeleteUser = () => {
    if (!deletedUser) return;
    permanentDeleteUser.mutate(deletedUser.id, {
      onSuccess: () => {
        alert("Utilisateur supprimé définitivement !");
        router.refresh();
      },
    });
  };

  /** ------------------------------
   * ⏳ États de chargement / erreur
   * ------------------------------ */
  if (isLoading || isLoadingDeleted)
    return <FullScreenLoaderMain message={t("employees.loading")} />;

  if (isError)
    return <p className="p-6 text-red-500">{t("employees.error")}</p>;

  if (!employee && !deletedUser)
    return <p className="p-6">{t("employees.notFound")}</p>;

  /** ------------------------------
   * 🧩 Rendu principal
   * ------------------------------ */
  return (
    <div className="p-4 space-y-6">
      {/* ======================= HEADER ======================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold">
          {employee?.firstName || deletedUser?.firstName}{" "}
          {employee?.lastName || deletedUser?.lastName}
        </h1>
        <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
          {employee && (
            <>
              <button
                onClick={handleEdit}
                className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Edit className="w-4 h-4 mr-1" /> {t("employees.edit")}
              </button>

              {employee.User && (
                <button
                  onClick={handleDisableUser}
                  disabled={isProcessing}
                  className="flex items-center px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
                >
                  <Slash className="w-4 h-4 mr-1" />{" "}
                  {t("employees.disableUser") || "Désactiver"}
                </button>
              )}

              <button
                onClick={() => setShowConfirmDelete(true)}
                className="flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                <Trash className="w-4 h-4 mr-1" /> {t("employees.deleteUser")}
              </button>
            </>
          )}
          {/* Buttons pour utilisateur supprimé */}
          {deletedUser && (
            <>
              <button
                onClick={handleRestoreUser}
                className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <RotateCw className="w-4 h-4 mr-1" /> Restaurer
              </button>
              <button
                onClick={() => setShowConfirmPermanentDelete(true)}
                className="flex items-center px-3 py-1 bg-red-700 text-white rounded hover:bg-red-800"
              >
                <Trash className="w-4 h-4 mr-1" /> Supprimer définitivement
              </button>
            </>
          )}
        </div>
      </div>

      {/* ======================= INFOS EMPLOYEE / SUPPRIMÉ ======================= */}
      {employee && (
        <>
          {/* -- Infos personnelles et professionnelles, invitation, etc. -- */}
            {/* ======================= INFOS PERSONNELLES ======================= */}
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
            <span>
              {employee.dateOfBirth
                ? new Date(employee.dateOfBirth).toLocaleDateString()
                : "-"}{" "}
              / {employee.placeOfBirth || "-"}
            </span>
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

      {/* ======================= INFOS PROFESSIONNELLES ======================= */}
      <div className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] shadow rounded-lg p-4 space-y-4 border border-[var(--color-border)]">
        <h2 className="font-bold text-lg mb-2">Infos professionnelles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-500" />
            <span>{employee.position || "-"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Département :</span>{" "}
            <span>{employee.department || "-"}</span>
          </div>
          <div>
            <span className="font-semibold">Contrat :</span>
            <br />
            {employee.contractType || "-"} (
            {employee.contractStartDate
              ? new Date(employee.contractStartDate).toLocaleDateString()
              : "-"}{" "}
            -{" "}
            {employee.contractEndDate
              ? new Date(employee.contractEndDate).toLocaleDateString()
              : "-"}
            )
          </div>
          <div>
            <span className="font-semibold">Salaire de base :</span>{" "}
            {employee.baseSalary || "0.00"}
          </div>
          <div>
            <span className="font-semibold">Statut :</span>
            <span
              className={`ml-2 px-2 py-0.5 rounded text-white ${
                employee.employeeStatus === "active"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              {employee.employeeStatus}
            </span>
          </div>
          <div>
            <span className="font-semibold">Ville / Pays :</span>{" "}
            {employee.city || "-"} / {employee.country || "-"}
          </div>
        </div>
      </div>

      {/* ======================= INVITATION ======================= */}
      {!employee.User ? (
        <div className="bg-[var(--color-bg-primary)] border shadow rounded-lg p-4 space-y-4">
          <h2 className="font-bold text-lg mb-2 flex items-center">
            <LinkIcon className="w-5 h-5 mr-2 text-blue-600" /> Invitation pour
            créer un compte utilisateur
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cet employé n’a pas encore de compte utilisateur. Vous pouvez lui
            envoyer un lien sécurisé pour qu’il puisse créer son compte lui-même
            et choisir son mot de passe. ⚙️
          </p>

          {!inviteLink ? (
            <button
              onClick={handleGenerateInvite}
              disabled={loadingLink}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loadingLink ? "Génération..." : "Générer un lien d'inscription"}
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border p-3 rounded">
              <a
                href={inviteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {inviteLink}
              </a>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopy}
                  className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {copySuccess ? "✅ Copié" : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Share2 className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[var(--color-bg-primary)] border shadow rounded-lg p-4 text-gray-500 italic">
          🔒 Cet employé possède déjà un compte utilisateur (
          {employee.User.email}).
          <br /> Aucun lien d’invitation n’est nécessaire.
        </div>
      )}
        </>
      )}

      {deletedUser && (
        <div className="bg-yellow-50 border border-yellow-400 p-4 rounded shadow space-y-3">
          <h2 className="font-bold text-lg">Utilisateur supprimé</h2>
          <p className="text-sm">
            Cet utilisateur a été supprimé (soft-delete). Vous pouvez le
            restaurer ou le supprimer définitivement.
          </p>
          <ul className="text-sm space-y-1">
            <li>
              <strong>Email:</strong> {deletedUser.email || "-"}
            </li>
            <li>
              <strong>Rôle:</strong> {deletedUser.role || "-"}
            </li>
            <li>
              <strong>Nom complet:</strong> {deletedUser.firstName}{" "}
              {deletedUser.lastName}
            </li>
          </ul>
        </div>
      )}

      {/* ======================= DIALOGS ======================= */}
      <ConfirmDialog
        isOpen={showConfirmDelete}
        title={t("employees.deleteTitle")}
        message={t("employees.confirmDelete")}
        confirmLabel={t("common.delete")}
        cancelLabel={t("common.cancel")}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmDelete(false)}
      />

      <ConfirmDialog
        isOpen={showConfirmPermanentDelete}
        title="Supprimer définitivement"
        message="Êtes-vous sûr de vouloir supprimer cet utilisateur définitivement ? Cette action est irréversible."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handlePermanentDeleteUser}
        onCancel={() => setShowConfirmPermanentDelete(false)}
      />
    </div>
  );
}
