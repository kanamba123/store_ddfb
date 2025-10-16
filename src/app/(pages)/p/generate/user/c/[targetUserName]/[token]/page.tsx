"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/config/API";
import {
  FaEnvelope,
  FaLock,
  FaUserTie,
  FaIdBadge,
  FaPhone,
  FaEye,
  FaEyeSlash,
  FaSpinner,
} from "react-icons/fa";
import Logo from "@/components/ui/Logo";

export default function CreateUserForEmployeePage() {
  const { token, targetUserName } = useParams<{ token: string; targetUserName: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [employee, setEmployee] = useState<any>(null);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);

  /** ✅ Validation du token et récupération de l’employé */
  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/public-upload/validateCreateUser/${targetUserName}/${token}`
        );
        if (res.data?.valid && res.data.employee) {
          setEmployee(res.data.employee);
        } else {
          setError(res.data?.error || "⛔ Lien invalide ou expiré.");
        }
      } catch (err: any) {
        setError(err.response?.data?.error || "⛔ Erreur lors de la validation du lien.");
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token, targetUserName]);

  /** 📩 Soumission du formulaire */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/employees/${employee.id}/createUserByHimSelf`, {
        token,
        targetUserName,
        email: form.email,
        password: form.password,
        employeeId: employee.id
      });

      if (res.data.success) {
        setSubmitted(true);
      } else {
        // setError(res.data.error || "Erreur lors de la création du compte.");
      }
    } catch (err: any) {
      // setError(err.response?.data?.error || "Erreur lors de la création du compte.");
    } finally {
      setSubmitting(false);
    }
  };

  /** 🌀 Loader visuel */
  const Loader = ({ text = "Chargement..." }: { text?: string }) => (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-600 dark:text-gray-300">
      <Logo textClassName="text-lg font-extrabold mb-6" imageClassName="h-12 w-12 rounded-full" />
      <div className="flex flex-col items-center gap-4">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
        <p className="text-center text-sm font-medium animate-pulse">{text}</p>
      </div>
    </div>
  );

  /** 🕓 États de chargement, d’erreur et de succès */
  if (loading) return <Loader text="Vérification du lien en cours..." />;

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <Logo textClassName="text-lg font-extrabold mb-4" imageClassName="h-10 w-10 rounded-full" />
        <div className="max-w-md w-full p-4 bg-red-100 text-red-700 border border-red-300 rounded text-center">
          {error}
        </div>
      </div>
    );

  if (submitted)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <Logo textClassName="text-lg font-extrabold mb-4" imageClassName="h-10 w-10 rounded-full" />
        <div className="max-w-md w-full p-4 bg-green-100 text-green-700 border border-green-300 rounded text-center">
          ✅ Votre compte a été créé avec succès ! Vous pouvez maintenant vous connecter à la
          plateforme.
        </div>
      </div>
    );

  /** 🧑‍💼 Page principale */
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-4 transition-colors duration-300">
      {/* Logo */}
      <div className="mb-6">
        <Logo textClassName="text-lg font-extrabold" imageClassName="h-10 w-10 rounded-full" />
      </div>

      {/* Carte principale */}
      <div className="w-full max-w-md bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl shadow-md p-6 space-y-6 transition-colors duration-300">
        {/* Salutation */}
        {employee && (
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
              <FaUserTie className="text-blue-600" />
              Bonjour {employee.firstName} {employee.lastName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Vous êtes <span className="font-medium">{employee.position}</span> au
              département <span className="font-medium">{employee.department}</span>.
            </p>
            <p className="text-sm text-gray-500">
              Créez vos identifiants pour accéder à la plateforme.
            </p>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Adresse e-mail"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          {/* Mot de passe */}
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full pl-10 pr-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-3 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirmation */}
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          {/* Erreur éventuelle */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Bouton */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg transition font-medium ${submitting ? "opacity-75 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
          >
            {submitting && <FaSpinner className="animate-spin" />}
            {submitting ? "Création du compte..." : "Enregistrer mes identifiants"}
          </button>
        </form>

        {/* Infos employé */}
        {employee && (
          <div className="mt-6 text-xs text-gray-500 text-center space-y-1 border-t pt-4">
            <p className="flex items-center justify-center gap-2">
              <FaIdBadge /> Code employé : {employee.employeeCode || "—"}
            </p>
            <p className="flex items-center justify-center gap-2">
              <FaPhone /> Téléphone : {employee.employeeContactPhone || "—"}
            </p>
            <p>
              Statut :{" "}
              <span
                className={`font-semibold ${employee.employeeStatus === "active" ? "text-green-600" : "text-red-600"
                  }`}
              >
                {employee.employeeStatus}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
