"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Edit, Trash2, Share2, QrCode, Eye, EyeOff, Tag, Package, BarChart3, Download, AlertCircle, Shield } from 'lucide-react';
import { useParams, useRouter } from "next/navigation";
import { getVariantById, deleteVariant, fetchProductCategories } from "@/libs/api/products";
import TdCustomViewEdit from '@/components/ui/TdCustomViewEdit';
import ItemViewer from '@/components/ui/ItemViewer';
import EditForeignViewEdit from '@/components/ui/EditForeignViewEdit';
import SimpleDataManyPhotosEdit from '@/components/ui/SimpleDataManyPhotosEdit';
import { variantTypes } from '@/constants/variantTypes';
import { Product } from '@/types/Product';
import TdDynJSOBCustomGrid from '@/components/ui/TdDynJSOBCustomGrid';
import TdDynJSOBCustom from '@/components/ui/TdDynJSOBCustom';
import FullScreenLoaderMain from '@/components/ui/FullScreenLoaderMain';
import { increasePriceByPercentage } from "@/utils/priceUtils";
import { useTranslation } from "react-i18next";
import TdDynJSOBWithoutKeyCustom from '@/components/ui/TdDynJSOBWithoutKeyCustom';
import TdCustomViewEditPromotion from '@/components/ui/TdCustomViewEditPromotion';

interface Specification {
  [key: string]: string;
}


interface VariantData {
  id: number;
  variantProductName: string;
  variantType: string;
  purchasePrice: number;
  recommendedPrice: number;
  slug: string;
  description?: string;
  qrCode: string;
  image: string[];
  specifications: Specification;
  productCode: string;
  functions: any[];
  features: any[];
  isPromotion: boolean;
  isDisplay: boolean;
  Product: Product;
  promotion: any;
  productId: number;
  promotionId: number | null;
  sellingPrice: number;
  status: string;
}

