"use client";

import DropdownSelect from "@/components/ui/DropdownSelect";
import ProductSelect from "@/components/ui/ProductSelect";
import { variantTypes } from "@/constants/variantTypes";
import React, { useState, useEffect, useCallback } from "react";

export interface Product {
  id: number;
  variantProductName: string;
  variantType?: string;
  purchasePrice: number;
  sellingPrice?: number;
}

export interface SelectedProduct {
  id: number;
  name: string;
  variantType: string;
  quantity: number;
  purchasePrice: number;
  price: number;
  total: number;
  evaluateSale: number;
  isPriceModified: boolean;
  isCustom: boolean;
}

interface ComponentProductTemplateProps {
  variantesProducts: Product[];
  visibility: { productInfo: boolean };
  toggleVisibility: (key: "productInfo" | "paymentInfo" | "clientInfo" | "storeInfo" | "proformaInfo") => void;
  isLoading?: boolean;
  isError?: boolean;
  sendToBackend: (products: Record<number, SelectedProduct>) => void;
  setTotalAmount?: (total: number) => void; // Rendre optionnel
}

const ComponentProductTemplate: React.FC<ComponentProductTemplateProps> = ({
  variantesProducts,
  visibility,
  toggleVisibility,
  isLoading = false,
  isError = false,
  sendToBackend,
  setTotalAmount, // Maintenant optionnel
}) => {
  const [selectedProducts, setSelectedProducts] = useState<Record<number, SelectedProduct>>({});
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customProductName, setCustomProductName] = useState("");
  const [customProductPrice, setCustomProductPrice] = useState("");
  const [customProductQuantity, setCustomProductQuantity] = useState("");
  const [variantType, setVariantType] = useState("product");
  const [total, setTotal] = useState(0);

  // Calcul total avec gestion d'erreur
  const calculateTotals = useCallback(() => {
    const subtotal = Object.values(selectedProducts).reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    setTotal(subtotal);
    
    // Vérifier que setTotalAmount existe et est une fonction avant de l'appeler
    if (setTotalAmount && typeof setTotalAmount === 'function') {
      setTotalAmount(subtotal);
    } else {
      console.warn('setTotalAmount is not available or not a function');
    }
  }, [selectedProducts, setTotalAmount]);

  useEffect(() => {
    calculateTotals();
    sendToBackend(selectedProducts);
  }, [selectedProducts, calculateTotals, sendToBackend]);

  const handleProductChange = (id: number, quantity: number) => {
    const product = selectedProducts[id];
    const variant = variantesProducts.find((p) => p.id === id);
    if (!product || !variant) return;

    const newQuantity = quantity < 0 ? 0 : quantity;
    const newPrice = product.isPriceModified ? product.price : variant.sellingPrice || variant.purchasePrice;
    
    setSelectedProducts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        quantity: newQuantity,
        price: newPrice,
        total: newPrice * newQuantity,
      },
    }));
  };

  const handlePriceChange = (id: number, price: number) => {
    const newPrice = price < 0 ? 0 : price;
    setSelectedProducts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        price: newPrice,
        total: newPrice * prev[id].quantity,
        isPriceModified: true,
      },
    }));
  };

  const handleRemoveProduct = (id: number) => {
    setSelectedProducts((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleAddCustomProduct = () => {
    if (!customProductName.trim() || isNaN(Number(customProductPrice)) || isNaN(Number(customProductQuantity))) {
      return;
    }

    const id = Date.now();
    const price = Number(customProductPrice);
    const quantity = Number(customProductQuantity);

    const newProduct: SelectedProduct = {
      id,
      name: customProductName.trim(),
      variantType: variantType,
      quantity: quantity,
      purchasePrice: 0,
      price: price,
      total: price * quantity,
      evaluateSale: price,
      isPriceModified: true,
      isCustom: true,
    };

    setSelectedProducts((prev) => ({ ...prev, [id]: newProduct }));
    setShowCustomModal(false);
    setCustomProductName("");
    setCustomProductPrice("");
    setCustomProductQuantity("");
    setVariantType("product");
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("fr-FR", {
      style: "currency",
      currency: "FBU",
      minimumFractionDigits: 0,
    });
  };

  const isCustomProductValid = customProductName.trim() && 
                              !isNaN(Number(customProductPrice)) && 
                              Number(customProductPrice) >= 0 &&
                              !isNaN(Number(customProductQuantity)) && 
                              Number(customProductQuantity) > 0;

  return (
    <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden mb-6">
      {/* Header amélioré */}
      <div 
        className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
        onClick={() => toggleVisibility("productInfo")}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h5 className="text-xl font-semibold text-gray-800">Informations sur les Produits</h5>
            <p className="text-sm text-gray-600 mt-1">
              {Object.keys(selectedProducts).length} produit(s) sélectionné(s)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {total > 0 && (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {formatCurrency(total)}
            </span>
          )}
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors">
            {visibility.productInfo ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {visibility.productInfo && (
        <div className="p-6">
          {/* Section de sélection des produits */}
          <div className="flex flex-col lg:flex-row lg:items-end gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner un produit
              </label>
              <ProductSelect
                variantesProducts={variantesProducts.map((p) => ({
                  id: p.id,
                  variantProductName: p.variantProductName,
                  purchasePrice: p.purchasePrice,
                  variantType: p.variantType || "product",
                  sellingPrice: p.sellingPrice,
                }))}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                isLoading={isLoading}
              />
            </div>
            
            <div className="text-gray-400 text-sm">ou</div>
            
            <button
              className="flex items-center gap-2 bg-white text-blue-600 px-4 py-3 rounded-lg border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 font-medium shadow-sm"
              onClick={() => setShowCustomModal(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Produit personnalisé
            </button>
          </div>

          {/* Modal produit personnalisé amélioré */}
          {showCustomModal && (
            <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Nouveau produit personnalisé</h3>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du produit *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Installation logicielle"
                      value={customProductName}
                      onChange={(e) => setCustomProductName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      autoFocus
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix (FBU) *
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={customProductPrice}
                        onChange={(e) => setCustomProductPrice(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantité *
                      </label>
                      <input
                        type="number"
                        placeholder="1"
                        value={customProductQuantity}
                        onChange={(e) => setCustomProductQuantity(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        min="1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de produit
                    </label>
                    <DropdownSelect
                      id="variantType"
                      name="variantType"
                      label=""
                      options={variantTypes}
                      value={{ label: variantType, value: variantType }}
                      onChange={(e: any) => setVariantType(e.value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                  <button
                    className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium"
                    onClick={() => setShowCustomModal(false)}
                  >
                    Annuler
                  </button>
                  <button
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      isCustomProductValid
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={handleAddCustomProduct}
                    disabled={!isCustomProductValid}
                  >
                    Ajouter le produit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table des produits améliorée */}
          {Object.keys(selectedProducts).length > 0 ? (
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Produit
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Quantité
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Prix unitaire
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.keys(selectedProducts).map((idKey, idx) => {
                      const id = Number(idKey);
                      const product = selectedProducts[id];
                      return (
                        <tr key={id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {product.isCustom && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                  Personnalisé
                                </span>
                              )}
                              <div>
                                <div className="font-medium text-gray-900">{product.name}</div>
                                <div className="text-sm text-gray-500 capitalize">{product.variantType}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-600 hover:text-gray-800"
                                onClick={() => handleProductChange(id, product.quantity - 1)}
                                disabled={product.quantity <= 1}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <input
                                type="number"
                                value={product.quantity}
                                onChange={(e) => handleProductChange(id, parseInt(e.target.value) || 1)}
                                className="w-16 text-center border border-gray-300 rounded-lg py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="1"
                              />
                              <button
                                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-600 hover:text-gray-800"
                                onClick={() => handleProductChange(id, product.quantity + 1)}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <input
                              type="number"
                              value={product.price}
                              onChange={(e) => handlePriceChange(id, parseFloat(e.target.value) || 0)}
                              className="w-24 text-right border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              min="0"
                              step="0.01"
                            />
                          </td>
                          <td className="px-6 py-4 text-right font-semibold text-gray-900">
                            {formatCurrency(product.total)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors hover:text-red-700"
                              onClick={() => handleRemoveProduct(id)}
                              title="Supprimer le produit"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Total général amélioré */}
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">Total général</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* État vide */
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit sélectionné</h3>
              <p className="text-gray-600 mb-4">Commencez par ajouter des produits à votre commande</p>
              <button
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={() => setShowCustomModal(true)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter votre premier produit
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComponentProductTemplate;