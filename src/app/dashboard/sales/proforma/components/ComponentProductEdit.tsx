"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaPlus, FaMinus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import ProductSelect from "@/components/ui/ProductSelect";
import DropdownSelect from "@/components/ui/DropdownSelect";
import { variantTypes } from "@/constants/variantTypes";
import ConfirmationDialog from "./ConfirmationDialog";
import DynamicButton from "@/components/ui/DynamicButton";
import { usePatchProformaField } from "@/hooks/apis/useProformas";
import { useRouter } from "next/navigation";

interface ComponentProductEditProps {
  variantesProducts: any[];
  visibility: Record<string, boolean>;
  toggleVisibility: (key: string) => void;
  setVariantProduct: (products: any) => void;
  isLoading?: boolean;
  isError?: boolean;
  sendToBackend: (data: any[]) => void;
  initialProducts?: Record<string, any> | any[];
  proformaId: string;
}

const ComponentProductEdit: React.FC<ComponentProductEditProps> = ({
  variantesProducts,
  visibility,
  toggleVisibility,
  isLoading = false,
  isError = false,
  sendToBackend,
  initialProducts = [],
  proformaId,
}) => {
  const { mutate: patchField } = usePatchProformaField();

  // Convertir initialProducts en tableau
  const productsArray = useMemo(() => {
    if (!initialProducts) return [];
    return Array.isArray(initialProducts) ? initialProducts : Object.values(initialProducts);
  }, [initialProducts]);

  const [selectedProducts, setSelectedProducts] = useState<Record<string, any>>({});
  const [validatedProducts, setValidatedProducts] = useState<Record<string, boolean>>({});
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [customProductOpen, setCustomProductOpen] = useState(false);
  const router = useRouter();
  const [customProduct, setCustomProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    variantType: "Non classé",
  });

  // Initialisation des produits
  useEffect(() => {
    if (productsArray.length) {
      const initSelected: Record<string, any> = {};
      const initValidated: Record<string, boolean> = {};

      productsArray.forEach((p) => {
        initSelected[p.id] = {
          id: p.id,
          name: p.name,
          variantType: p.variantType || "Non classé",
          quantity: p.quantity,
          price: p.price,
          total: p.total,
          isCustom: p.isCustom || false,
        };
        initValidated[p.id] = true;
      });

      setSelectedProducts(initSelected);
      setValidatedProducts(initValidated);
    }
  }, [productsArray]);

  // Mettre à jour le backend uniquement à la confirmation
  const handleConfirmation = () => {
    const backendProducts = Object.values(selectedProducts)
      .filter((p) => validatedProducts[p.id])
      .map((p) => ({
        id: p.id,
        name: p.name,
        variantType: p.variantType,
        quantity: p.quantity,
        price: p.price,
        total: p.price * p.quantity,
        isCustom: p.isCustom || false,
      }));

    sendToBackend(backendProducts);
    patchField(
      { id: proformaId, field: "items", value: backendProducts },
      {
        onSuccess: () => {
          router.push(`/dashboard/sales/proforma`);

        },
        onError: (err) => console.error(err)
      }
    );
  };

  const handleProductChange = (id: string, quantity: number) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [id]: { ...prev[id], quantity, total: quantity * (prev[id].price || 0) },
    }));
  };

  const handlePriceChange = (id: string, price: number) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [id]: { ...prev[id], price, total: price * (prev[id].quantity || 0) },
    }));
  };

  const toggleValidation = (id: string) =>
    setValidatedProducts((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleAddCustomProduct = () => {
    const { name, price, quantity, variantType } = customProduct;
    if (!name.trim() || !price || !quantity) return;

    const newId = Date.now().toString();
    setSelectedProducts((prev) => ({
      ...prev,
      [newId]: {
        id: newId,
        name,
        variantType,
        quantity: Number(quantity),
        price: Number(price),
        total: Number(price) * Number(quantity),
        isCustom: true,
      },
    }));
    setCustomProductOpen(false);
    setCustomProduct({ name: "", price: "", quantity: "", variantType: "Non classé" });
  };

  const handleRemoveProduct = (id: string) => {
    setSelectedProducts((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Informations sur les Produits</h2>
        <button onClick={() => toggleVisibility("productInfo")} className="text-gray-600">
          {visibility.productInfo ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {visibility.productInfo && (
        <>
          <div className="flex items-center gap-3">
            <ProductSelect
              variantesProducts={variantesProducts}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              isLoading={isLoading}
              isError={isError} // optionnel
            />
            <button onClick={() => setCustomProductOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg">
              <FaPlus />
            </button>
          </div>

          {customProductOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <motion.div className="bg-white p-6 rounded-xl shadow-xl w-96" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                <h3 className="text-lg font-semibold mb-4">Ajouter un produit personnalisé</h3>
                <input className="w-full border rounded-lg px-3 py-2 mb-3" placeholder="Nom du produit" value={customProduct.name} onChange={(e) => setCustomProduct({ ...customProduct, name: e.target.value })} />
                <input className="w-full border rounded-lg px-3 py-2 mb-3" placeholder="Prix" type="number" value={customProduct.price} onChange={(e) => setCustomProduct({ ...customProduct, price: e.target.value })} />
                <input className="w-full border rounded-lg px-3 py-2 mb-3" placeholder="Quantité" type="number" value={customProduct.quantity} onChange={(e) => setCustomProduct({ ...customProduct, quantity: e.target.value })} />
                <DropdownSelect label="Type de variante" name="variantType" id="variantType" options={variantTypes} value={customProduct.variantType} onChange={(e: any) => setCustomProduct({ ...customProduct, variantType: e.target.value })} />

                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={() => setCustomProductOpen(false)} className="px-4 py-2 border rounded-lg text-gray-700">Annuler</button>
                  <button onClick={handleAddCustomProduct} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Ajouter</button>
                </div>
              </motion.div>
            </div>
          )}

          <div className="overflow-x-auto mt-6 border rounded-xl">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-800 uppercase font-semibold">
                <tr>
                  <th className="p-2 text-center">✓</th>
                  <th className="p-2 text-left">Produit</th>
                  <th className="p-2 text-left">Catégorie</th>
                  <th className="p-2 text-center">Quantité</th>
                  <th className="p-2 text-center">Prix</th>
                  <th className="p-2 text-right">Total</th>
                  <th className="p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(selectedProducts).map((product: any) => (
                  <tr key={product.id} className="border-t">
                    <td className="text-center">
                      <input type="checkbox" checked={!!validatedProducts[product.id]} onChange={() => toggleValidation(product.id)} className="accent-green-600" />
                    </td>
                    <td className="p-2 font-medium">{product.name}</td>
                    <td className="p-2">{product.variantType}</td>
                    <td className="p-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleProductChange(product.id, Math.max(0, product.quantity - 1))} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"><FaMinus /></button>
                        <input type="number" className="w-16 text-center border rounded-md p-1" value={product.quantity} onChange={(e) => handleProductChange(product.id, Number(e.target.value))} />
                        <button onClick={() => handleProductChange(product.id, product.quantity + 1)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"><FaPlus /></button>
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <input type="number" className="w-24 text-center border rounded-md p-1" value={product.price} onChange={(e) => handlePriceChange(product.id, Number(e.target.value))} />
                    </td>
                    <td className="p-2 text-right font-semibold">{(product.total || 0).toLocaleString("fr-FR")} FBU</td>
                    <td className="p-2 text-center">
                      <button onClick={() => handleRemoveProduct(product.id)} className="text-red-600 hover:text-red-800">Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <DynamicButton label="Confirmer" className="bg-green-600 text-white hover:bg-green-700" onConfirm={() => setConfirmationOpen(true)} description="Cliquez ici pour confirmer la modification des articles." />
          </div>

          <ConfirmationDialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)} onConfirm={handleConfirmation} message="Êtes-vous sûr de vouloir modifier les articles ?" />
        </>
      )}
    </div>
  );
};

export default ComponentProductEdit;