const ProductDetailBackoffice = () => {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [variant, setVariant] = useState<VariantData | null>(null);
  const [data, setData] = useState<Product[]>([])
  const [showQR, setShowQR] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const dataendPoint = "variantesProduits";
  const { t } = useTranslation();

  const loadVariant = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const variantData = await getVariantById(id as string);
      setVariant(variantData);
      setShareUrl(`${window.location.origin}/product/${variantData.slug}`);
    } catch (error) {
      console.error("Failed to load variant data", error);
      setError("Échec du chargement des données du produit");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadVariant();
  }, [loadVariant]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const dataProduct = await fetchProductCategories()
        setData(dataProduct)
      } catch (error) {
        console.error(error)
      }
    }
    loadProduct()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'BIF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getSpecificationsArray = (specs: Specification) => {
    return Object.entries(specs).map(([key, value]) => ({
      key: key.charAt(0).toUpperCase() + key.slice(1),
      value
    }));
  };

  const handleDelete = async () => {
    if (!variant) return;

    try {
      setDeleting(true);
      await deleteVariant(variant.id);
      setShowDeleteModal(false);
      setTimeout(() => router.push("/dashboard/products"), 1500);
    } catch (error) {
      console.error("Failed to delete variant", error);
      setError("Échec de la suppression du produit");
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = (updatedVariant: any) => {
    // updateMutation.mutate(updatedVariant);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    const shareData = {
      title: variant!.variantProductName,
      text: `Découvrez ${variant!.variantProductName} à ${variant!.recommendedPrice} fbu`,
      url: `https://win2cop.com/products/${variant!.slug}/${variant!.id}`,
    };

    if (navigator.share) {
      // Mobile / navigateur supporté
      navigator.share(shareData).catch(console.error);
    } else {
      // Desktop fallback
      const shareText = `${shareData.text}\n${shareData.url}`;

      // Copier le lien dans le presse-papiers
      navigator.clipboard.writeText(shareText)
        .then(() => alert("Lien copié dans le presse-papiers !"))
        .catch(() => {
          // fallback plus ancien
          const textArea = document.createElement('textarea');
          textArea.value = shareText;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert("Lien copié dans le presse-papiers !");
        });

      // Ouvrir un mini menu de partage dans de nouveaux onglets
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareText)}`;

      // Ouvrir WhatsApp dans un nouvel onglet
      const userChoice = window.prompt("Partager sur :\n1 = WhatsApp\n2 = Facebook\n3 = Telegram\nEntrez le numéro :");
      if (userChoice === "1") window.open(whatsappUrl, "_blank");
      if (userChoice === "2") window.open(facebookUrl, "_blank");
      if (userChoice === "3") window.open(telegramUrl, "_blank");
    }
  };

   const copyShareLinkAdmin = () => {
    navigator.clipboard.writeText(shareUrl);
    const shareData = {
      title: variant!.variantProductName,
      text: `Découvrez ${variant!.variantProductName} à ${variant!.recommendedPrice} fbu`,
      url: `https://s.win2cop.com/dashboard/products/view/${variant!.id}`,
    };

    if (navigator.share) {
      // Mobile / navigateur supporté
      navigator.share(shareData).catch(console.error);
    } else {
      // Desktop fallback
      const shareText = `${shareData.text}\n${shareData.url}`;

      // Copier le lien dans le presse-papiers
      navigator.clipboard.writeText(shareText)
        .then(() => alert("Lien copié dans le presse-papiers !"))
        .catch(() => {
          // fallback plus ancien
          const textArea = document.createElement('textarea');
          textArea.value = shareText;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert("Lien copié dans le presse-papiers !");
        });

      // Ouvrir un mini menu de partage dans de nouveaux onglets
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareText)}`;

      // Ouvrir WhatsApp dans un nouvel onglet
      const userChoice = window.prompt("Partager sur :\n1 = WhatsApp\n2 = Facebook\n3 = Telegram\nEntrez le numéro :");
      if (userChoice === "1") window.open(whatsappUrl, "_blank");
      if (userChoice === "2") window.open(facebookUrl, "_blank");
      if (userChoice === "3") window.open(telegramUrl, "_blank");
    }
  };

  const downloadQRCode = () => {
    if (!variant) return;

    const link = document.createElement('a');
    link.download = `qr-code-${variant.productCode}.png`;
    link.href = variant.qrCode;
    link.click();
  };

  if (loading) {
    return (
      <div className=" bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex items-center justify-center p-4">
        <div className="text-center">
          <FullScreenLoaderMain message={t("products.loading")} />
        </div>
      </div>
    );
  }

  if (error || !variant) {
    return (
      <div className=" bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] flex items-center   justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 text-xl mb-4">{error || "Produit non trouvé"}</p>
          <button
            onClick={() => router.push("/products")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            Retour aux produits
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className=" bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] overflow-y-auto max-h-full">
      {/* Header Admin */}
      <div className="sticky top-0 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => router.push("/dashboard/products")}
                className="flex items-center space-x-1 sm:space-x-2 text-[var(--color-text-primary)] hover:text-gray-900 dark:hover:text-white transition-colors p-1 sm:p-0"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Retour à la liste</span>
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
              <h1 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)]">
                Détail du Produit
              </h1>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => setShowQR(true)}
                className="p-1 sm:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Voir QR Code"
              >
                <QrCode className="w-5 h-5" />
              </button>

              <button
                onClick={copyShareLink}
                className="p-1 sm:p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Copier le lien de partage"
              >
                <Share2 className="w-5 h-5" />
              </button>


              <button
               onClick={copyShareLinkAdmin}
                className="flex items-center space-x-1 bg-blue-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <div className="relative flex items-center">
                  <Shield className="w-4 h-4" />
                  <Share2 className="w-3 h-3 absolute -right-2 -top-1" />
                </div>
                <span className="hidden sm:inline">Partager (Admin)</span>
              </button>



              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center space-x-1 bg-red-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Supprimer</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal QR Code */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowQR(false)}>
          <div className="bg-[var(--color-bg-primary)] p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">QR Code Produit</h3>
              <div className="flex justify-center mb-4 p-2 sm:p-4 bg-white rounded-lg">
                <img src={variant.qrCode} alt="QR Code" className="w-48 h-48" />
              </div>
              <p className="text-sm text-[var(--color-text-primary)] mb-4">
                Code produit: <span className="font-mono font-medium">{variant.productCode}</span>
              </p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={downloadQRCode}
                  className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger</span>
                </button>
                <button
                  onClick={() => setShowQR(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 from-blue-500/40 to-red-500/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-bg-primary)] p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
                Supprimer le produit
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Êtes-vous sûr de vouloir supprimer "{variant.variantProductName}" ? Cette action est irréversible.
              </p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-6">
          <div className="bg-[var(--color-bg-primary)] rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-1 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Package className="w-4 sm:w-6 h-4 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-[var(--color-text-primary)]">ID Produit</p>
                <p className="text-sm sm:text-2xl font-bold text-[var(--color-text-primary)]">#{variant.id}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-bg-primary)] rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-1 sm:p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Tag className="w-4 sm:w-6 h-4 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-[var(--color-text-primary)]">Code Produit</p>
                <p className="text-xs sm:text-xl font-mono font-bold text-[var(--color-text-primary)] truncate">{variant.productCode}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-bg-primary)] rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-1 sm:p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <BarChart3 className="w-4 sm:w-6 h-4 sm:h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-[var(--color-text-primary)]">Prix</p>
                <p className="text-sm sm:text-2xl font-bold text-[var(--color-text-primary)]">{formatPrice(variant.recommendedPrice)}</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-bg-primary)] rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-1 sm:p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                {variant.isDisplay ?
                  <Eye className="w-4 sm:w-6 h-4 sm:h-6 text-green-600 dark:text-green-400" /> :
                  <EyeOff className="w-4 sm:w-6 h-4 sm:h-6 text-red-600 dark:text-red-400" />
                }
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-[var(--color-text-primary)]">Statut</p>
                <p className={`text-xs sm:text-xl font-bold ${variant.isDisplay ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {variant.isDisplay ? 'Visible' : 'Masqué'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Images Gallery */}
          <div className="space-y-3 sm:space-y-4">

            {/* ✅ Composant modifiable */}
            <SimpleDataManyPhotosEdit
              id={variant.id}
              field="image"
              value={variant?.image}
              onSave={handleSave}
              endpoint={dataendPoint}
              editable={true}
              forder="variantes_products"
              namePitch="photo_variantes_products_modified"
              suffixName={variant.variantProductName}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-[var(--color-bg-primary)] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)] mb-3 sm:mb-4">Informations générales</h3>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Nom du produit</label>
                  <div className="text-sm sm:text-lg font-semibold text-[var(--color-text-primary)]">
                    <TdCustomViewEdit
                      id={variant.id}
                      field="variantProductName"
                      value={variant?.variantProductName}
                      endpoint={dataendPoint}
                      editable
                      useDialog
                      onSave={handleSave}
                    />
                  </div>

                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Catégorie</label>
                  <EditForeignViewEdit
                    id={variant.id}
                    itemValue={variant?.productId}
                    endpoint={dataendPoint}
                    field="productId"
                    onSave={handleSave}
                    options={data}
                    editable={true}
                    labelField="productName"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Type</label>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    <ItemViewer
                      id={variant.id}
                      itemValue={variant?.variantType}
                      endpoint={dataendPoint}
                      field="status"
                      options={variantTypes}
                      onSave={handleSave}
                    />
                  </span>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Prix d’achat HT</label>
                  <div className="text-lg sm:text-2xl font-bold text-blue-900 dark:text-blue-400">
                    <TdCustomViewEdit
                      id={variant.id}
                      field="purchasePrice"
                      value={variant?.purchasePrice}
                      endpoint={dataendPoint}
                      editable
                      useDialog
                      onSave={handleSave}
                    />
                  </div>
                </div>


                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Prix ajusté</label>
                  <div className="text-lg sm:text-2xl font-bold text-action-save dark:text-action-save-hover">
                    <TdCustomViewEdit
                      id={variant.id}
                      field="purchasePrice"
                      value={formatPrice(increasePriceByPercentage(variant?.purchasePrice, 5))}
                      endpoint={dataendPoint}
                      editable
                      useDialog
                      modifiable={false}
                      onSave={handleSave}
                    />
                  </div>
                </div>


                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Prix de vente</label>
                  <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">
                    <TdCustomViewEdit
                      id={variant.id}
                      field="sellingPrice"
                      value={formatPrice(variant?.recommendedPrice)}
                      endpoint={dataendPoint}
                      editable
                      useDialog
                      modifiable={false}
                      onSave={handleSave}
                    />
                  </div>
                </div>



                <div>
                  <label className="text-xs sm:text-sm font-medium ">Slug URL</label>
                  <p className="text-[var(--color-text-primary)] font-mono text-xs sm:text-sm  px-2 py-1 rounded truncate">
                    {variant.slug}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[var(--color-bg-primary)] rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)] mb-3 sm:mb-4">Description</h3>

              <TdDynJSOBCustom
                id={variant.id}
                field="description"
                value={variant?.description ?? variant.description}
                endpoint={dataendPoint}
                editable
                onSave={handleSave}
              />

            </div>


          </div>
        </div>

        {/* Specifications */}
        <TdDynJSOBCustomGrid
          id={variant.id}
          field="specifications"
          value={variant?.specifications}
          endpoint={dataendPoint}
          editable
          onSave={handleSave}
        />

        <TdDynJSOBWithoutKeyCustom
          sectionTitle="Fonctions"
          title="Fonctions détaillées"
          field="functions"
          id={variant.id}
          value={variant.functions}
          endpoint={dataendPoint}
          editable
          onSave={handleSave}
        />

        <TdDynJSOBWithoutKeyCustom
          sectionTitle="Features"
          title="Features"
          field="features"
          id={variant.id}
          value={variant.features}
          endpoint={dataendPoint}
          editable
          onSave={handleSave}
        />

        <TdCustomViewEditPromotion
          id={variant.id}
          field="status" // <-- obligatoire si tu ne changes pas l'interface
          oldPrice={variant?.sellingPrice}
          promotionId={variant.promotionId}
          itemValue={variant?.status}
          endpoint={dataendPoint}
          isPromotion={variant.isPromotion}
          editable
          useDialog
          onSave={handleSave}
          promotionGeted={variant?.promotion}
        />
      </div>
    </div>
  );
};

export default ProductDetailBackoffice;