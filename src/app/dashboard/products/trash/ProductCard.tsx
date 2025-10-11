"use client";

import Image from "next/image";
import { VariantsProduct } from "@/types/VariantsProduct";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useTranslation } from "react-i18next";
import { API_URL } from "@/config/API";
import API from "@/config/Axios";
import { useDeleteProducts } from "@/hooks/apis/useProducts";
import { deleteImageFromFirebase } from "@/services/deleteImageFromFirebase";
import { notifyInfo } from "@/components/ui/ToastNotification";

interface ProductCardProps {
    product: VariantsProduct;
}

export default function ProductCard({ product }: ProductCardProps) {

    const deleteProduct = useDeleteProducts();
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [selectedProductImages, setSelectedProductImages] = useState<string[]>([]);

    const { t } = useTranslation();

    const handleShare = (product: VariantsProduct) => {
        const shareData = {
            title: product.variantProductName,
            text: `Découvrez ${product.variantProductName} à ${product.recommendedPrice} fbu`,
            url: `https://win2cop.com/products/${product.slug}/${product.id}`,
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


    const handleRowClick = (product: VariantsProduct) => {
        router.push(`/dashboard/products/view/${product.id}`);
    };


    // Supprimer un produit
    const handleConfirmDelete = async () => {
        if (!selectedProductId) return;

        deleteProduct.mutate(selectedProductId, {
            onSuccess: async () => {
                await deleteImageFromFirebase(selectedProductImages, () => {
                    notifyInfo("Produit et images supprimés avec succès !");
                });
                setShowConfirmDelete(false);
            },
            onError: (error) => {
                console.error("Erreur de suppression :", error);
                notifyInfo("Erreur lors de la suppression du produit");
            },
        });
    };



    const handleRestore = async (id: number) => {
        try {
            await API.put(`${API_URL}/variantesProduits/restore/${id}`);
            setTimeout(() => router.push("/dashboard/products"), 1500);
        } catch (err) {
            alert("Erreur lors de la restauration");
        }
    };


    return (
        <div onClick={() => {
            handleRowClick(product)
        }
        } className="bg-[var(--color-bg-primary)]   border-b  border-[var(--color-secondary)]   space-y-2">
            {/* Header avec image et nom */}
            <div className="flex items-start space-x-3 p-2">
                <div className="flex-shrink-0">
                    {product?.image?.length > 0 ? (
                        <div className="relative h-16 w-16">
                            <Image
                                src={product?.image[0]}
                                alt={product.variantProductName}
                                fill
                                className={` rounded-lg object-cover transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
                                onLoadingComplete={() => setLoading(false)}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                placeholder="blur"
                                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxwYXRoIGZpbGw9IiMwMDhGRkYiIGQ9Ik0wIDBoMTAwdjEwMEgweiIvPjwvc3ZnPg=="

                            />
                        </div>
                    ) : (
                        <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center dark:bg-gray-700">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                No image
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[var(--color-primary)] truncate">
                        {product.variantProductName}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] truncate">
                        {product?.Product?.productName}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-semibold ">
                            {product?.recommendedPrice} fbu
                        </span>
                        <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${product.isDisplay
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                }`}
                        >
                            {product.isDisplay ? "Visible" : "Masqué"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="p-2">
                <div className="border-t   border-[var(--color-border)] mx-2 pt-2"></div>
                <div className="">
                    <p className="text-sm text-[var(--color-text-primary)] line-clamp-2">
                        {product?.Product?.description?.fr ||
                            product?.Product?.description?.en ||
                            "Aucune description"}
                    </p>
                </div>

            </div>

            {/* Actions */}
            <div className="flex justify-center items-center space-x-3 mt-3">

                <Link
                    href={`/dashboard/products/${product.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1  text-indigo-600 py-2 px-3 rounded-md text-sm font-medium hover:bg-indigo-100  dark:text-indigo-400 dark:hover:bg-indigo-900/70 transition-colors flex "
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                    </svg>
                </Link>
                <button
                    onClick={(e) => {
                        handleShare(product)
                        e.stopPropagation();
                    }
                    }
                    className="flex-1  text-blue-600 py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-100  dark:text-blue-400 dark:hover:bg-blue-900/70 transition-colors flex "
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                        />
                    </svg>
                </button>

                {/* 🔄 Restaurer */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!product.deletedAt) return;
                        handleRestore(product.id);
                    }}
                    disabled={!product.deletedAt}
                    className={` flex-1 p-2 rounded-md ${product.deletedAt
                        ? "text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/70"
                        : "text-gray-400 cursor-not-allowed dark:text-gray-500"
                        }`}
                    title={
                        product.deletedAt
                            ? t("products.restore")
                            : t("products.restoreDisabled")
                    }
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12a9 9 0 0118 0h-3l4 4-4 4h3a9 9 0 10-9 9v-3"
                        />
                    </svg>
                </button>

                {/* 🗑 Supprimer définitivement */}
                <button
                    onClick={(e) => {
                       e.stopPropagation();
                        setSelectedProductId(product.id);
                        setSelectedProductImages(product.image || []);
                        setShowConfirmDelete(true);
                    }}
                    className="text-red-600 p-2 rounded-md hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/70"
                    title={t("products.deletePermanent")}
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                </button>
            </div>


            <ConfirmDialog
                isOpen={showConfirmDelete}
                title={t("common.delete")}
                message={t("common.confirmDelete")}
                confirmLabel={t("common.delete")}
                cancelLabel={t("common.cancel")}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowConfirmDelete(false)}
            />
        </div>
    );
}