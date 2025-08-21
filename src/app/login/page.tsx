"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRedirectContext } from "@/contexts/RedirectProvider";
import { API_URL } from "@/config/API";
import { useAuth } from "@/contexts/AuthContext";
import {
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaFingerprint,
} from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { redirectUrl, setRedirectUrl } = useRedirectContext();
  const [darkMode, setDarkMode] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fingerprintAvailable, setFingerprintAvailable] = useState(false);

  useEffect(() => {
    // Vérifier si WebAuthn est dispo
    if (window.PublicKeyCredential) {
      setFingerprintAvailable(true);
    }

    // Thème sombre clair
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(isDarkMode);

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

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!acceptedTerms) {
      setErrorMsg(
        "Vous devez accepter les conditions d'utilisation pour vous connecter."
      );
      return;
    }

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

      // Set cookie
      document.cookie = `authToken=${data.token}; path=/; max-age=${60 * 60 * 24 * 7
        }; Secure; SameSite=Strict`;

      await login(data.token, data.user);

      // Sauvegarder un identifiant pour WebAuthn
      localStorage.setItem("fingerprintUserId", data.user.id);

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

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      "https://api.win2cop.com/api/auth/google",
      "googleAuth",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const checkPopup = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(checkPopup);
      }
    }, 1000);

    window.addEventListener("message", (event) => {
      if (event.origin !== "https://api.win2cop.com") return;

      if (event.data.token) {
        popup?.close();
        document.cookie = `authToken=${event.data.token}; path=/; max-age=${60 * 60 * 24 * 7
          }; Secure; SameSite=Strict`;
        login(event.data.token, event.data.user);

        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          router.push("/dashboard");
        }
      }
    });
  };

  const handleFingerprintLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const userId = localStorage.getItem("fingerprintUserId");
      if (!userId) {
        throw new Error(
          "Aucun utilisateur enregistré pour l'authentification biométrique."
        );
      }

      // Simuler challenge WebAuthn
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: "required",
          allowCredentials: [],
        },
      });

      if (!credential) {
        throw new Error("Échec de l'authentification par empreinte.");
      }

      // Ici tu dois envoyer credential.id et authenticatorData au backend
      // Pour cette démo on suppose que tout est bon
      const res = await fetch(`${API_URL}/ownerstores/fingerprint-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Échec de la connexion biométrique.");
      }

      document.cookie = `authToken=${data.token}; path=/; max-age=${60 * 60 * 24 * 7
        }; Secure; SameSite=Strict`;
      await login(data.token, data.user);

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Erreur d'authentification biométrique.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"
        }`}
    >
      <div
        className={`w-full max-w-md rounded-xl shadow-md p-6 space-y-6 transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          } border`}
      >
        <h2 className="text-2xl font-bold text-center">Connexion</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Email
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope
                  className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`pl-10 w-full px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 transition-colors duration-300 ${darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                  : "border-gray-300 focus:border-blue-400"
                  } border`}
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Mot de passe
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock
                  className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`pl-10 w-full px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 transition-colors duration-300 ${darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                  : "border-gray-300 focus:border-blue-400"
                  } border`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <FaEyeSlash
                    className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                  />
                ) : (
                  <FaEye
                    className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                  />
                )}
              </button>
            </div>
            <button
              type="button"
              onClick={handleForgotPassword}
              className={`mt-2 text-sm ${darkMode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-800"
                } underline`}
            >
              Mot de passe oublié ?
            </button>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className={`focus:ring-blue-500 h-4 w-4 rounded ${darkMode ? "bg-gray-700 border-gray-600" : "border-gray-300"
                  }`}
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="terms"
                className={`font-light ${darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
              >
                J'accepte les{" "}
                <Link
                  href="/terms-of-service"
                  className={`underline ${darkMode
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-800"
                    }`}
                >
                  Conditions Générales
                </Link>{" "}
                et la{" "}
                <Link
                  href="/privacy-policy"
                  className={`underline ${darkMode
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-800"
                    }`}
                >
                  Politique de Confidentialité
                </Link>
              </label>
            </div>
          </div>

          {errorMsg && (
            <p className="text-sm text-red-500 text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading || !acceptedTerms}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition ${loading || !acceptedTerms ? "opacity-50 cursor-not-allowed" : ""
              } ${darkMode ? "hover:bg-blue-500" : ""}`}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {fingerprintAvailable && (
          <div className="flex justify-center mt-2">
            <button
              onClick={handleFingerprintLogin}
              disabled={loading}
              className={`flex items-center gap-2 text-sm underline transition ${darkMode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-800"
                }`}
            >
              <FaFingerprint className="text-blue-500" />
              Utiliser l'empreinte digitale
            </button>
          </div>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div
              className={`w-full border-t ${darkMode ? "border-gray-700" : "border-gray-300"
                }`}
            ></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span
              className={`px-2 ${darkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"
                }`}
            >
              Ou continuer avec
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border font-medium transition ${darkMode
              ? "bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
              : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
              }`}
          >
            <FaGoogle className="text-red-500" />
            Se connecter avec Google
          </button>
        </div>

        <p
          className={`text-sm text-center ${darkMode ? "text-gray-400" : "text-gray-600"
            }`}
        >
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className={`text-blue-500 hover:underline ${darkMode ? "hover:text-blue-400" : ""
              }`}
          >
            Créer un compte
          </Link>
        </p>

      </div>
    </div>
  );
}
