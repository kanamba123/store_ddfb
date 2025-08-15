"use client";

import { useVariantsProductByStore } from "@/hooks/apis/useProducts";
import { useAuth } from "@/contexts/AuthContext";
import { VariantsProduct } from "@/types/VariantsProduct";
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
    <div className="space-y-6 p-2 dark:bg-gray-900 dark:text-gray-200">
      <div className="flex justify-end mb-4">
        <Link
          href="/dashboard/products/create"
          className="bg-indigo-600 text-white px-4 py-1 rounded-md hover:bg-indigo-700 transition dark:bg-indigo-700 dark:hover:bg-indigo-600"
        >
          + Ajouter un produit
        </Link>
      </div>

      {isLoading ? (<div>Loading products...</div>) : isError ? (<div>Error loading products</div>) : (
        <ProductList
          products={data?.pages.flatMap(page => page.data || []) || []}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )
      }

    </div>
  );
}