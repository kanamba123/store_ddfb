"use client";

import React, { useState } from "react";
import ToastNotification, { notifySuccess, notifyError } from "@/components/ui/ToastNotification";
import { useVariants } from "@/hooks/apis/useVariants";
import { useCreateProforma } from "@/hooks/apis/useProformas";
import { useCustomers } from "@/hooks/apis/useCustomers";
import ComponentProductTemplate, { SelectedProduct, Product } from "@/components/templates/ComponentProductTemplate";
import ComponentPaiementTemplate from "@/components/templates/ComponentPaiementTemplate";
import UserSelectWithPreview from "@/components/ui/UserSelectWithPreview";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
interface MainProformaInfo {
  proformaName: string;
  shippingDetails: string;
}

const CreateProformaPage: React.FC = () => {

  const { data: rawCustomers = [], isLoading: isCustomersLoading } = useCustomers();
  const { data: variants = [], isLoading, isError } = useVariants();
  const createProforma = useCreateProforma();
  const { user } = useAuth();
  const router =useRouter();

  console.log("Customer 1", rawCustomers)

  // 🔁 Transformation pour adapter les données au format du composant UserSelectWithPreview
  const customers = rawCustomers.map((c) => ({
    id: c.id,
    firstName: c.firstName,           // ton backend a "name", on le mappe vers "firstName"
    lastName: c.lastName,
    address: c.address || "",
    phoneNumber: c.phoneNumber || "",
    clientType: c.clientType || "guest",
  }));

  const [mainProformaInfo, setMainProformaInfo] = useState<MainProformaInfo>({
    proformaName: "",
    shippingDetails: "",
  });

  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedProducts, setSelectedProducts] = useState<Record<number, SelectedProduct>>({});
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [paymentDetails, setPaymentDetails] = useState<any>({});

  const [visibility, setVisibility] = useState({
    storeInfo: true,
    clientInfo: true,
    productInfo: true,
    paymentInfo: false,
    proformaInfo: true,
  });

  const toggleVisibility = (section: keyof typeof visibility) => {
    setVisibility(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
  };

  const handleSaveProducts = (products: Record<number, SelectedProduct>) => {
    setSelectedProducts(products);
  };

  const handleSubmitProforma = () => {
    if (!selectedClient) {
      notifyError("Veuillez sélectionner un client.");
      return;
    }

    if (Object.keys(selectedProducts).length === 0) {
      notifyError("Veuillez sélectionner au moins un produit.");
      return;
    }

    const proformaData = {
      store: user?.store.id,
      client: selectedClient,
      mainProformaInfo,
      selectedProducts,
      totalAmount,
      paymentMethod,
      paymentDetails,
    };

    createProforma.mutate(proformaData, {
      onSuccess: () =>{
         router.push("/dashboard/sales/proforma")
         notifySuccess("Proforma créée avec succès !")
      }
         ,
      onError: (error: any) => notifyError(`Échec de la création du proforma. ${error}`),
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl space-y-6">
      <ToastNotification />

      <h1 className="text-2xl md:text-3xl font-bold text-gray-700">Créer un Proforma</h1>

      {/* Client Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
        {/* Header cohérent avec les autres composants */}
        <div
          className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => toggleVisibility("clientInfo")}
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-md">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-gray-800">Client</h5>
              <p className="text-xs text-gray-600">Informations du client</p>
            </div>
          </div>
          <button className="p-1 text-gray-500 hover:text-gray-700 rounded transition-colors">
            {visibility.clientInfo ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        </div>

        {/* Contenu */}
        {visibility.clientInfo && (
          <div className="p-3">
            <UserSelectWithPreview
              customers={customers}
              onClientSelect={handleClientSelect}
            />
          </div>
        )}
      </div>

      {/* Products Section */}
      <ComponentProductTemplate
        variantesProducts={variants as Product[]}
        isLoading={isLoading}
        isError={isError}
        visibility={visibility}
        toggleVisibility={toggleVisibility}
        sendToBackend={handleSaveProducts}
        setTotalAmount={setTotalAmount}
      />

      {/* Payment Section */}
      <ComponentPaiementTemplate
        visibility={visibility}
        toggleVisibility={toggleVisibility}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        paymentDetails={paymentDetails}
        setPaymentDetails={setPaymentDetails}
        totalPayment={totalAmount}
      />

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmitProforma}
          className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Valider le Proforma
        </button>
      </div>
    </div>
  );
};

export default CreateProformaPage;
