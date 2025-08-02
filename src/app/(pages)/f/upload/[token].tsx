// pages/upload/[token].tsx

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'

interface VariantFormData {
  variantProductName: string
  description?: string
  sellingPrice: number
  stock: number
  productId: number
}

export default function UploadVariantForm() {
  const router = useRouter()
  const { token } = router.query

  const [isValidToken, setIsValidToken] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { register, handleSubmit, reset } = useForm<VariantFormData>()

  // Token validation on load
  useEffect(() => {
    if (!token || typeof token !== 'string') return

    const validateToken = async () => {
      try {
        const res = await axios.get(`/api/public-upload/validate/${token}`)
        if (res.data?.valid) {
          setIsValidToken(true)
        } else {
          setError('⛔ Token invalide ou expiré.')
        }
      } catch (err) {
        console.error(err)
        setError('⛔ Token invalide ou expiré.')
      } finally {
        setLoading(false)
      }
    }

    validateToken()
  }, [token])

  // Submit handler
  const onSubmit = async (data: VariantFormData) => {
    if (!token || typeof token !== 'string') return

    try {
      await axios.post(`/api/public-upload/${token}`, data)
      setIsSubmitted(true)
      reset()
    } catch (err) {
      console.error(err)
      setError("Échec de l'envoi. Vérifiez les champs.")
    }
  }

  // UI rendering
  if (loading) return <p className="text-center mt-10">⏳ Validation du lien...</p>
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>
  if (isSubmitted) return <p className="text-green-600 text-center mt-10">✅ Variante ajoutée avec succès !</p>

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">📦 Ajouter une Variante de Produit</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          placeholder="Nom de la variante"
          {...register("variantProductName", { required: true })}
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Description (optionnel)"
          {...register("description")}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          step="0.01"
          placeholder="Prix de vente"
          {...register("sellingPrice", { required: true })}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Stock disponible"
          {...register("stock", { required: true })}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="ID du produit principal"
          {...register("productId", { required: true })}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          🚀 Soumettre la variante
        </button>
      </form>
    </div>
  )
}
