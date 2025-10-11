"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import Image from "next/image"
import { fetchProductCategories, getVariantById, updateVariant } from "@/libs/api/products"

interface Specification {
  key: string
  value: string
}

interface Product {
  id: number
  productName: string
}

type VariantType = 'product' | 'accessory' | ''

interface VariantFormData {
  variantProductName: string
  variantType?: VariantType
  description?: string
  productId: number | ''
  purchasePrice?: number | string
  image: FileList | null
  specifications: Specification[]
  existingImages?: string[]
}

const parseSpecifications = (specs: any): Specification[] => {
  if (!specs || !Array.isArray(specs)) return [{ key: "", value: "" }]
  
  return specs.map(spec => {
    if (typeof spec === 'string') {
      const separator = spec.includes(':') ? ':' : '='
      const [key, value] = spec.split(separator).map(s => s.trim())
      return { key: key || 'Unknown', value: value || '' }
    }
    return { key: spec.key || '', value: spec.value || '' }
  })
}

const inputClass = "w-full border dark:border-gray-600 p-2 rounded  focus:ring-2 focus:ring-blue-500 focus:border-transparent"

const Input = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
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
    <select {...props} className={inputClass}>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
)

export default function EditVariantForm() {
  const router = useRouter()
  const { id } = useParams()
  const [submitting, setSubmitting] = useState(false)
  const [data, setData] = useState<Product[]>([])
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [previews, setPreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])

  const { 
    register, 
    control, 
    handleSubmit, 
    reset,
    setValue,
    formState: { errors } 
  } = useForm<VariantFormData>({
    defaultValues: {
      specifications: [{ key: "", value: "" }],
      productId: '',
      variantType: '',
      image: null,
      existingImages: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specifications"
  })

  const loadData = useCallback(async () => {
    try {
      const [dataProduct, variant] = await Promise.all([
        fetchProductCategories(),
        id ? getVariantById(id as string) : Promise.resolve(null)
      ])

      setData(dataProduct)

      if (variant) {
        setExistingImages(variant.image || [])
        setValue('variantProductName', variant.variantProductName)
        setValue('variantType', variant.variantType as VariantType)
        setValue('description', variant.description)
        setValue('productId', variant.Product?.id || '')
        setValue('purchasePrice', variant.purchasePrice)
        setValue('specifications', parseSpecifications(variant.specifications))
      }
    } catch (error) {
      console.error("Failed to load data", error)
      setError("Échec du chargement des données")
    }
  }, [id, setValue])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const urls = files.map(file => URL.createObjectURL(file))
      setPreviews(urls)
    }
  }

  const removeExistingImage = (index: number) => {
    const updatedImages = [...existingImages]
    updatedImages.splice(index, 1)
    setExistingImages(updatedImages)
    setValue('existingImages', updatedImages)
  }

  const onSubmit = async (data: VariantFormData) => {
    setSubmitting(true)
    try {
      const formData = new FormData()
      const payload = {
        ...data,
        purchasePrice: data.purchasePrice ? Number(data.purchasePrice) : undefined,
        productId: Number(data.productId),
        variantType: data.variantType || undefined,
        existingImages: data.existingImages || []
      }

      Object.entries(payload).forEach(([key, value]) => {
        if (key === "image" && value) {
          Array.from(value as FileList).forEach(file => 
            formData.append("images", file)
          )
        } else if (key === "specifications" || key === "existingImages") {
          formData.append(key, JSON.stringify(value))
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })

      await updateVariant(Number(id), formData)
      setSubmitted(true)
      setTimeout(() => router.push("/dashboard/products"), 1500)
    } catch (err) {
      console.error(err)
      setError("❌ Échec de la modification. Vérifiez les champs.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 mt-10 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] shadow-md dark:shadow-lg rounded-lg ">
      {submitted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-center">
            <p className="text-green-600 dark:text-green-400 text-xl mb-4">
              ✅ Variante modifiée avec succès !
            </p>
            <p>Redirection en cours...</p>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-center">✏️ Modifier une Variante de Produit</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input 
            label="Nom de la variante *" 
            placeholder="Ex: iPhone 13 Pro Max 128GB"
            {...register("variantProductName", { required: true })} 
          />
          {errors.variantProductName && (
            <span className="text-red-500 text-sm">Ce champ est requis</span>
          )}

          <Select 
            label="Type de variante"
            options={[
              {value: '', label: '-- Choisir --'},
              {value: 'product', label: 'Product'},
              {value: 'accessory', label: 'Accessory'}
            ]}
            {...register("variantType")}
          />

          <div className="sm:col-span-2">
            <label className="block mb-1 font-medium">Description</label>
            <textarea 
              {...register("description")} 
              className={inputClass} 
              rows={3}
            />
          </div>

          <Select
            label="Catégorie du produit *"
            options={[
              {value: '', label: 'Sélectionnez --'},
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

          <Input 
            label="Prix d'achat" 
            type="number" 
            step="0.01"
            {...register("purchasePrice")} 
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Spécifications</label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col sm:flex-row gap-2 mb-2">
              <input 
                {...register(`specifications.${index}.key`)} 
                placeholder="Clé (ex: Couleur)" 
                className={inputClass} 
              />
              <input 
                {...register(`specifications.${index}.value`)} 
                placeholder="Valeur (ex: Noir)" 
                className={inputClass} 
              />
              <button 
                type="button" 
                onClick={() => remove(index)} 
                className="text-red-500 text-sm self-center"
                aria-label="Supprimer la spécification"
              >
                Supprimer
              </button>
            </div>
          ))}
          <button 
            type="button" 
            onClick={() => append({ key: "", value: "" })} 
            className="text-blue-500 mt-2 text-sm"
            aria-label="Ajouter une spécification"
          >
            ➕ Ajouter une spécification
          </button>
        </div>

        <div>
          <label className="block mb-1 font-medium">Images existantes</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {existingImages.map((src, i) => (
              <div key={i} className="relative h-20 w-20">
                <Image
                  src={src}
                  alt={`Image produit ${i + 1}`}
                  fill
                  className="object-cover rounded"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(i)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  aria-label={`Supprimer l'image ${i + 1}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <label className="block mb-1 font-medium">Nouvelles images</label>
          <input
            type="file"
            {...register("image")}
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className={inputClass}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {previews.map((src, i) => (
              <div key={i} className="relative h-20 w-20">
                <Image
                  src={src}
                  alt={`Nouvelle image ${i + 1}`}
                  fill
                  className="object-cover rounded"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded">
            {error}
          </div>
        )}

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className={`bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition dark:bg-indigo-700 dark:hover:bg-indigo-600 ${
              submitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Enregistrer les modifications"
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </span>
            ) : (
              '💾 Enregistrer les modifications'
            )}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard/products")}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
            aria-label="Annuler et retourner à la liste"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}