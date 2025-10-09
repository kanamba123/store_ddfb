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
import Logo from "@/components/ui/Logo";

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { redirectUrl, setRedirectUrl } = useRedirectContext();
  const [showPassword, setShowPassword] = useState(false);
  const [fingerprintAvailable, setFingerprintAvailable] = useState(false);

  useEffect(() => {
    if (window.PublicKeyCredential) {
      setFingerprintAvailable(true);
    }
    const is =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    (is);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => (e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (redirectUrl) {
        router.push(redirectUrl);
        setRedirectUrl(null);
      } else {
        router.push("/dashboard/welcome");
      }
    }
  }, [isAuthenticated, redirectUrl, router, setRedirectUrl]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
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
        router.push("/dashboard/welcome");
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
          router.push("/dashboard/welcome");
        }
      }
    });
  };

  const handleFingerprintLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const userId = localStorage.getItem("fingerprintUserId");
      if (!userId) throw new Error(t("errors.noFingerprintUser"));

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
      if (!credential) throw new Error(t("errors.fingerprintFailed"));

      const res = await fetch(`${API_URL}/ownerstores/fingerprint-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || t("errors.fingerprintFailed"));

      document.cookie = `authToken=${data.token}; path=/; max-age=${60 * 60 * 24 * 7
        }; Secure; SameSite=Strict`;
      await login(data.token, data.user);

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        router.push("/dashboard/welcome");
      }
    } catch (err: any) {
      // setErrorMsg(err.message || t('errors.fingerprintFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (


    <div
      className="min-h-screen flex flex-col items-center bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] justify-center px-4 transition-colors duration-300"
    >

      <div className="mb-4">
        <Link href="/">
          <Logo
            textClassName="text-lg  font-extrabold "
            imageClassName="h-10 w-10 rounded-full"
          />

        </Link>
      </div>

      {/* Container du formulaire */}
      <div
        className="w-full max-w-md rounded-xl shadow-md p-6 space-y-6 border border-[var(--color-border)] transition-colors duration-300 bg-[var(--color-bg-secondary)] "
      >
        <h2 className="text-2xl font-bold text-center">{t('LoginPage.title')}</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label
              className={`block text-sm font-medium `}
            >
              {t('LoginPage.email')}
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope
                  className={`h-5 w-5 `}
                />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t('LoginPage.emailPlaceholder')}
                className={`pl-10 w-full px-4 py-2 rounded-lg shadow-sm focus:ring  transition-colors duration-300  border  border-[var(--color-border)]`}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              className={`block text-sm font-medium`}
            >
              {t('LoginPage.password')}
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock
                  className={`h-5 w-5 `}
                />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={`pl-10 w-full px-4 py-2 rounded-lg shadow-sm focus:ring  transition-colors duration-300  border border-[var(--color-border)]`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <FaEyeSlash
                    className={`h-5 w-5 `}
                  />
                ) : (
                  <FaEye
                    className={`h-5 w-5 `}
                  />
                )}
              </button>
            </div>
            <button
              type="button"
              onClick={handleForgotPassword}
              className={`mt-2 text-sm underline flex justify-end w-full text-blue-600 `}
            >
              {t('LoginPage.forgotPassword')}
            </button>
          </div>

          
          {errorMsg && (
            <p className="text-sm text-red-500 text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition ${loading ? "opacity-50 cursor-not-allowed" : ""
              } `}
          >
            {loading ? t('LoginPage.loading') : t('LoginPage.login')}
          </button>
        </form>

        {fingerprintAvailable && (
          <div className="flex justify-center mt-2">
            <button
              onClick={handleFingerprintLogin}
              disabled={loading}
              className={`flex items-center gap-2 text-sm underline `}
            >
              <FaFingerprint className="text-blue-500" />
              {t('LoginPage.fingerprint')}
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="px-4 text-sm text-gray-400">{t('LoginPage.orContinue')}</span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>


        {/* Google */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-[var(--color-border)] font-medium transition `}
          >
            <FaGoogle className="text-red-500" />
            {t('LoginPage.google')}
          </button>
        </div>

        {/* Register */}
        <p
          className={`text-sm text-center `}
        >
          {t('LoginPage.noAccount')}{" "}
          <Link
            href="/register"
            className={`text-blue-500 hover:underline `}
          >
            {t('LoginPage.createAccount')}
          </Link>
        </p>
      </div>
    </div>
  );
}
