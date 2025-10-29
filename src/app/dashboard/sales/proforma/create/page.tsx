"use client";

import React, { useState } from "react";
import ToastNotification, { notifySuccess, notifyError } from "@/components/ui/ToastNotification";
import { useVariants } from "@/hooks/apis/useVariants";
import { useCreateProforma } from "@/hooks/apis/useProformas";
import { useCustomers } from "@/hooks/apis/useCustomers";
import ComponentProductTemplate, { SelectedProduct, Product } from "@/components/templates/ComponentProductTemplate";
import ComponentPaiementTemplate from "@/components/templates/ComponentPaiementTemplate";
import UserSelectWithPreview from "@/components/ui/UserSelectWithPreview";

interface MainProformaInfo {
  proformaName: string;
  shippingDetails: string;
}

const CreateProformaPage: React.FC = () => {

const { data: rawCustomers = [], isLoading: isCustomersLoading } = useCustomers();
  const { data: variants = [], isLoading, isError } = useVariants();
  const createProforma = useCreateProforma();

  console.log("Customer 1",rawCustomers)

  // 🔁 Transformation pour adapter les données au format du composant UserSelectWithPreview
const customers = rawCustomers.map((c) => ({
  id: c.id,
  firstName: c.firstName,           // ton backend a "name", on le mappe vers "firstName"
  lastName: c.lastName,
  address: c.address || "",
  phoneNumber: c.phoneNumber || "",
  clientType: c.clientType || "guest",
}));

console.log("Customer ",customers)

  const [mainProformaInfo, setMainProformaInfo] = useState<MainProformaInfo>({
    proformaName: "",
    shippingDetails: "",
  });

  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedProducts, setSelectedProducts] = useState<Record<number, SelectedProduct>>({});
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const [selectedStore, setSelectedStore] = useState<any>(null);

  const [visibility, setVisibility] = useState({
    storeInfo: true,
    clientInfo: true,
    productInfo: true,
    paymentInfo: true,
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
      store: selectedStore,
      client: selectedClient,
      mainProformaInfo,
      selectedProducts,
      totalAmount,
      paymentMethod,
      paymentDetails,
    };

    createProforma.mutate(proformaData, {
      onSuccess: () => notifySuccess("Proforma créée avec succès !"),
      onError: (error: any) => notifyError(`Échec de la création du proforma. ${error}`),
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl space-y-6">
      <ToastNotification />

      <h1 className="text-2xl md:text-3xl font-bold text-gray-700">Créer un Proforma</h1>

      {/* Client Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-3 flex justify-between items-center">
          Informations Client
          <button
            onClick={() => toggleVisibility("clientInfo")}
            className="text-gray-500 hover:text-gray-700"
          >
            {visibility.clientInfo ? "▲" : "▼"}
          </button>
        </h2>
        {visibility.clientInfo && (
          <UserSelectWithPreview
            customers={customers}
            onClientSelect={handleClientSelect}
          />
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
