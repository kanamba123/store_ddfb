"use client";

import Image from "next/image";
import { VariantsProduct } from "@/types/VariantsProduct";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductCardProps {
    product: VariantsProduct;
}

export default function ProductCard({ product }: ProductCardProps) {

    const [isMobile, setIsMobile] = useState(false);
    const [editingProduct, setEditingProduct] = useState<VariantsProduct | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        variantProductName: "",
        sellingPrice: "",
        stock: "",
    });
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const router = useRouter();

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



    const openModalForEdit = (product: VariantsProduct) => {
        setEditingProduct(product);
        setFormData({
            variantProductName: product.variantProductName,
            sellingPrice: product.recommendedPrice?.toString() || "",
            stock: "0", // You might want to add stock to your product model
        });
        setModalOpen(true);
    };



    const handleRowClick = (product: VariantsProduct) => {
        setSelectedProductId(product.id);
        router.push(`/dashboard/products/view/${product.id}`);
    };

    return (
        <div onClick={() => {
            handleRowClick(product)
        }
        } className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2 space-y-3">
            {/* Header avec image et nom */}
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    {product?.image?.length > 0 ? (
                        <div className="relative h-16 w-16">
                            <Image
                                src={product?.image[0]}
                                alt={product.variantProductName}
                                fill
                                className="rounded-lg object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {product.variantProductName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {product?.Product?.productName}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
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
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {product?.Product?.description?.fr ||
                        product?.Product?.description?.en ||
                        "Aucune description"}
                </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 pt-2">
                <Link
                    href={`/dashboard/products/${product.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 bg-indigo-50 text-indigo-600 py-2 px-3 rounded-md text-sm font-medium hover:bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-400 dark:hover:bg-indigo-900/70 transition-colors flex items-center justify-center"
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
                    className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-100 dark:bg-blue-900/50 dark:text-blue-400 dark:hover:bg-blue-900/70 transition-colors flex items-center justify-center"
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
                <button
                    onClick={(e) => {
                        handleShare(product)
                        e.stopPropagation();
                    }
                    } className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-md text-sm font-medium hover:bg-red-100 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900/70 transition-colors flex items-center justify-center">
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}