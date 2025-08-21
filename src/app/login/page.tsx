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
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { t } = useTranslation();
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
    if (window.PublicKeyCredential) {
      setFingerprintAvailable(true);
    }
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
      setErrorMsg(t("errors.mustAcceptTerms"));
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
      if (!res.ok) throw new Error(data.message || t("errors.loginFailed"));

      document.cookie = `authToken=${data.token}; path=/; max-age=${60 * 60 * 24 * 7
        }; Secure; SameSite=Strict`;
      await login(data.token, data.user);
      localStorage.setItem("fingerprintUserId", data.user.id);

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.message || t("errors.loginFailed"));
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
      if (!popup || popup.closed) clearInterval(checkPopup);
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
    if (!userId) throw new Error(t("LoginPage.errors.noFingerprintUser"));

    // Récupérer les passkeys enregistrées pour cet utilisateur
    const { credentials } = await fetch(`${API_URL}/security/get-webauthn-credentials/${userId}`).then(r => r.json());
    if (!credentials || credentials.length === 0) throw new Error(t("LoginPage.errors.noFingerprintUser"));

    const allowCredentials = credentials.map((c: any) => ({
      id: new Uint8Array(c.rawId), // Array -> Uint8Array
      type: "public-key" as const,
      transports: ["internal"] as const,
    }));

    // Challenge aléatoire
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    // ⚠️ Cast en PublicKeyCredential
    const assertion = (await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials,
        userVerification: "required",
        timeout: 60000,
      },
    })) as PublicKeyCredential | null;

    if (!assertion) throw new Error(t("LoginPage.errors.fingerprintFailed"));

    // Convertir assertion pour le backend
    const credential = {
      id: assertion.id,
      rawId: Array.from(new Uint8Array(assertion.rawId)),
      type: assertion.type,
      response: {
        authenticatorData: Array.from(new Uint8Array((assertion.response as AuthenticatorAssertionResponse).authenticatorData)),
        clientDataJSON: Array.from(new Uint8Array((assertion.response as AuthenticatorAssertionResponse).clientDataJSON)),
        signature: Array.from(new Uint8Array((assertion.response as AuthenticatorAssertionResponse).signature)),
        userHandle: (assertion.response as AuthenticatorAssertionResponse).userHandle
          ? Array.from(new Uint8Array((assertion.response as AuthenticatorAssertionResponse).userHandle!))
          : null,
      }
    };

    // Envoyer au backend pour vérification
    const res = await fetch(`${API_URL}/ownerstores/fingerprint-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, credential }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || t("LoginPage.errors.fingerprintFailed"));

    document.cookie = `authToken=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; Secure; SameSite=Strict`;
    await login(data.token, data.user);

    if (redirectUrl) window.location.href = redirectUrl;
    else router.push("/dashboard");

  } catch (err: any) {
    setErrorMsg(err.message || t("LoginPage.errors.fingerprintFailed"));
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
        <h2 className="text-2xl font-bold text-center">{t('LoginPage.title')}</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label
              className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              {t('LoginPage.email')}
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
                placeholder={t('LoginPage.emailPlaceholder')}
                className={`pl-10 w-full px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 transition-colors duration-300 ${darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                  : "border-gray-300 focus:border-blue-400"
                  } border`}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              {t('LoginPage.password')}
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
                placeholder="••••••••"
                className={`pl-10 w-full px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-200 transition-colors duration-300 ${darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:border-blue-400"
                  : "border-gray-300 focus:border-blue-400"
                  } border`}
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
              className={`mt-2 text-sm underline ${darkMode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-800"
                }`}
            >
              {t('LoginPage.forgotPassword')}
            </button>
          </div>

          {/* Terms */}
          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className={`focus:ring-blue-500 h-4 w-4 rounded ${darkMode ? "bg-gray-700 border-gray-600" : "border-gray-300"
                }`}
            />
            <label
              htmlFor="terms"
              className={`ml-3 text-sm font-light ${darkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              {t('LoginPage.accept')}{" "}
              <Link
                href="/terms-of-service"
                className={`underline ${darkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-800"
                  }`}
              >
                {t("terms")}
              </Link>{" "}
              {t('LoginPage.and')}{" "}
              <Link
                href="/privacy-policy"
                className={`underline ${darkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-800"
                  }`}
              >
                {t('.LoginPage.privacy')}
              </Link>
            </label>
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
            {loading ? t('LoginPage.loading') : t('LoginPage.login')}
          </button>
        </form>

        {fingerprintAvailable && (
          <div className="flex justify-center mt-2">
            <button
              onClick={handleFingerprintLogin}
              disabled={loading}
              className={`flex items-center gap-2 text-sm underline ${darkMode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-800"
                }`}
            >
              <FaFingerprint className="text-blue-500" />
              {t('LoginPage.fingerprint')}
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div
              className={`w-full border-t ${darkMode ? "border-gray-700" : "border-gray-300"
                }`}
            ></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span
              className={`px-2 ${darkMode
                ? "bg-gray-800 text-gray-400"
                : "bg-white text-gray-500"
                }`}
            >
              {t('LoginPage.orContinue')}
            </span>
          </div>
        </div>

        {/* Google */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border font-medium transition ${darkMode
              ? "bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
              : "bg-white border-gray-300 hover:bg-gray-50 text-gray-700"
              }`}
          >
            <FaGoogle className="text-red-500" />
            {t('LoginPage.google')}
          </button>
        </div>

        {/* Register */}
        <p
          className={`text-sm text-center ${darkMode ? "text-gray-400" : "text-gray-600"
            }`}
        >
          {t('LoginPage.noAccount')}{" "}
          <Link
            href="/register"
            className={`text-blue-500 hover:underline ${darkMode ? "hover:text-blue-400" : ""
              }`}
          >
            {t('LoginPage.createAccount')}
          </Link>
        </p>
      </div>
    </div>
  );
}
