"use client";

import React, { useState, useEffect, useCallback } from "react";
import ProductSelect from "../ui/ProductSelect";
import DropdownSelect from "../ui/DropdownSelect";
import { variantTypes } from "../../constants/variantTypes";

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
  setTotalAmount: (total: number) => void;
}

const ComponentProductTemplate: React.FC<ComponentProductTemplateProps> = ({
  variantesProducts,
  visibility,
  toggleVisibility,
  isLoading = false,
  isError = false,
  sendToBackend,
  setTotalAmount,
}) => {
  const [selectedProducts, setSelectedProducts] = useState<Record<number, SelectedProduct>>({});
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customProductName, setCustomProductName] = useState("");
  const [customProductPrice, setCustomProductPrice] = useState("");
  const [customProductQuantity, setCustomProductQuantity] = useState("");
  const [variantType, setVariantType] = useState("product");
  const [total, setTotal] = useState(0);

  // Calcul total
  const calculateTotals = useCallback(() => {
    const subtotal = Object.values(selectedProducts).reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    setTotal(subtotal);
    setTotalAmount(subtotal);
  }, [selectedProducts, setTotalAmount]);

  useEffect(() => {
    calculateTotals();
    sendToBackend(selectedProducts);
  }, [selectedProducts, calculateTotals, sendToBackend]);

  const handleProductChange = (id: number, quantity: number) => {
    const product = selectedProducts[id];
    const variant = variantesProducts.find((p) => p.id === id);
    if (!product || !variant) return;

    setSelectedProducts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        quantity: quantity < 0 ? 0 : quantity,
        price: prev[id].isPriceModified ? prev[id].price : variant.sellingPrice || variant.purchasePrice,
        total: (prev[id].isPriceModified ? prev[id].price : variant.sellingPrice || variant.purchasePrice) * (quantity < 0 ? 0 : quantity),
      },
    }));
  };

  const handlePriceChange = (id: number, price: number) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        price: price < 0 ? 0 : price,
        total: (price < 0 ? 0 : price) * prev[id].quantity,
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
    if (!customProductName || isNaN(Number(customProductPrice)) || isNaN(Number(customProductQuantity))) return;

    const id = Date.now();
    const newProduct: SelectedProduct = {
      id,
      name: customProductName,
      variantType: variantType,
      quantity: Number(customProductQuantity),
      purchasePrice: 0,
      price: Number(customProductPrice),
      total: Number(customProductPrice) * Number(customProductQuantity),
      evaluateSale: Number(customProductPrice),
      isPriceModified: true,
      isCustom: true,
    };

    setSelectedProducts((prev) => ({ ...prev, [id]: newProduct }));
    setShowCustomModal(false);
    setCustomProductName("");
    setCustomProductPrice("");
    setCustomProductQuantity("");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-lg font-semibold text-gray-700">Informations sur les Produits</h5>
        <button
          className="text-gray-500 hover:text-gray-700 font-bold text-lg"
          onClick={() => toggleVisibility("productInfo")}
        >
          {visibility.productInfo ? "▲" : "▼"}
        </button>
      </div>

      {visibility.productInfo && (
        <>
          {/* Sélection des produits */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
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
            <button
              className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition"
              onClick={() => setShowCustomModal(true)}
            >
              + Ajouter produit personnalisé
            </button>
          </div>

          {/* Modal produit personnalisé */}
          {showCustomModal && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Produit personnalisé</h3>
                <input
                  type="text"
                  placeholder="Nom du produit"
                  value={customProductName}
                  onChange={(e) => setCustomProductName(e.target.value)}
                  className="w-full mb-2 p-2 border border-gray-300 rounded"
                />
                <input
                  type="number"
                  placeholder="Prix"
                  value={customProductPrice}
                  onChange={(e) => setCustomProductPrice(e.target.value)}
                  className="w-full mb-2 p-2 border border-gray-300 rounded"
                />
                <input
                  type="number"
                  placeholder="Quantité"
                  value={customProductQuantity}
                  onChange={(e) => setCustomProductQuantity(e.target.value)}
                  className="w-full mb-2 p-2 border border-gray-300 rounded"
                />
                <DropdownSelect
                  id="variantType"
                  name="variantType"
                  label="Type"
                  options={variantTypes}
                  value={{ label: variantType, value: variantType }}
                  onChange={(e: any) => setVariantType(e.value)}
                />
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="px-3 py-1.5 bg-gray-300 rounded hover:bg-gray-400 transition"
                    onClick={() => setShowCustomModal(false)}
                  >
                    Annuler
                  </button>
                  <button
                    className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    onClick={handleAddCustomProduct}
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table des produits */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">Produit</th>
                  <th className="p-2">Quantité</th>
                  <th className="p-2">Prix unitaire</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(selectedProducts).map((idKey, idx) => {
                  const id = Number(idKey);
                  const product = selectedProducts[id];
                  return (
                    <tr key={id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-2">{idx + 1}</td>
                      <td className="p-2">{product.name}</td>
                      <td className="p-2 flex items-center justify-center gap-1">
                        <button
                          className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                          onClick={() => handleProductChange(id, product.quantity - 1)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={product.quantity}
                          onChange={(e) => handleProductChange(id, parseInt(e.target.value))}
                          className="w-12 text-center border border-gray-300 rounded"
                        />
                        <button
                          className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                          onClick={() => handleProductChange(id, product.quantity + 1)}
                        >
                          +
                        </button>
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) => handlePriceChange(id, parseFloat(e.target.value))}
                          className="w-20 text-center border border-gray-300 rounded"
                        />
                      </td>
                      <td className="p-2">
                        {product.total.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "FBU",
                        })}
                      </td>
                      <td className="p-2">
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveProduct(id)}
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Total général */}
          <div className="flex justify-end mt-4 text-lg font-semibold">
            <span>Total :</span>
            <span className="ml-2 text-green-600">
              {total.toLocaleString("fr-FR", { style: "currency", currency: "FBU" })}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default ComponentProductTemplate;
