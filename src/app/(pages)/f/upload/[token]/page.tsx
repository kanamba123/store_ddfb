"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import axios from "axios"
import { API_URL } from "@/config/API"
import { fetchProductCategories } from "@/libs/api/products"

interface Specification {
  key: string
  value: string
}

interface Product {
  id: number
  productName: string
}

interface VariantFormData {
  variantProductName: string
  variantType?: string
  description?: string
  productId: number
  purchasePrice?: number
  images: FileList
  specifications: Specification[]
}

export default function UploadVariantForm() {
  const { token } = useParams()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<Product[]>([]);
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const { register, control, handleSubmit, reset } = useForm<VariantFormData>({
    defaultValues: { specifications: [{ key: "", value: "" }] }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specifications"
  })



  useEffect(() => {
    if (!token || typeof token !== "string") return

    const validate = async () => {
      try {
        const res = await axios.get(`${API_URL}/public-upload/validate/${token}`)
        if (!res.data?.valid) {
          setError("⛔ Lien invalide ou expiré.")
        }
      } catch {
        setError("⛔ Lien invalide ou expiré.")
      } finally {
        setLoading(false)
      }
    }



    validate()
  }, [token])

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const dataProduct = await fetchProductCategories();
        setData(dataProduct)
      } catch (error) {

      }
    }
    loadProduct()

  }, [])


  const onSubmit = async (data: VariantFormData) => {
    try {
      const formData = new FormData()

      Object.entries(data).forEach(([key, value]) => {
        if (key === "images" && value instanceof FileList) {
          Array.from(value).forEach(file => formData.append("images", file))
        } else if (key === "specifications") {
          formData.append("specifications", JSON.stringify(value))
        } else if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ) {
          formData.append(key, String(value))
        }
      })

      await axios.post(`${API_URL}/public-upload/${token}`, data)

      setSubmitted(true)
      reset()
    } catch (err) {
      console.error(err)
      setError("❌ Échec de l'envoi. Vérifiez les champs.")
    }
  }

  if (loading) return <p className="text-center mt-10 text-gray-600 dark:text-gray-300">⏳ Vérification du lien...</p>


  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 mt-10 bg-white dark:bg-gray-900 shadow-md dark:shadow-lg rounded-lg text-gray-800 dark:text-gray-100">

      {error ?? <p className="text-red-600 dark:text-red-400 text-center mt-10">{error}</p>}
      {submitted ?? <p className="text-green-600 dark:text-green-400 text-center mt-10">✅ Variante soumise avec succès !</p>}
      <h1 className="text-2xl font-bold mb-6 text-center">🛍️ Ajouter une Variante de Produit</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Nom de la variante *" {...register("variantProductName", { required: true })} />

          <div>
            <label className="block mb-1 font-medium">Type de variante</label>
            <select {...register("variantType")} className={inputClass}>
              <option value="">-- Choisir --</option>
              <option value="product">Product</option>
              <option value="accessory">Accessory</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea {...register("description")} className={inputClass} />
          </div>

          <div>
            <label className="block mb-1 font-medium">Categorie du produit *</label>
            <select
              {...register("productId", { required: true })}
              className={inputClass}
              required
            >
              <option value="" >Sélectionnez --</option>
              {data.map((product: Product) => (
                <option key={product.id} value={product.id} >
                  {product.productName}
                  
                </option>
              ))}
            </select>
          </div>

          <Input label="Prix d&apos;achat" type="number" {...register("purchasePrice")} />

        </div>


        <div>
          <label className="block mb-1 font-medium">Spécifications</label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col sm:flex-row gap-2 mb-2">
              <input {...register(`specifications.${index}.key`)} placeholder="Clé" className={inputClass} />
              <input {...register(`specifications.${index}.value`)} placeholder="Valeur" className={inputClass} />
              <button type="button" onClick={() => remove(index)} className="text-red-500 text-sm self-center">Supprimer</button>
            </div>
          ))}
          <button type="button" onClick={() => append({ key: "", value: "" })} className="text-blue-500 mt-2">➕ Ajouter une spécification</button>
        </div>

        <div>
          <label className="block mb-1 font-medium">Images</label>
          <input type="file" {...register("images")} multiple accept="image/*" className={inputClass} />
        </div>

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

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

const Input = ({ label, ...props }: InputProps) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <input {...props} className={inputClass} />
  </div>
)
