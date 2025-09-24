"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useCreateEmployee } from "@/hooks/apis/useEmployee";
import { useTranslation } from "react-i18next";

type EmployeeForm = {
  firstName: string;
  lastName: string;
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
  const router = useRouter();
  const createEmployee = useCreateEmployee();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeForm>();

  const onSubmit = async (data: EmployeeForm) => {
    try {
      if (data.baseSalary) {
        data.baseSalary = Number(data.baseSalary);
      }
      await createEmployee.mutateAsync(data);
      router.push("/dashboard/hr/employees");
    } catch (err) {
      console.error(t("employees.errorSubmit"), err);
    }
  };

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
              <label>{t("employees.gender")}</label>
              <select {...register("gender")} className="w-full p-2 border border-[var(--color-border)] rounded bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
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
              <select {...register("nationality")} className="w-full p-2 border border-[var(--color-border)] rounded bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
                <option value="">{t("employees.selectNationality")}</option>
                <option value="Burundian">Burundian</option>
                <option value="Congolese">Congolese</option>
                <option value="Rwandese">Rwandese</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section Contrat & Poste */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">{t("employees.contract")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>{t("employees.contractType")}</label>
              <select {...register("contractType")} className="w-full p-2 border border-[var(--color-border)] rounded bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
                <option value="">{t("employees.selectContract")}</option>
                <option value="CDD">CDD</option>
                <option value="CDI">CDI</option>
                <option value="Internship">Internship</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label>{t("employees.department")}</label>
              <select {...register("department")} className="w-full p-2 border border-[var(--color-border)] rounded bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
                <option value="">{t("employees.selectDepartment")}</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Sales">Sales</option>
                <option value="IT">IT</option>
              </select>
            </div>
            <div>
              <label>{t("employees.position")}</label>
              <select {...register("position")} className="w-full p-2 border border-[var(--color-border)] rounded bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
                <option value="">{t("employees.selectPosition")}</option>
                <option value="Manager">Manager</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Staff">Staff</option>
                <option value="Intern">Intern</option>
              </select>
            </div>
            <div>
              <label>{t("employees.baseSalary")}</label>
              <input {...register("baseSalary")} type="number" className="w-full p-2 border border-[var(--color-border)] rounded" />
            </div>
          </div>
        </section>

        {/* Section Infos Familiales */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">{t("employees.family")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>{t("employees.maritalStatus")}</label>
              <select {...register("maritalStatus")} className="w-full p-2 border border-[var(--color-border)] rounded bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
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
              <select
                {...register("bankName")}
                className="w-full p-2 border border-[var(--color-border)] rounded bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
              >
                <option value="">{t("employees.selectBank")}</option>

                {/* 🏦 Banques */}
                <option value="BANCOBU">BANCOBU</option>
                <option value="BCB">Banque de Crédit de Bujumbura (BCB)</option>
                <option value="INTERBANK">Interbank Burundi</option>
                <option value="BBCI">Banque Burundaise pour le Commerce et l’Investissement (BBCI)</option>
                <option value="BGF">Banque de Gestion et de Financement (BGF)</option>
                <option value="FINBANK">FINBANK Burundi</option>
                <option value="DTB">Diamond Trust Bank (DTB Burundi)</option>
                <option value="KCB">KCB Bank Burundi</option>
                <option value="CRDB">CRDB Bank Burundi</option>

                {/* 📱 Mobile Money */}
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
