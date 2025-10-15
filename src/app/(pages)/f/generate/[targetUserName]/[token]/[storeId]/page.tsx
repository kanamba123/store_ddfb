"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useCreateEmployee } from "@/hooks/apis/useEmployee";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config/API";

type EmployeeForm = {
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  cni: string;
  gender?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  maritalStatus?: string;
  spouseName?: string;
  nationality?: string;
  address?: string;
  phoneNumbers?: string;
  employeeCode?: string;
  contractType?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  employeeCategory?: string;
  position?: string;
  department?: string;
  baseSalary?: number;
  bankName?: string;
  bankAccountNumber?: string;
  socialSecurityNumber?: string;
  insuranceNumber?: string;
  city?: string;
  country?: string;
  storeId?: string;

};

export default function NewEmployeePage() {
  const { token, targetUserName, storeId } = useParams<{ token: string; targetUserName: string, storeId: string }>();
  const router = useRouter();
  const createEmployee = useCreateEmployee();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeForm>();

  /**
   * Vérifie la validité du lien public (token + targetUserName)
   */
  useEffect(() => {
    if (!token || !targetUserName) return;

    const validate = async () => {
      try {
        const res = await axios.get(`${API_URL}/public-upload/validateSiginUpEmployee/${targetUserName}/${token}`);

        if (!res.data?.valid) {
          setError("⛔ Lien invalide ou expiré.");
        }
      } catch {
        setError("⛔ Lien invalide ou expiré.");
      } finally {
        setLoading(false);
      }
    };

    validate();
  }, [token, targetUserName]);

  /**
   * Soumission du formulaire
   */
  const onSubmit = async (data: EmployeeForm) => {
    try {
      if (data.baseSalary) {
        data.baseSalary = Number(data.baseSalary);
      }
      if(storeId)
        data.storeId = storeId;

      await createEmployee.mutateAsync(data);
      setSubmitted(true);
    } catch (err) {
      console.error(t("employees.errorSubmit"), err);
    }
  };

  /**
   * États de chargement / erreur / succès
   */
  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600 dark:text-gray-300">
        ⏳ Vérification du lien du token...
      </p>
    );

  if (error)
    return (
      <div className="max-w-lg mx-auto mt-20 p-6 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-center shadow">
        <p className="text-xl font-semibold">{error}</p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Le lien que vous avez utilisé est invalide ou a expiré.
        </p>
      </div>
    );

  if (submitted)
    return (
      <div className="max-w-lg mx-auto mt-20 p-6 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg text-center shadow">
        <p className="text-xl font-semibold">✅ Employé ajouté avec succès !</p>
      </div>
    );

  /**
   * Rendu du formulaire (seulement si lien valide)
   */
  return (
    <div className="p-2 max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">{t("employees.addNew")}</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] p-2 rounded-xl shadow-md border border-[var(--color-border)]"
      >
        {/* Section Identité */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">{t("employees.identity")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label>{t("employees.firstName")}</label>
              <input
                {...register("firstName", { required: t("employees.required") })}
                type="text"
                className="w-full p-2 border border-[var(--color-border)] rounded"
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
            </div>
            <div>
              <label>{t("employees.lastName")}</label>
              <input
                {...register("lastName", { required: t("employees.required") })}
                type="text"
                className="w-full p-2 border border-[var(--color-border)] rounded"
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
            </div>


            <div>
              <label>{t("employees.fatherName")}</label>
              <input
                {...register("fatherName", { required: t("employees.required") })}
                type="text"
                className="w-full p-2 border border-[var(--color-border)] rounded"
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
            </div>
            <div>
              <label>{t("employees.motherName")}</label>
              <input
                {...register("motherName", { required: t("employees.required") })}
                type="text"
                className="w-full p-2 border border-[var(--color-border)] rounded"
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
            </div>

            <div>
              <label>CNI</label>
              <input
                {...register("cni", { required: t("employees.required") })}
                type="text"
                className="w-full p-2 border border-[var(--color-border)] rounded"
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
            </div>

            <div>
              <label>{t("employees.gender")}</label>
              <select {...register("gender")} className="w-full p-2 border border-[var(--color-border)] rounded">
                <option value="">{t("employees.selectGender")}</option>
                <option value="male">{t("employees.male")}</option>
                <option value="female">{t("employees.female")}</option>
              </select>
            </div>
            <div>
              <label>{t("employees.dateOfBirth")}</label>
              <input {...register("dateOfBirth")} type="date" className="w-full p-2 border border-[var(--color-border)] rounded" />
            </div>
            <div>
              <label>{t("employees.placeOfBirth")}</label>
              <input {...register("placeOfBirth")} type="text" className="w-full p-2 border border-[var(--color-border)] rounded" />
            </div>
            <div>
              <label>{t("employees.nationality")}</label>
              <select {...register("nationality")} className="w-full p-2 border border-[var(--color-border)] rounded">
                <option value="">{t("employees.selectNationality")}</option>
                <option value="Burundian">Burundian</option>
                <option value="Congolese">Congolese</option>
                <option value="Rwandese">Rwandese</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </section>



        {/* Section Infos Familiales */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">{t("employees.family")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>{t("employees.maritalStatus")}</label>
              <select {...register("maritalStatus")} className="w-full p-2 border border-[var(--color-border)] rounded">
                <option value="">{t("employees.selectMaritalStatus")}</option>
                <option value="single">{t("employees.single")}</option>
                <option value="married">{t("employees.married")}</option>
                <option value="widowed">{t("employees.widowed")}</option>
              </select>
            </div>
            <div>
              <label>{t("employees.spouseName")}</label>
              <input {...register("spouseName")} type="text" className="w-full p-2 border border-[var(--color-border)] rounded" />
            </div>
            <div>
              <label>{t("employees.address")}</label>
              <input {...register("address")} type="text" className="w-full p-2 border border-[var(--color-border)] rounded" />
            </div>
            <div>
              <label>{t("employees.phoneNumbers")}</label>
              <input {...register("phoneNumbers")} type="text" className="w-full p-2 border border-[var(--color-border)] rounded" />
            </div>
          </div>
        </section>

        {/* Section Infos Bancaires */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">{t("employees.bankInfo")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>{t("employees.bankName")}</label>
              <select {...register("bankName")} className="w-full p-2 border border-[var(--color-border)] rounded">
                <option value="">{t("employees.selectBank")}</option>
                <option value="BANCOBU">BANCOBU</option>
                <option value="BCB">Banque de Crédit de Bujumbura (BCB)</option>
                <option value="INTERBANK">Interbank Burundi</option>
                <option value="BBCI">Banque Burundaise pour le Commerce et l’Investissement (BBCI)</option>
                <option value="BGF">Banque de Gestion et de Financement (BGF)</option>
                <option value="FINBANK">FINBANK Burundi</option>
                <option value="DTB">Diamond Trust Bank (DTB Burundi)</option>
                <option value="KCB">KCB Bank Burundi</option>
                <option value="CRDB">CRDB Bank Burundi</option>
                <option value="LUMICASH">Lumicash</option>
                <option value="ECOCASH">Ecocash</option>
                <option value="SMARTPESA">Smart Pesa</option>
              </select>
            </div>

            <div>
              <label>{t("employees.bankAccountNumber")}</label>
              <input {...register("bankAccountNumber")} type="text" className="w-full p-2 border border-[var(--color-border)] rounded" />
            </div>
            <div>
              <label>{t("employees.socialSecurityNumber")}</label>
              <input {...register("socialSecurityNumber")} type="text" className="w-full p-2 border border-[var(--color-border)] rounded" />
            </div>
            <div>
              <label>{t("employees.insuranceNumber")}</label>
              <input {...register("insuranceNumber")} type="text" className="w-full p-2 border border-[var(--color-border)] rounded" />
            </div>
          </div>
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || createEmployee.isPending}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {createEmployee.isPending ? t("employees.saving") : t("employees.save")}
        </button>
      </form>
    </div>
  );
}
