"use client"
import { useEffect, useState, useCallback } from "react"
import { useForm, Controller } from "react-hook-form"
import { fetchProductCategories } from "@/libs/api/products"
import { useCreateVariantProduct } from "@/hooks/apis/useVariants"
import ImageUploader from "@/components/ui/ImageUploader"
import AddKeyValuePairs from "@/components/ui/AddKeyValuePairs"
import { useFetchStoresByConditionFilters } from "@/hooks/apis/useStores"
import { Product } from "@/types/Product"
import { StoreData } from "@/types/registration"
import { uploadMultipleImagesToFirebase } from "@/services/uploadMultipleImagesToFirebase"
import SearchableSelect from "@/components/ui/SearchableSelect"
import Image from "next/image"
import { useTranslation } from 'react-i18next';

interface Specification {
  key: string
  value: string
}

type VariantType = 'product' | 'accessory' | ''

interface VariantFormData {
  variantProductName: string
  variantType?: VariantType
  description?: string
  productId: number | ''
  storeId: number | ''
  purchasePrice?: number | string
  image: FileList | null
  specifications: Specification[]
  bulkInput?: string
}

const inputClass = "w-full border dark:border-gray-600 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"

const Input = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
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
    <select {...props} className={`${inputClass} bg-[var(--color-bg-primary)] `}>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
      
    </select>
  </div>
)

export default function UploadVariantForm() {
  const { data: store = [] } = useFetchStoresByConditionFilters();
  const useMutation = useCreateVariantProduct();
  const [submitting, setSubmitting] = useState(false)
  const [data, setData] = useState<Product[]>([])
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [previews, setPreviews] = useState<string[]>([])
  const [specifications, setSpecifications] = useState<Record<string, string>>({})
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setValue
  } = useForm<VariantFormData>({
    defaultValues: {
      specifications: [],
      productId: '',
      storeId: '',
      variantType: '',
      image: null,
      bulkInput: ''
    }
  })

  const handleSpecificationsChange = useCallback((specs: Record<string, string>) => {
    setSpecifications(specs);
  }, []);

  useEffect(() => {
    setValue("specifications", Object.entries(specifications).map(([key, value]) => ({ key, value })))
  }, [specifications, setValue])

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const dataProduct = await fetchProductCategories()
        setData(dataProduct)
      } catch (error) {
        console.error(t('uploadVariantForm.errors.failedLoadProducts'), error)
      }
    }
    loadProduct()
  }, [t])

  const handleImageChange = useCallback((files: File[]) => {
    setUploadedFiles(files);
  }, []);

  const onSubmit = async (data: VariantFormData) => {
    setSubmitting(true);
    setError("");

    try {
      let imageUrls: string[] = [];

      if (uploadedFiles.length > 0) {
        imageUrls = await uploadMultipleImagesToFirebase(
          uploadedFiles,
          "photo_products",
          "products"
        );
      }

      const payload = {
        ...data,
        purchasePrice: data.purchasePrice ? Number(data.purchasePrice) : undefined,
        productId: Number(data.productId),
        storeId: Number(data.storeId),
        variantType: data.variantType || undefined,
        image: imageUrls,
        specifications: Object.keys(specifications).length > 0
          ? specifications
          : undefined
      };

      useMutation.mutate(payload, {
        onSuccess: () => {
          setSubmitted(true);
          reset();
          setSpecifications({});
          setPreviews([]);
          setUploadedFiles([]);
        },
        onError: (error) => {
          console.error(error);
          setError(t('uploadVariantForm.errors.submissionFailed'));
        },
        onSettled: () => {
          setSubmitting(false);
        }
      });

    } catch (uploadError) {
      console.error(t('uploadVariantForm.errors.imageUploadError'), uploadError);
      setError(t('uploadVariantForm.errors.imageUploadFailed'));
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-[var(--color-bg-primary)]  shadow-md dark:shadow-lg rounded-lg text-[var(--color-text-primary)] ">
      {submitted && (
        <p className="text-green-600 dark:text-green-400 text-center mt-10">
          {t('uploadVariantForm.successMessage')}
        </p>
      )}

      <h1 className="text-xl font-bold mb-4 text-center">{t('uploadVariantForm.title')}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Magasin */}
        <Controller
          name="storeId"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <div>
              <SearchableSelect
                label={t('uploadVariantForm.labels.store') + ' *'}
                options={store.map((store: StoreData) => ({
                  value: String(store.id),
                  label: store.storeName
                }))}
                value={String(field.value || '')} 
                onChange={(value: string) => field.onChange(Number(value))}
                required
              />
              {fieldState.error && (
                <span className="text-red-500 text-sm">{t('common.requiredField')}</span>
              )}
            </div>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nom de la variante */}
          <Input
            label={t('uploadVariantForm.labels.variantName') + ' *'}
            placeholder={t('uploadVariantForm.placeholders.variantName')}
            {...register("variantProductName", { required: true })}
          />
          {errors.variantProductName && (
            <span className="text-red-500 text-sm">{t('common.requiredField')}</span>
          )}

          {/* Type de variante */}
          <Controller
            name="variantType"
            control={control}
            
            render={({ field }) => (
              <Select
                label={t('uploadVariantForm.labels.variantType')}
                className="bg-[var(--color-bg-primary)]"
                options={[
                  { value: '', label: t('common.chooseOption') },
                  { value: 'product', label: t('uploadVariantForm.options.product') },
                  { value: 'accessory', label: t('uploadVariantForm.options.accessory') }
                ]}
                {...field}
              />
            )}
          />

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block mb-1 font-medium">{t('uploadVariantForm.labels.description')}</label>
            <textarea
              {...register("description")}
              className={inputClass}
              rows={2}
              placeholder={t('uploadVariantForm.placeholders.description')}
            />
          </div>

          <Controller
            name="productId"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <SearchableSelect
                label={t('uploadVariantForm.labels.product') + ' *'}
                options={data.map(product => ({
                  value: String(product.id),
                  label: product.productName
                }))}
                value={String(field.value || '')} 
                onChange={(value: string) => field.onChange(Number(value))}
                required
              />
            )}
          />

          {/* Prix d'achat */}
          <Input
            label={t('uploadVariantForm.labels.purchasePrice')}
            type="number"
            step="0.01"
            placeholder={t('uploadVariantForm.placeholders.purchasePrice')}
            {...register("purchasePrice")}
          />
        </div>

        {/* Spécifications */}
        <div>
          <label className="block mb-2 font-medium">{t('uploadVariantForm.labels.specifications')}</label>
          <AddKeyValuePairs
            keyPlaceholder={t('uploadVariantForm.placeholders.specificationName')}
            valuePlaceholder={t('uploadVariantForm.placeholders.specificationValue')}
            onAdd={handleSpecificationsChange} 
            title=""
          />
        </div>

        {/* Images */}
        <div>
          <ImageUploader onImagesChange={handleImageChange} />
          <div className="flex flex-wrap gap-2 mt-2">
            {previews.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt="Preview"
                loader={() => src} 
                width={80}
                height={80}
                className="object-cover rounded border border-gray-300 dark:border-gray-600"
              />
            ))}
          </div>
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-lg shadow-md transition-all duration-200 font-medium ${submitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          {submitting ? t('uploadVariantForm.buttons.submitting') : t('uploadVariantForm.buttons.submit')}
        </button>

        {/* Message d'erreur */}
        {error && (
          <p className="text-red-500 text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-700">
            {error}
          </p>
        )}
      </form>
    </div>
  )
}