"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRedirectContext } from "@/contexts/RedirectProvider";
import { API_URL } from "@/config/API";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { redirectUrl, setRedirectUrl } = useRedirectContext();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for user's preferred color scheme
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(isDarkMode);

    // Listen for changes in color scheme preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (redirectUrl) {
        router.push(redirectUrl);
        setRedirectUrl(null);
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, redirectUrl, router, setRedirectUrl]);

 // Dans votre page de login
const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setErrorMsg("");

  try {
    const res = await fetch(`${API_URL}/ownerstores/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Erreur lors de la connexion.");
    }

    // Set cookie en plus du localStorage
    document.cookie = `authToken=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; Secure; SameSite=Strict`;
    
    await login(data.token, data.user);

    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      router.push("/dashboard");
    }
  } catch (err: any) {
    setErrorMsg(err.message || "Échec de la connexion.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-xl shadow-md p-6 space-y-6 transition-colors duration-300 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border`}
      >
        <h2 className="text-2xl font-bold text-center">Connexion</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`mt-1 w-full px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 transition-colors duration-300 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                  : "border-gray-300 focus:border-blue-400"
              } border`}
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`mt-1 w-full px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 transition-colors duration-300 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                  : "border-gray-300 focus:border-blue-400"
              } border`}
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-500 text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            } ${darkMode ? "hover:bg-blue-500" : ""}`}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p
          className={`text-sm text-center ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className={`text-blue-500 hover:underline ${
              darkMode ? "hover:text-blue-400" : ""
            }`}
          >
            Créer un compte
          </Link>
        </p>

        <div
          className={`text-xs text-center pt-2 ${
            darkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          <p>Démo : admin@example.com / 123456</p>
        </div>
      </div>
    </div>
  );
}
