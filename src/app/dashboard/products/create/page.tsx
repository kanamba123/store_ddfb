"use client"

import { useEffect, useState, useCallback } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { fetchProductCategories } from "@/libs/api/products"
import { useCreateVariantProduct } from "@/hooks/apis/useVariants"
import ImageUploader from "@/components/ui/ImageUploader"
import { useStores } from "@/hooks/apis/useStores"

interface Specification {
  key: string
  value: string
}

interface Product {
  id: number
  productName: string
}

interface Store {
  id: number
  storeName: string
}

type VariantType = 'product' | 'accessory' | ''

interface VariantFormData {
  variantProductName: string
  variantType?: VariantType
  description?: string
  productId: number | ''
  storeId: number | '',
  purchasePrice?: number | string
  images: FileList | null
  specifications: Specification[]
  bulkInput?: string
}



export default function UploadVariantForm() {
  const { data: store = [] } = useStores();
  const useMutation = useCreateVariantProduct();
  const [submitting, setSubmitting] = useState(false)
  const [data, setData] = useState<Product[]>([])
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [previews, setPreviews] = useState<string[]>([])

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm<VariantFormData>({
    defaultValues: {
      specifications: [{ key: "", value: "" }],
      productId: '',
      storeId: '',
      variantType: '',
      images: null,
      bulkInput: ''
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specifications"
  })

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const dataProduct = await fetchProductCategories()
        setData(dataProduct)
      } catch (error) {
        console.error("Failed to load products", error)
      }
    }
    loadProduct()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const urls = files.map(file => URL.createObjectURL(file))
      setPreviews(urls)
    }
  }


  const onSubmit = async (data: VariantFormData) => {
    setSubmitting(true)

    const formData = new FormData()

    const payload = {
      ...data,
      purchasePrice: data.purchasePrice ? Number(data.purchasePrice) : undefined,
      productId: Number(data.productId),
      variantType: data.variantType || undefined
    }

    Object.entries(payload).forEach(([key, value]) => {
      if (key === "images" && value) {
        Array.from(value as FileList).forEach(file =>
          formData.append("images", file)
        )
      } else if (key === "specifications") {
        formData.append(key, JSON.stringify(value))
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })

    useMutation.mutate(payload, {
      onSuccess: () => {
        setSubmitted(true)
        reset()
      },
      onError: (error) => {
        console.error(error)
        setSubmitting(false)
        setError("❌ Échec de l'envoi. Vérifiez les champs.")
      },
      onSettled: () => {
        setSubmitting(false)
      }
    });
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 mt-10 bg-white dark:bg-gray-900 shadow-md dark:shadow-lg rounded-lg text-gray-800 dark:text-gray-100">
      {submitted && (
        <p className="text-green-600 dark:text-green-400 text-center mt-10">
          ✅ Variante soumise avec succès !
        </p>
      )}

      <h1 className="text-2xl font-bold mb-6 text-center">🛍️ Ajouter une Variante de Produit</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        <div>
          <Select
            label="Magasin du produit *"

            options={[
              { value: '', label: 'Sélectionnez --' },
              ...store.map(store=> ({
                value: String(store.id),
                label: store.storeName
              }))
            ]}
            {...register("storeId", { required: true })}
          />
          {errors.productId && (
            <span className="text-red-500 text-sm">Ce champ est requis</span>
          )}
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Nom de la variante *"
              placeholder="Nom de la variante "
              {...register("variantProductName", { required: true })}
            />
            {errors.variantProductName && (
              <span className="text-red-500 text-sm">Ce champ est requis</span>
            )}
          </div>

          <Select
            label="Type de variante"
            options={[
              { value: '', label: '-- Choisir --' },
              { value: 'product', label: 'Product' },
              { value: 'accessory', label: 'Accessory' }
            ]}
            {...register("variantType")}
          />

          <div className="sm:col-span-2">
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              {...register("description")}
              className={inputClass}
              rows={3}
              placeholder="Description détaillée du produit..."
            />
          </div>

          <div>
            <Select
              label="Catégorie du produit *"

              options={[
                { value: '', label: 'Sélectionnez --' },
                ...data.map(product => ({
                  value: String(product.id),
                  label: product.productName
                }))
              ]}
              {...register("productId", { required: true })}
            />
            {errors.productId && (
              <span className="text-red-500 text-sm">Ce champ est requis</span>
            )}
          </div>

          <Input
            label="Prix d'achat"
            type="number"
            step="0.01"
            placeholder="Ex: 1200.00"
            {...register("purchasePrice")}
          />
        </div>

        {/* Specifications List */}
        <div>
          <label className="block mb-1 font-medium">Spécifications</label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col sm:flex-row gap-2 mb-2">
              <input
                {...register(`specifications.${index}.key` as const)}
                placeholder="Clé (ex: Couleur)"
                className={inputClass}
              />
              <input
                {...register(`specifications.${index}.value` as const)}
                placeholder="Valeur (ex: Noir)"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 hover:text-red-700 text-sm self-center px-2 py-1 rounded transition-colors duration-200"
              >
                🗑️ Supprimer
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ key: "", value: "" })}
            className="text-blue-500 hover:text-blue-700 mt-2 text-sm transition-colors duration-200"
          >
            ➕ Ajouter une spécification manuellement
          </button>
        </div>

        {/* Images Section */}
        <div>
          <label className="block mb-1 font-medium">Images</label>
          <input
            type="file"
            {...register("images")}
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className={inputClass}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {previews.map((src, i) => (
              <img key={i} src={src} className="h-20 w-20 object-cover rounded border border-gray-300 dark:border-gray-600" />
            ))}
          </div>
        </div>

        <div className="form-custom-row">
          <div className="form-custom-group">
            <ImageUploader onImagesChange={handleImageChange} />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-lg shadow-md transition-all duration-200 font-medium ${submitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          {submitting ? '⏳ Envoi en cours...' : '✅ Soumettre la Variante'}
        </button>

        {error && (
          <p className="text-red-500 text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-700">{error}</p>
        )}
      </form>
    </div>
  )
}

const inputClass = "w-full border dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

const Input = ({ label, ...props }: InputProps) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <input {...props} className={inputClass} />
  </div>
)

const Select = ({
  label,
  options,
  ...props
}: {
  label: string,
  options: { value: string, label: string }[]
} & React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div>
    <label className="block mb-1 font-medium">{label}</label>
    <select {...props} className={inputClass}  >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
)