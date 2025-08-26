"use client";

import React, { useRef, useState, useEffect } from "react";
import { OwnerData, FormErrors } from "@/types/registration";
import { uploadImageToFirebase } from "@/services/firebaseStorageService";
import {
  Camera,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface OwnerFormProps {
  initialData?: Partial<OwnerData>;
  onSubmit: (data: OwnerData) => void;
  onBack?: () => void;
  loading?: boolean;
  errors?: FormErrors;
}

export const OwnerForm: React.FC<OwnerFormProps> = ({
  initialData = {},
  onSubmit,
  onBack,
  loading = false,
  errors = {},
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<OwnerData>({
    fullName: initialData.fullName || "",
    email: initialData.email || "",
    phoneNumber: initialData.phoneNumber || "",
    password: initialData.password || "",
    confirmPassword: "",
    profil: initialData.profil || "",
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Auto-fill email from browser credentials
 useEffect(() => {
  if (!initialData.email) {
    const tryAutofillEmail = async () => {
      try {
        if (navigator.credentials?.get) {
          const cred = await navigator.credentials.get({ mediation: "optional" });
          if (cred?.id.includes("@")) {
            setFormData((prev) => ({ ...prev, email: cred.id }));
            return;
          }
        }

        if ("autocomplete" in document.createElement("input")) {
          const tempInput = document.createElement("input");
          tempInput.type = "email";
          tempInput.autocomplete = "email";
          tempInput.style.position = "absolute";
          tempInput.style.opacity = "0";
          tempInput.style.height = "0";
          tempInput.style.width = "0";
          document.body.appendChild(tempInput);

          setTimeout(() => {
            if (tempInput.value) {
              setFormData((prev) => ({ ...prev, email: tempInput.value }));
            }
            document.body.removeChild(tempInput);
          }, 100);

          tempInput.focus();
        }
      } catch (error) {
        console.log("Autofill error:", error);
      }
    };

    tryAutofillEmail();
  }
}, [initialData.email]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    if (!file.type.match("image.*")) {
      setUploadError("Only images are allowed (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be less than 5MB");
      return;
    }

    setUploadError(null);
    setUploadProgress(0);

    try {
      const nameForFile = `photo_profile_owner_${formData.fullName
        .replace(/\s+/g, "_")
        .toLowerCase()}`;

      const imageUrl = await uploadImageToFirebase(
        file,
        nameForFile,
        "owner_folder"
      );

      setFormData((prev) => ({ ...prev, profil: imageUrl }));
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setUploadProgress(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setUploadError("Passwords do not match");
      return;
    }

    onSubmit(formData);
  };

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleExit = () => {
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      profil: "",
    });
    router.push("/");
  };

  const inputClasses = (fieldName: string) => `
    w-full px-4 py-3 rounded-lg border-2 transition-all
    ${errors[fieldName]
      ? "border-red-300 bg-red-50 focus:border-red-500 dark:bg-red-900/20 dark:border-red-700"
      : "border-gray-200 focus:border-blue-500  dark:border-gray-600   "
    }
    focus:outline-none focus:ring-2 focus:ring-opacity-20 
  `;

  const isPasswordValid = formData.password.length >= 8;
  const doPasswordsMatch = formData.password === formData.confirmPassword;
  const hasPasswordError = formData.password.length > 0 && !isPasswordValid;
  const hasConfirmPasswordError =
    formData.confirmPassword.length > 0 && !doPasswordsMatch;

  return (
    <div className="max-w-2xl mx-auto p-2 sm:p-6 bg-[var(--color-bg-primary)] rounded-xl shadow-lg  transition-colors duration-300 relative">
      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--color-bg-primary)] p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Leave this page?
            </h3>
            <p className="mb-6 ">
              Your changes will not be saved. Are you sure you want to leave?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-600 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleExit}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes, Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => setShowExitModal(true)}
        className="absolute top-4 left-4 flex items-center  hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <ArrowLeft className="mr-1" size={18} />
        <span className="text-sm">Back</span>
      </button>

      {/* Profile Picture at Top Center */}
      <div className="flex flex-col items-center mb-6 mt-8">
        <div
          className="relative group cursor-pointer mb-2"
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          {formData.profil ? (
            <div className="relative">
              <Image
                src={typeof formData.profil === "string" ? formData.profil : URL.createObjectURL(formData.profil)}
                alt="Profile Preview"
                fill
                className="rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-30 rounded-full">
                <Camera className="text-white w-8 h-8" />
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-100 dark:bg-gray-700 group-hover:border-blue-500 transition-colors shadow-md">
              <Camera className="text-gray-400 dark:text-gray-500 w-8 h-8 group-hover:text-blue-500 transition-colors" />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {formData.profil ? "Change photo" : "Add profile photo"}
        </button>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-2 w-full max-w-xs bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        {uploadError && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {uploadError}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold  mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={inputClasses("fullName")}
            placeholder="Enter your full name"
            required
          />
          {errors.fullName && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold  mb-2">
              Email *
            </label>
            <input
              ref={emailInputRef}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClasses("email")}
              placeholder="win2cop@email.com"
              autoComplete="email"
              required
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold  mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={inputClasses("phoneNumber")}
              placeholder="79406751"
              pattern="[0-9]{8}"
              required
            />
            {errors.phoneNumber && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.phoneNumber}
              </p>
            )}
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold  mb-2">
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword.password ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`${inputClasses("password")} ${hasPasswordError ? "pr-10" : ""
                }`}
              placeholder="Minimum 8 characters"
              minLength={8}
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
              {formData.password.length > 0 && (
                <span className="text-gray-500">
                  {isPasswordValid ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </span>
              )}
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 "
                onClick={() => togglePasswordVisibility("password")}
                aria-label={
                  showPassword.password ? "Hide password" : "Show password"
                }
              >
                {showPassword.password ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>
          <div className="mt-1 text-xs ">
            {hasPasswordError && (
              <span className="text-red-500">
                Password must be at least 8 characters
              </span>
            )}
            {isPasswordValid && (
              <span className="text-green-500">Password strength: Good</span>
            )}
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold  mb-2">
            Confirm Password *
          </label>
          <div className="relative">
            <input
              type={showPassword.confirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${inputClasses("confirmPassword")} ${hasConfirmPasswordError ? "pr-10" : ""
                }`}
              placeholder="Confirm your password"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
              {formData.confirmPassword.length > 0 && (
                <span className="text-gray-500">
                  {doPasswordsMatch ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </span>
              )}
              <button
                type="button"
                className=" hover:text-gray-700  "
                onClick={() => togglePasswordVisibility("confirmPassword")}
                aria-label={
                  showPassword.confirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword.confirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>
          {hasConfirmPasswordError && (
            <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
          )}
        </div>

        {/* Form Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              disabled={loading}
            >
              Back
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !isPasswordValid || !doPasswordsMatch}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
