"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useJoinUserForEmployee } from "@/hooks/apis/useEmployee"; // API à créer côté frontend

interface CreateUserModalProps {
  employee: any; // l'employé sélectionné
  onClose: () => void;
}

type FormData = {
  email: string;
  password: string;
  role: string;
};

export default function CreateUserModal({ employee, onClose }: CreateUserModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const joinUserMutation = useJoinUserForEmployee();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();


  console.log("CreateUserModal rendered for employee:", employee);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await joinUserMutation.mutateAsync({
        id: employee.id,
        data, // les infos du user à créer
      });
      toast.success(t("employees.userCreated"));
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || t("employees.errorCreatingUser"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-lg shadow-lg w-full max-w-md p-2 m-2">
        <h2 className="text-xl font-semibold mb-4">
          {t("employees.createUserFor")} {employee.firstName} {employee.lastName}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1">{t("employees.email")}</label>
            <input
              type="email"
              {...register("email", { required: t("employees.emailRequired") })}
              className="w-full p-2 border border-[var(--color-border)] rounded"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block mb-1">{t("employees.password")}</label>
            <input
              type="password"
              {...register("password", { required: t("employees.passwordRequired"), minLength: { value: 6, message: t("employees.passwordMin") } })}
              className="w-full p-2 border border-[var(--color-border)] rounded"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block mb-1">{t("employees.role")}</label>
            <select {...register("role")} className="w-full p-2 border border-[var(--color-border)] rounded">
              <option value="employee">{t("employees.employee")}</option>
              <option value="manager">{t("employees.manager")}</option>
              <option value="admin">{t("employees.admin")}</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[var(--color-border)] rounded hover:bg-gray-100 transition"
            >
              {t("employees.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? t("employees.creating") : t("employees.createUser")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
