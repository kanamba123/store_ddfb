"use client";

import { useVariantsProductByStore } from "@/hooks/apis/useProducts";
import { useMemo, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function ProductsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    variantProductName: "",
    sellingPrice: "",
    stock: "",
  });
  const [filterText, setFilterText] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { user } = useAuth();
    const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useVariantsProductByStore(user?.store?.id);

  // Detect mobile viewport
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Infinite scroll for mobile
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

  const handleShare = (product) => {
    if (navigator.share && isMobile) {
      // Native sharing on mobile
      navigator.share({
        title: product.variantProductName,
        text: `Découvrez ${product.variantProductName} à ${product.recommendedPrice.toFixed(2)} fbu`,
        // url: window.location.href,
        url: `https://win2cop.com/products/${product.slug}/${product.id}`,
      }).catch(console.error);
    } else {
      // Fallback - copy to clipboard
      const shareText = `${product.variantProductName} - ${product.recommendedPrice.toFixed(2)} fbu\n${window.location.href}`;
      navigator.clipboard.writeText(shareText).then(() => {
        // You can add a toast notification here
        alert('Lien copié dans le presse-papiers !');
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Lien copié dans le presse-papiers !');
      });
    }
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

  // Mobile Card Component
  const ProductCard = ({ product }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2 space-y-3">
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
              {product?.recommendedPrice.toFixed(2)} fbu
            </span>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                product.isDisplay
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
        <button
          onClick={() => openModalForEdit(product)}
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
        </button>
        <button
          onClick={() => handleShare(product)}
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
        <button className="flex-1 bg-red-50 text-red-600 py-2 px-3 rounded-md text-sm font-medium hover:bg-red-100 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900/70 transition-colors flex items-center justify-center">
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

  return (

     
    <div className="space-y-6 p-2 dark:bg-gray-900 dark:text-gray-200">
     
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={filterText}
          onChange={handleFilterChange}
          className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
        />

        {/* Bouton d'ajout - visible uniquement sur desktop */}
        <button
          onClick={openModalForNew}
          className="hidden md:block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition dark:bg-indigo-700 dark:hover:bg-indigo-600"
        >
          + Ajouter un produit
        </button>
      </div>

      {/* Vue Mobile (Cards) - visible uniquement sur mobile */}
      <div className="block md:hidden">
        <div className="space-y-4 pb-24">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          
          {/* Loading indicator pour scroll infini */}
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
                    <button
                      onClick={() => handleShare(product)}
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

      {/* Pagination Controls - visible uniquement sur desktop */}
      <div className="hidden md:flex items-center justify-between mt-4">
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

      {/* FloatingActionButton - visible uniquement sur mobile */}
      <button
        onClick={openModalForNew}
        className="md:hidden fixed bottom-8 right-6 w-16 h-16 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-200 flex items-center justify-center z-50 border-4 border-white dark:border-gray-900"
        aria-label="Ajouter un produit"
        style={{ 
          position: 'fixed',
          bottom: '32px',
          right: '24px'
        }}
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative dark:bg-gray-800 dark:shadow-none dark:border dark:border-gray-700 max-h-[90vh] overflow-y-auto">
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