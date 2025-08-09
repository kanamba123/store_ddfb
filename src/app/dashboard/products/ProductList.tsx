"use client";

import { useState, useEffect, useCallback } from "react";
import ProductCard from "./ProductCard";
import { VariantsProduct } from "@/types/VariantsProduct";
import Image from "next/image";
import Link from "next/link";

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

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const filteredProducts = products.filter(product =>
    product?.variantProductName?.toLowerCase().includes(filterText.toLowerCase())
  );

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
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isMobile, handleScroll]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
        />
      </div>

      {/* Mobile View */}
      <div className="block md:hidden space-y-4 pb-24">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {!hasNextPage && filteredProducts.length > 0 && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            Tous les produits ont été chargés
          </div>
        )}
      </div>

     {/* Vue Desktop (Table) - masquée sur mobile */}
      <div className="hidden md:block">
        <div className="overflow-x-auto overflow-y-auto max-h-[50vh]">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Prix (€)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product?.image?.length > 0 ? (
                      <div className="relative h-10 w-10">
                        <Image
                          src={product?.image[0]}
                          alt={product.variantProductName}
                          fill
                          className="rounded-md object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center dark:bg-gray-700">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          No image
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {product.variantProductName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {product?.Product?.productName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-200 max-w-xs truncate">
                      {product?.Product?.description?.fr ||
                        product?.Product?.description?.en ||
                        "Aucune description"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {product?.recommendedPrice} fbu
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                 ${product.isDisplay
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                    >
                      {product.isDisplay ? "Visible" : "Masqué"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/dashboard/products/${product.id}`}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                    >
                      Modifier
                    </Link>
                    <button
                      //  onClick={() => handleShare(product)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                    >
                      Partager
                    </button>
                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}