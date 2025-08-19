"use client";

import { useVariantsProductByStore } from "@/hooks/apis/useProducts";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import ProductList from "./ProductList";

export default function ProductsPage() {
  const { user } = useAuth();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useVariantsProductByStore(Number(user?.store?.id));

  return (
    <div className="min-h-screen p-4 space-y-6 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors duration-200">
      
      {/* Bouton Ajouter un produit */}
      <div className="flex justify-end">
        <Link
          href="/dashboard/products/create"
          className="px-4 py-2 rounded-md font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] transition-colors duration-200 dark:bg-[var(--color-primary-dark)] dark:hover:bg-[var(--color-primary)]"
        >
          + Ajouter un produit
        </Link>
      </div>

      {/* Liste des produits */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary)]">
            Chargement des produits...
          </div>
        ) : isError ? (
          <div className="text-red-500 dark:text-red-400">
            Une erreur est survenue lors du chargement des produits
          </div>
        ) : (
          <ProductList
            products={data?.pages.flatMap((page) => page.data || []) || []}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
      </div>
    </div>
  );
}
