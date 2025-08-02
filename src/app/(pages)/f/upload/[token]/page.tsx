"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useForm, useFieldArray, WatchObserver } from "react-hook-form"
import axios from "axios"
import { API_URL } from "@/config/API"

interface Specification {
  key: string
  value: string
}

interface VariantFormData {
  variantProductName: string
  variantType?: string
  description?: string
  purchasePrice?: number
  recommendedPrice?: number
  sellingPrice: number
  stock: number
  lowStockThreshold?: number
  productId: number
  status?: string
  tags?: string
  userGuideURL?: string
  adminNote?: string
  isPromotion?: boolean
  isFeatured?: boolean
  isPopular?: boolean
  isNewArrival?: boolean
  visibilityStart?: string
  visibilityEnd?: string
  specifications: Specification[]
  images: FileList
}

export default function UploadVariantForm() {
  const { token } = useParams()
  const [isValidToken, setIsValidToken] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm<VariantFormData>({
    defaultValues: { specifications: [{ key: "", value: "" }] }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specifications"
  })

  const watchFields = watch([
    "variantProductName",
    "variantType",
    "sellingPrice",
    "recommendedPrice",
    "stock",
    "productId",
    "isPromotion",
    "isFeatured",
    "isPopular",
    "isNewArrival"
  ])

  useEffect(() => {
    if (!token || typeof token !== "string") return

    const validate = async () => {
      try {
        const res = await axios.get(`${API_URL}/public-upload/validate/${token}`)
        setIsValidToken(res.data?.valid)
        if (!res.data?.valid) setError("⛔ Lien invalide ou expiré.")
      } catch {
        setError("⛔ Lien invalide ou expiré.")
      } finally {
        setLoading(false)
      }
    }

    validate()
  }, [token])

  const onSubmit = async (data: VariantFormData) => {
    try {
      const formData = new FormData()

      Object.entries(data).forEach(([key, value]) => {
        if (key === "images" && value instanceof FileList) {
          Array.from(value).forEach(file => formData.append("images", file))
        } else if (key === "specifications") {
          formData.append("specifications", JSON.stringify(value))
        } else {
          formData.append(key, value as any)
        }
      })

      await axios.post(`${API_URL}/public-upload/${token}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      setSubmitted(true)
      reset()
    } catch (err) {
      console.error(err)
      setError("❌ Échec de l'envoi. Vérifiez les champs.")
    }
  }

  if (loading) return <p className="text-center mt-10 text-gray-600 dark:text-gray-300">⏳ Vérification du lien...</p>
  if (error) return <p className="text-red-600 dark:text-red-400 text-center mt-10">{error}</p>
  if (submitted) return <p className="text-green-600 dark:text-green-400 text-center mt-10">✅ Variante soumise avec succès !</p>

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-10 bg-white dark:bg-gray-900 shadow-md dark:shadow-lg rounded-lg text-gray-800 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-center">🛍️ Ajouter une Variante de Produit</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Grid Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Nom de la variante *</label>
            <input {...register("variantProductName", { required: true })} className={inputClass} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Type de variante</label>
            <input {...register("variantType")} className={inputClass} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Prix de vente (€) *</label>
            <input type="number" step="0.01" {...register("sellingPrice", { required: true })} className={inputClass} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Prix conseillé</label>
            <input type="number" step="0.01" {...register("recommendedPrice")} className={inputClass} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Prix d'achat</label>
            <input type="number" step="0.01" {...register("purchasePrice")} className={inputClass} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Stock *</label>
            <input type="number" {...register("stock", { required: true })} className={inputClass} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Seuil de stock bas</label>
            <input type="number" {...register("lowStockThreshold")} className={inputClass} />
          </div>
          <div>
            <label className="block mb-1 font-medium">ID du produit principal *</label>
            <input type="number" {...register("productId", { required: true })} className={inputClass} />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea {...register("description")} className={inputClass} />
        </div>

        {/* Specifications */}
        <div>
          <label className="block mb-1 font-medium">Spécifications</label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col sm:flex-row gap-2 mb-2">
              <input {...register(`specifications.${index}.key`)} placeholder="Clé" className={`${inputClass} flex-1`} />
              <input {...register(`specifications.${index}.value`)} placeholder="Valeur" className={`${inputClass} flex-1`} />
              <button type="button" onClick={() => remove(index)} className="text-red-500 text-sm self-center sm:self-auto">Supprimer</button>
            </div>
          ))}
          <button type="button" onClick={() => append({ key: "", value: "" })} className="text-blue-500 mt-1">
            ➕ Ajouter une spécification
          </button>
        </div>

        {/* Images */}
        <div>
          <label className="block mb-1 font-medium">Images</label>
          <input type="file" {...register("images")} multiple accept="image/*" className={inputClass} />
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <label><input type="checkbox" {...register("isPromotion")} /> Promotion</label>
          <label><input type="checkbox" {...register("isFeatured")} /> En vedette</label>
          <label><input type="checkbox" {...register("isPopular")} /> Populaire</label>
          <label><input type="checkbox" {...register("isNewArrival")} /> Nouveauté</label>
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 font-medium">Statut</label>
          <select {...register("status")} className={inputClass}>
            <option value="">-- Choisir --</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="archived">Archivé</option>
          </select>
        </div>

        {/* Visibility */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Date de début de visibilité</label>
            <input type="datetime-local" {...register("visibilityStart")} className={inputClass} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Date de fin de visibilité</label>
            <input type="datetime-local" {...register("visibilityEnd")} className={inputClass} />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-1 font-medium">Tags (séparés par des virgules)</label>
          <input {...register("tags")} className={inputClass} placeholder="été,promotion,homme" />
        </div>

        {/* Guide URL */}
        <div>
          <label className="block mb-1 font-medium">Lien guide utilisateur</label>
          <input {...register("userGuideURL")} className={inputClass} placeholder="https://..." />
        </div>

        {/* Admin Note */}
        <div>
          <label className="block mb-1 font-medium">Note interne</label>
          <textarea {...register("adminNote")} className={inputClass} placeholder="Visible par l'admin uniquement" />
        </div>

        {/* 📝 Summary Block */}
        <div className="p-4 border dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300">
          <h2 className="font-semibold mb-2">🧾 Résumé :</h2>
          <p><strong>Nom:</strong> {watchFields[0]}</p>
          <p><strong>Type:</strong> {watchFields[1] || "—"}</p>
          <p><strong>Prix (€):</strong> {watchFields[2] || "—"}</p>
          <p><strong>Prix conseillé (€):</strong> {watchFields[3] || "—"}</p>
          <p><strong>Stock:</strong> {watchFields[4] || "—"}</p>
          <p><strong>Produit ID:</strong> {watchFields[5] || "—"}</p>
          <p><strong>Flags:</strong> {["isPromotion", "isFeatured", "isPopular", "isNewArrival"].map((f, i) => watchFields[6 + i] ? `✅ ${f}` : "").filter(Boolean).join(", ") || "Aucun"}</p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors duration-200"
        >
          ✅ Soumettre la Variante
        </button>
      </form>
    </div>
  )
}

const inputClass = "w-full border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-800"
