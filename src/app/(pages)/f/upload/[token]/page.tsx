"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import axios from "axios"

interface VariantFormData {
  variantProductName: string
  description?: string
  sellingPrice: number
  stock: number
  productId: number
}

export default function UploadVariantForm() {
  const { token } = useParams()
  const [isValidToken, setIsValidToken] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, reset } = useForm<VariantFormData>()

  useEffect(() => {
    if (!token || typeof token !== "string") return

    const validate = async () => {
      try {
        const res = await axios.get(`/api/public-upload/validate/${token}`)
        if (res.data?.valid) {
          setIsValidToken(true)
        } else {
          setError("⛔ Lien invalide ou expiré.")
        }
      } catch (err) {
        console.error(err)
        setError("⛔ Lien invalide ou expiré.")
      } finally {
        setLoading(false)
      }
    }

    validate()
  }, [token])

  const onSubmit = async (data: VariantFormData) => {
    try {
      await axios.post(`/api/public-upload/${token}`, data)
      setSubmitted(true)
      reset()
    } catch (err) {
      console.error(err)
      setError("Échec de l'envoi. Vérifiez les champs.")
    }
  }

  if (loading) return <p className="text-center mt-10">⏳ Vérification du lien...</p>
  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>
  if (submitted) return <p className="text-green-600 text-center mt-10">✅ Variante soumise avec succès !</p>

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Ajouter une Variante de Produit</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          {...register("variantProductName", { required: true })}
          placeholder="Nom de la variante"
          className="w-full border p-2 rounded"
        />
        <textarea
          {...register("description")}
          placeholder="Description (optionnel)"
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          step="0.01"
          {...register("sellingPrice", { required: true })}
          placeholder="Prix de vente"
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          {...register("stock", { required: true })}
          placeholder="Stock"
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          {...register("productId", { required: true })}
          placeholder="ID du produit principal"
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Soumettre
        </button>
      </form>
    </div>
  )
}
