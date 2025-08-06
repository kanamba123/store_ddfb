"use client";

import { useProductsFeatured } from "@/hooks/apis/useProducts";
import { useMemo, useState } from "react";
import Image from "next/image";

export default function ProductsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    variantProductName: "",
    sellingPrice: "",
    stock: "",
  });
  const [filterText, setFilterText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useProductsFeatured();

  // Flatten all pages data and extract products
  const allProducts = useMemo(() => {
    return data?.pages.flatMap((page) => page.data || []) || [];
  }, [data]);

  // Get pagination info from last page
  const paginationInfo = useMemo(() => {
    return (
      data?.pages[data.pages.length - 1]?.meta || {
        currentPage: 1,
        totalItems: 0,
        totalPages: 1,
        itemsPerPage: 10,
      }
    );
  }, [data]);

  const openModalForNew = () => {
    setEditingProduct(null);
    setFormData({ variantProductName: "", sellingPrice: "", stock: "" });
    setModalOpen(true);
  };

  const openModalForEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      variantProductName: product.variantProductName,
      sellingPrice: product.recommendedPrice?.toString() || "",
      stock: "0", // You might want to add stock to your product model
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Your submit logic here
    closeModal();
  };

  const filteredProducts = allProducts.filter((product) =>
    product?.variantProductName
      ?.toLowerCase()
      .includes(filterText.toLowerCase())
  );

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredProducts.slice(startIndex, endIndex);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) return <div>Loading products...</div>;
  if (isError) return <div>Error loading products</div>;

  return (
    <div className="space-y-6 p-2 dark:bg-gray-900 dark:text-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Produits ({paginationInfo.totalItems})
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={filterText}
          onChange={handleFilterChange}
          className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
        />

        <button
          onClick={openModalForNew}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition dark:bg-indigo-700 dark:hover:bg-indigo-600"
        >
          + Ajouter un produit
        </button>
      </div>

      {/* Products Table */}
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
                    {product?.recommendedPrice.toFixed(2)} fbu
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      product.isDisplay
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {product.isDisplay ? "Visible" : "Masqué"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openModalForEdit(product)}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                  >
                    Modifier
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

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing page {paginationInfo.currentPage} of{" "}
          {paginationInfo.totalPages}
        </div>
        <div className="flex space-x-2">
          <button
            disabled={paginationInfo.currentPage <= 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50 dark:border-gray-600"
          >
            Previous
          </button>
          <button
            onClick={handleLoadMore}
            disabled={!hasNextPage || isFetchingNextPage}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-700 dark:hover:bg-indigo-600"
          >
            {isFetchingNextPage ? "Loading..." : "Next"}
          </button>
        </div>
      </div>

      {/* Modal (same as before) */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative dark:bg-gray-800 dark:shadow-none dark:border dark:border-gray-700">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="Fermer modal"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-4 dark:text-white">
              {editingProduct ? "Modifier le produit" : "Ajouter un produit"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="variantProductName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Nom du produit
                </label>
                <input
                  id="variantProductName"
                  name="variantProductName"
                  type="text"
                  value={formData.variantProductName}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="sellingPrice"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Prix (€)
                </label>
                <input
                  id="sellingPrice"
                  name="sellingPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition dark:bg-indigo-700 dark:hover:bg-indigo-600"
              >
                {editingProduct
                  ? "Enregistrer les modifications"
                  : "Ajouter produit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
