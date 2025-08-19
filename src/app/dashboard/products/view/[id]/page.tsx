"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Edit, Trash2, Share2, QrCode, Eye, EyeOff, Tag, Package, Calendar, BarChart3, Settings, Copy, Download, AlertCircle } from 'lucide-react';
import { useParams, useRouter } from "next/navigation";
import { getVariantById, deleteVariant } from "@/libs/api/products";
import { VariantsProduct } from '@/types/VariantsProduct';

interface Specification {
  [key: string]: string;
}

interface Product {
  productName: string;
  description: {
    en: string;
    fr: string;
    sw: string;
    kir: string;
  };
}

interface VariantData {
  id: number;
  variantProductName: string;
  variantType: string;
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
}

const ProductDetailBackoffice = () => {
  const router = useRouter();
  const { id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [variant, setVariant] = useState<VariantData | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

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
      setTimeout(() => router.push("/products"), 1500);
    } catch (error) {
      console.error("Failed to delete variant", error);
      setError("Échec de la suppression du produit");
    } finally {
      setDeleting(false);
    }
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

            // Exemple : ouvrir WhatsApp dans un nouvel onglet
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error || !variant) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
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

  const specificationsArray = getSpecificationsArray(variant.specifications);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Admin */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                onClick={() => router.push("/dashboard/products")}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors p-1 sm:p-0"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Retour à la liste</span>
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>
              <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
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
                onClick={() => router.push(`/products/edit/${variant.id}`)}
                className="flex items-center space-x-1 bg-blue-600 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Modifier</span>
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
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">QR Code Produit</h3>
              <div className="flex justify-center mb-4 p-2 sm:p-4 bg-white rounded-lg">
                <img src={variant.qrCode} alt="QR Code" className="w-48 h-48" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl w-full max-w-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-1 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Package className="w-4 sm:w-6 h-4 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">ID Produit</p>
                <p className="text-sm sm:text-2xl font-bold text-gray-900 dark:text-white">#{variant.id}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-1 sm:p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Tag className="w-4 sm:w-6 h-4 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Code Produit</p>
                <p className="text-xs sm:text-xl font-mono font-bold text-gray-900 dark:text-white truncate">{variant.productCode}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-1 sm:p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <BarChart3 className="w-4 sm:w-6 h-4 sm:h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Prix</p>
                <p className="text-sm sm:text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(variant.recommendedPrice)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-1 sm:p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                {variant.isDisplay ? 
                  <Eye className="w-4 sm:w-6 h-4 sm:h-6 text-green-600 dark:text-green-400" /> : 
                  <EyeOff className="w-4 sm:w-6 h-4 sm:h-6 text-red-600 dark:text-red-400" />
                }
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">Statut</p>
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
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Galerie d'images</h3>
              
              <div className="relative group mb-3 sm:mb-4">
                <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg sm:rounded-xl overflow-hidden">
                  <img
                    src={variant.image[selectedImageIndex] || variant.image[0]}
                    alt={variant.variantProductName}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex space-x-1 sm:space-x-2">
                  {variant.isPromotion && (
                    <span className="bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium">
                      PROMO
                    </span>
                  )}
                  <span className="bg-blue-600/90 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium">
                    {variant.variantType.toUpperCase()}
                  </span>
                </div>
              </div>
              
              {variant.image.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-1 sm:pb-2">
                  {variant.image.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded overflow-hidden transition-all duration-200 ${
                        selectedImageIndex === index
                          ? 'ring-2 ring-blue-500 scale-105'
                          : 'hover:scale-105 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={image} alt={`Vue ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Informations générales</h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Nom du produit</label>
                  <p className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white">{variant.variantProductName}</p>
                </div>
                
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Catégorie</label>
                  <p className="text-gray-900 dark:text-white text-sm sm:text-base">{variant.Product.productName}</p>
                </div>
                
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Type</label>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {variant.variantType}
                  </span>
                </div>
                
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Prix recommandé</label>
                  <p className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">{formatPrice(variant.recommendedPrice)}</p>
                </div>
                
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Slug URL</label>
                  <p className="text-gray-600 dark:text-gray-300 font-mono text-xs sm:text-sm bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded truncate">
                    {variant.slug}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Description</h3>
              {variant.description ? (
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">{variant.description}</p>
              ) : variant.Product.description?.fr ? (
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">{variant.Product.description.fr}</p>
              ) : (
                <p className="text-gray-400 italic text-sm sm:text-base">Aucune description disponible</p>
              )}
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-6 sm:mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Spécifications techniques</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
              {specificationsArray.map((spec, index) => (
                <div
                  key={index}
                  className={`p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 ${
                    index % 2 === 0 ? 'sm:border-r bg-gray-50/50 dark:bg-gray-700/30' : 'bg-white dark:bg-gray-800'
                  } ${index >= specificationsArray.length - (specificationsArray.length % 2 === 0 ? 2 : 1) ? 'border-b-0' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <dt className="font-medium text-gray-600 dark:text-gray-300 flex-shrink-0 mr-2 sm:mr-4 text-xs sm:text-sm">
                      {spec.key}
                    </dt>
                    <dd className="font-medium text-gray-900 dark:text-white text-right text-xs sm:text-sm break-all">
                      {spec.value}
                    </dd>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailBackoffice;