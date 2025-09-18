"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ProductCard from "./ProductCard";
import { VariantsProduct } from "@/types/VariantsProduct";
import Image from "next/image";
import Link from "next/link";
import DescriptionPreview from "@/components/ui/DescriptionPreview";
import { useRouter } from "next/navigation";
import FullScreenLoaderMain from "@/components/ui/FullScreenLoaderMain";
import { useTranslation } from "react-i18next";
import SearchBarWithCategory from "@/components/ui/SearchBarWithCategory.tsx";
import { useCategories } from "@/hooks/apis/useCategoris";

interface ProductListProps {
  products: VariantsProduct[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export default function ProductList({
  products,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: ProductListProps) {
  const [filterText, setFilterText] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const lastMobileRef = useRef<HTMLDivElement | null>(null);
  const lastDesktopRef = useRef<HTMLTableRowElement | null>(null);
  const desktopScrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const { data: categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState("");
  const router = useRouter();
  const { t } = useTranslation();

  // Exemple de catégories (tu peux remplacer par des données dynamiques venant de l’API)


  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);


  // Mets à jour le filtre : combine texte + catégorie
  const handleSearch = () => {
    console.log("Recherche lancée :", { filterText, selectedCategory });
  };

  const filteredProducts = products.filter((product) => {
    const matchesText = product?.variantProductName
      ?.toLowerCase()
      .includes(filterText.toLowerCase());

    const matchesCategory = selectedCategory
      ? product?.Product?.id === Number(selectedCategory)
      : true;

    return matchesText && matchesCategory;
  });


  // 📱 Scroll infini mobile
  const handleScroll = useCallback(() => {
    if (!isMobile || !hasNextPage || isFetchingNextPage) return;
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.offsetHeight - 1000;
    if (scrollPosition >= threshold) {
      fetchNextPage();
    }
  }, [isMobile, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (isMobile) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isMobile, handleScroll]);

  // 🖥 Scroll infini desktop avec IntersectionObserver
  useEffect(() => {
    if (isMobile || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      { root: desktopScrollContainerRef.current, rootMargin: "200px" }
    );

    if (lastDesktopRef.current) {
      observer.observe(lastDesktopRef.current);
    }

    return () => {
      if (lastDesktopRef.current) {
        observer.unobserve(lastDesktopRef.current);
      }
    };
  }, [isMobile, hasNextPage, isFetchingNextPage, fetchNextPage, filteredProducts]);


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


  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      alert("Produit supprimé avec succès !");
      // Ici, tu peux recharger la liste ou mettre à jour ton état local
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  const handleRowClick = (product: VariantsProduct) => {
    setSelectedProductId(product.id);
    router.push(`/dashboard/products/view/${product.id}`);
  };

  return (
    <>


      <SearchBarWithCategory
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchText={filterText}
        onSearchChange={setFilterText}
        onSubmit={handleSearch}
      />


      {/* Mobile View */}
      <div className="block md:hidden space-y-4 pb-24">
        {filteredProducts.map((product, idx) => (
          <div
            key={product.id}
            ref={idx === filteredProducts.length - 1 ? lastMobileRef : null}
          >
            <ProductCard product={product} />
          </div>
        ))}

        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <FullScreenLoaderMain message={t("products.loading")} />
          </div>
        )}

        {!hasNextPage && filteredProducts.length > 0 && (
          <div className="text-center py-4 text-[var(--color-text-primary)]">
            {t("products.allLoaded")}
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <div
          className="overflow-x-auto overflow-y-auto max-h-[60vh]"
          ref={desktopScrollContainerRef}
        >
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
              <tr>
                <th className="px-6 py-3">{t("products.image")}</th>
                <th className="px-6 py-3">{t("products.name")}</th>
                <th className="px-6 py-3">{t("products.description")}</th>
                <th className="px-6 py-3">{t("products.price")}</th>
                <th className="px-6 py-3">{t("products.status")}</th>
                <th className="px-6 py-3">{t("products.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, idx) => (
                <tr
                  key={product.id}
                  ref={idx === filteredProducts.length - 1 ? lastDesktopRef : null}
                  onClick={() => handleRowClick(product)}
                  className={`cursor-pointer transition-colors ${selectedProductId === product.id
                    ? "bg-indigo-100 dark:bg-indigo-900"
                    : "hover:bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] "
                    }`}
                >
                  <td className="px-6 py-4">
                    {product?.image?.length > 0 ? (
                      <div className="relative h-10 w-10">
                        <Image
                          src={product?.image[0]}
                          alt={product.variantProductName}
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                        <span>{t("products.noImage")}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">{product.variantProductName}</td>
                  <td className="px-6 py-4">
                    <DescriptionPreview
                      text={product?.Product?.description?.fr || product?.Product?.description?.en}
                    />
                  </td>

                  <td className="px-6 py-4">{product?.recommendedPrice} fbu</td>
                  <td className="px-6 py-4">
                    {product.isDisplay ? t("products.visible") : t("products.hidden")}
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    {/* Modifier */}
                    <Link
                      href={`/dashboard/products/${product.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className=" text-indigo-600 p-2 rounded-md hover:bg-indigo-100  dark:text-indigo-400 dark:hover:bg-indigo-900/70"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Link>

                    {/* Partager */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(product);
                      }}
                      className=" text-blue-600 p-2 rounded-md hover:bg-blue-100  dark:text-blue-400 dark:hover:bg-blue-900/70"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                        />
                      </svg>
                    </button>

                    {/* Supprimer */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(product.id);
                      }}
                      className=" text-red-600 p-2 rounded-md hover:bg-red-100  dark:text-red-400 dark:hover:bg-red-900/70"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {isFetchingNextPage && (
            <FullScreenLoaderMain message="Chargement..." />
          )}

          {!hasNextPage && filteredProducts.length > 0 && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              {t("products.allLoaded")}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
