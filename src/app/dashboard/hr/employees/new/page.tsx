"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface EmployeeForm {
  name: string;
  email: string;
  role: string;
}

export default function NewEmployeePage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [form, setForm] = useState<EmployeeForm>({
    name: "",
    email: "",
    role: "",
  });

  const [errors, setErrors] = useState<Partial<EmployeeForm>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = (): boolean => {
    const newErrors: Partial<EmployeeForm> = {};
    if (!form.name) newErrors.name = t("employees.errors.name");
    if (!form.email) newErrors.email = t("employees.errors.email");
    if (!form.role) newErrors.role = t("employees.errors.role");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Ici tu peux appeler ton API pour créer un employé
    console.log("Nouvel employé :", form);

    // Redirection vers la liste
    router.push("/dashboard/hr/employees");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{t("employees.addNew")}</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow border">
        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("employees.name")}</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("employees.email")}</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("employees.role")}</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">{t("employees.selectRole")}</option>
            <option value="Vendeur">{t("employees.roleSeller")}</option>
            <option value="Livreur">{t("employees.roleDelivery")}</option>
            <option value="Caissier">{t("employees.roleCashier")}</option>
            <option value="Administrateur">{t("employees.roleAdmin")}</option>
          </select>
          {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {t("employees.save")}
        </button>
      </form>
    </div>
  );
}
