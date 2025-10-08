"use client";

import {  useVariantsProductByStoreDeleted } from "@/hooks/apis/useProducts";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import ProductList from "./ProductList";
import FullScreenLoaderMain from "@/components/ui/FullScreenLoaderMain";
import { useTranslation } from "react-i18next";

export default function ProductsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useVariantsProductByStoreDeleted(Number(user?.store?.id));

  return (
    <div className="min-h-screen  space-y-6 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors duration-200">

      <div className="flex justify-end m-2">
        <Link
          href="/dashboard/products/create"
          className="px-3 py-2 rounded-md font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] transition-colors duration-200 dark:bg-[var(--color-primary-dark)] dark:hover:bg-[var(--color-primary)]"
        >
          {t("products.addProduct")}
        </Link>
      </div>

      {/* Liste des produits */}
      <div className="space-y-4">
        {isLoading ? (
          <FullScreenLoaderMain message={t("products.loading")} />
        ) : isError ? (
          <div className="text-red-500 dark:text-red-400">
            {t("products.loadError")}
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
