"use client"

import { useEffect, useState, useCallback } from "react"
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

type VariantType = 'product' | 'accessory' | ''

interface VariantFormData {
  variantProductName: string
  variantType?: VariantType
  description?: string
  productId: number | ''
  purchasePrice?: number | string
  images: FileList | null
  specifications: Specification[]
  bulkInput?: string
}

interface ParsedData {
  productName?: string
  description?: string
  price?: number
  specifications: Specification[]
}

export default function UploadVariantForm() {
  const { token } = useParams()
  const [submitting, setSubmitting] = useState(false)
  const [data, setData] = useState<Product[]>([])
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [previews, setPreviews] = useState<string[]>([])
  const [parseError, setParseError] = useState("")
  const [bulkInput, setBulkInput] = useState("")
  const [parseSuccess, setParseSuccess] = useState("")

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

  // Fonction pour détecter et extraire les prix
  const extractPrices = (text: string): number[] => {
    // Patterns pour différents formats de prix
    const pricePatterns = [
      /(\d+(?:[.,]\d{2})?)\s*(?:€|euros?|EUR)/gi,
      /(\d+(?:[.,]\d{2})?)\s*(?:\$|dollars?|USD)/gi,
      /(\d+(?:[.,]\d{2})?)\s*(?:CDF|FC|francs?)/gi,
      /(?:prix|price|coût|cost)[:\s]*(\d+(?:[.,]\d{2})?)/gi,
      /(\d+(?:[.,]\d{2})?)\s*(?:DH|dirhams?)/gi,
      /(\d+(?:[.,]\d{2})?)\s*(?:XAF|FCFA)/gi
    ]
    
    const prices: number[] = []
    pricePatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)]
      matches.forEach(match => {
        const price = parseFloat(match[1].replace(',', '.'))
        if (!isNaN(price) && price > 0) {
          prices.push(price)
        }
      })
    })
    
    return [...new Set(prices)] // Remove duplicates
  }

  // Fonction pour détecter le nom du produit
  const extractProductName = (text: string): string | undefined => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line)
    
    // La première ligne non-vide est souvent le nom du produit
    if (lines.length > 0) {
      const firstLine = lines[0]
      // Éviter les lignes qui ressemblent à des messages
      if (!firstLine.match(/^(bonjour|salut|hello|hi)/i) && firstLine.length > 3) {
        return firstLine
      }
    }
    
    // Chercher des patterns spécifiques
    const productPatterns = [
      /(?:produit|product|article)[:\s]*([^\n]+)/gi,
      /(?:nom|name)[:\s]*([^\n]+)/gi
    ]
    
    for (const pattern of productPatterns) {
      const match = text.match(pattern)
      if (match && match[1]) {
        return match[1].trim()
      }
    }
    
    return undefined
  }

  // Fonction pour extraire les spécifications
  const extractSpecifications = (text: string): Specification[] => {
    const specifications: Specification[] = []
    const lines = text.split('\n').map(line => line.trim()).filter(line => line)
    
    // Patterns pour les spécifications
    const specPatterns = [
      /^(.+?)[:\-=]\s*(.+)$/,
      /^([^:=\-]+)\s*[:\-=]\s*(.+)$/,
      /^\*\s*(.+?)[:\-=]\s*(.+)$/,
      /^-\s*(.+?)[:\-=]\s*(.+)$/
    ]
    
    // Mots-clés courants pour les spécifications
    const specKeywords = [
      'couleur', 'color', 'taille', 'size', 'poids', 'weight', 
      'matériel', 'material', 'matière', 'marque', 'brand',
      'modèle', 'model', 'capacité', 'capacity', 'stockage', 'storage',
      'ram', 'mémoire', 'memory', 'écran', 'screen', 'display',
      'batterie', 'battery', 'processeur', 'processor', 'cpu',
      'résolution', 'resolution', 'dimensions', 'garantie', 'warranty'
    ]
    
    lines.forEach(line => {
      for (const pattern of specPatterns) {
        const match = line.match(pattern)
        if (match && match[1] && match[2]) {
          const key = match[1].trim()
          const value = match[2].trim()
          
          // Vérifier si c'est vraiment une spécification
          if (key.length > 1 && value.length > 0 && 
              (specKeywords.some(keyword => 
                key.toLowerCase().includes(keyword) || 
                value.toLowerCase().includes(keyword)
              ) || key.length < 30)) {
            specifications.push({ key, value })
            break
          }
        }
      }
    })
    
    return specifications
  }

  // Fonction pour extraire la description
  const extractDescription = (text: string): string | undefined => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line)
    
    // Chercher des patterns de description
    const descPatterns = [
      /(?:description|desc)[:\s]*([^\n]+(?:\n[^\n:=\-]*)*)/gi,
      /(?:détails|details)[:\s]*([^\n]+(?:\n[^\n:=\-]*)*)/gi
    ]
    
    for (const pattern of descPatterns) {
      const match = text.match(pattern)
      if (match && match[1]) {
        return match[1].trim()
      }
    }
    
    // Si pas de pattern spécifique, prendre les lignes qui ne sont pas des spécifications
    const descLines = lines.filter(line => {
      return !line.match(/^.+?[:\-=]\s*.+$/) && 
             line.length > 10 && 
             !extractPrices(line).length
    })
    
    if (descLines.length > 0) {
      return descLines.join('\n')
    }
    
    return undefined
  }

  // Fonction principale pour analyser le texte collé
  const parseSmartData = useCallback((text: string): ParsedData => {
    try {
      setParseError("")
      setParseSuccess("")
      
      if (!text.trim()) {
        return { specifications: [] }
      }
      
      // Nettoyer le texte (supprimer les caractères indésirables de WhatsApp/FB)
      const cleanedText = text
        .replace(/^\[.*?\]\s*/gm, '') // Supprimer [timestamps]
        .replace(/^.*?:\s*/gm, '') // Supprimer "Nom: " au début des lignes
        .replace(/\u200E/g, '') // Supprimer les caractères de direction RTL/LTR
        .trim()
      
      const result: ParsedData = {
        specifications: []
      }
      
      // Extraire le nom du produit
      const productName = extractProductName(cleanedText)
      if (productName) {
        result.productName = productName
      }
      
      // Extraire les prix
      const prices = extractPrices(cleanedText)
      if (prices.length > 0) {
        result.price = Math.min(...prices) // Prendre le prix le plus bas comme prix d'achat
      }
      
      // Extraire les spécifications
      result.specifications = extractSpecifications(cleanedText)
      
      // Extraire la description
      const description = extractDescription(cleanedText)
      if (description) {
        result.description = description
      }
      
      return result
      
    } catch (error) {
      setParseError("Erreur lors de l'analyse des données. Vérifiez le format.")
      console.error("Erreur de parsing intelligent:", error)
      return { specifications: [] }
    }
  }, [])

  // Fonction pour appliquer les données parsées au formulaire
  const applyParsedData = (parsedData: ParsedData) => {
    let appliedFields: string[] = []
    
    if (parsedData.productName) {
      setValue("variantProductName", parsedData.productName)
      appliedFields.push("Nom du produit")
    }
    
    if (parsedData.price) {
      setValue("purchasePrice", parsedData.price)
      appliedFields.push("Prix")
    }
    
    if (parsedData.description) {
      setValue("description", parsedData.description)
      appliedFields.push("Description")
    }
    
    if (parsedData.specifications.length > 0) {
      // Vider les spécifications existantes
      remove()
      // Ajouter les nouvelles spécifications
      parsedData.specifications.forEach(spec => append(spec))
      appliedFields.push(`${parsedData.specifications.length} spécifications`)
    }
    
    if (appliedFields.length > 0) {
      setParseSuccess(`✅ Données appliquées: ${appliedFields.join(', ')}`)
    }
  }

  // Fonction pour l'analyse intelligente
  const handleSmartParse = () => {
    const parsed = parseSmartData(bulkInput)
    if (parsed) {
      applyParsedData(parsed)
    }
  }

  // Fonction pour l'importation manuelle des spécifications uniquement
  const processBulkData = useCallback((text: string): Specification[] | null => {
    try {
      setParseError("")
      if (!text.trim()) return null

      const lines = text.split('\n')
        .filter(line => line.trim() !== '')
        .map(line => line.trim())

      const parsed: Specification[] = []
      const errors: string[] = []

      lines.forEach((line, index) => {
        const separatorIndex = line.includes(':') ? line.indexOf(':') : line.includes('=') ? line.indexOf('=') : -1
        
        if (separatorIndex === -1) {
          errors.push(`Ligne ${index + 1}: Format invalide (utilisez "clé:valeur" ou "clé=valeur")`)
          return
        }

        const key = line.slice(0, separatorIndex).trim()
        const value = line.slice(separatorIndex + 1).trim()

        if (!key || !value) {
          errors.push(`Ligne ${index + 1}: Clé ou valeur manquante`)
          return
        }

        parsed.push({ key, value })
      })

      if (errors.length > 0) {
        setParseError(errors.join('\n'))
        return null
      }

      return parsed
    } catch (error) {
      setParseError("Erreur lors du traitement des données. Vérifiez le format.")
      console.error("Erreur de parsing:", error)
      return null
    }
  }, [])

  const handleBulkImport = () => {
    const parsed = processBulkData(bulkInput)
    if (parsed && parsed.length > 0) {
      // Clear existing specifications
      remove()
      // Add new ones
      parsed.forEach(item => append(item))
      setParseError("")
    }
  }

  const clearBulkInput = () => {
    setBulkInput("")
    setParseError("")
    setParseSuccess("")
  }

  // Gestionnaire pour la détection automatique du collage
  const handleBulkInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setBulkInput(value)
    
    // Si le texte semble être collé (plus de 50 caractères d'un coup)
    if (value.length > 50 && value.includes('\n')) {
      // Petite temporisation pour laisser l'utilisateur finir de coller
      setTimeout(() => {
        const parsed = parseSmartData(value)
        if (parsed && (parsed.productName || parsed.price || parsed.specifications.length > 0)) {
          setParseSuccess("🔍 Données détectées ! Cliquez sur 'Analyse Intelligente' pour les appliquer.")
        }
      }, 500)
    }
  }

  const onSubmit = async (data: VariantFormData) => {
    setSubmitting(true)
    try {
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

      await axios.post(`${API_URL}/public-upload/${token}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setSubmitted(true)
      reset()
      setBulkInput("")
      setParseSuccess("")
    } catch (err) {
      console.error(err)
      setError("❌ Échec de l'envoi. Vérifiez les champs.")
    } finally {
      setSubmitting(false)
    }
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
        {/* Section d'analyse intelligente */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <h3 className="text-lg font-semibold mb-3 text-blue-800 dark:text-blue-200">
            🤖 Analyse Intelligente des Données
          </h3>
          <p className="text-sm text-blue-600 dark:text-blue-300 mb-3">
            Collez ici le texte depuis WhatsApp, Facebook, ou tout autre source. L'IA détectera automatiquement le nom, prix, spécifications et description.
          </p>
          
          <textarea
            value={bulkInput}
            onChange={handleBulkInputChange}
            placeholder={`Collez vos données ici, par exemple:
            
iPhone 13 Pro Max 256GB
Couleur: Bleu Alpin  
Écran: 6.7 pouces Super Retina XDR
Stockage: 256GB
RAM: 6GB
Caméra: Triple 12MP + LiDAR
Prix: 1200€
État: Neuf, encore sous garantie Apple`}
            className={`${inputClass} h-48 font-mono text-sm`}
          />
          
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              type="button"
              onClick={handleSmartParse}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200"
            >
              🔍 Analyse Intelligente
            </button>
            <button
              type="button"
              onClick={handleBulkImport}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200"
            >
              📝 Import Manuel (clé:valeur)
            </button>
            <button
              type="button"
              onClick={clearBulkInput}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow-md transition-all duration-200"
            >
              🗑️ Effacer
            </button>
          </div>
          
          {parseError && (
            <div className="text-red-500 text-sm whitespace-pre-line p-3 bg-red-50 dark:bg-red-900/20 rounded-lg mt-3 border border-red-200 dark:border-red-700">
              ❌ {parseError}
            </div>
          )}
          
          {parseSuccess && (
            <div className="text-green-600 dark:text-green-400 text-sm p-3 bg-green-50 dark:bg-green-900/20 rounded-lg mt-3 border border-green-200 dark:border-green-700">
              {parseSuccess}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input 
              label="Nom de la variante *" 
              placeholder="Ex: iPhone 13 Pro Max 128GB"
              {...register("variantProductName", { required: true })} 
            />
            {errors.variantProductName && (
              <span className="text-red-500 text-sm">Ce champ est requis</span>
            )}
          </div>

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
              placeholder="Description détaillée du produit..."
            />
          </div>

          <div>
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-lg shadow-md transition-all duration-200 font-medium ${
            submitting ? 'opacity-50 cursor-not-allowed' : ''
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
  options: {value: string, label: string}[] 
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