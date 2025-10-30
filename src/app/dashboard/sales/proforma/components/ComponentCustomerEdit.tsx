"use client";

import React, { useState, useEffect } from "react";
import { customerTypes } from "@/constants/customerTypes";
import DropdownSelect from "@/components/ui/DropdownSelect";
import SelectionCustomerWthiCreateNew from "@/components/ui/SelectionCustomerWthiCreateNew";
import { notifySuccess, notifyError } from "@/components/ui/ToastNotification";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { usePatchProformaField } from "@/hooks/apis/useProformas";
import ConfirmationDialog from "./ConfirmationDialog";
import DynamicButton from "@/components/ui/DynamicButton"
import { useRouter } from "next/navigation";

interface ComponentCustomerEditProps {
  visibility: Record<string, boolean>;
  toggleVisibility: (key: string) => void;
  customers: any[];
  onClientSelect: (client: any) => void;
  initialClient: any;
  saleId: string;
}

const ComponentCustomerEdit: React.FC<ComponentCustomerEditProps> = ({
  visibility,
  toggleVisibility,
  customers,
  onClientSelect,
  initialClient,
  saleId,
}) => {
  const { mutate: patchField } = usePatchProformaField();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [clientInfo, setClientInfo] = useState(initialClient);
  const [isAddingClient, setIsAddingClient] = useState(false);
    const router = useRouter();
  const [newClient, setNewClient] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    clientType: "guest",
  });

  useEffect(() => {
    if (initialClient) setClientInfo(initialClient);
  }, [initialClient]);

  // 🔹 Lorsqu'on choisit un client existant ou "create new"
  const handleChange = (selectedOption: any) => {
    const selectedValue = selectedOption ? selectedOption.value : null;
    if (selectedValue === "create-new") {
      setIsAddingClient(true);
      setClientInfo(null);
      onClientSelect(null);
    } else {
      const selectedCustomer = customers.find((c) => c.id === selectedValue);
      setClientInfo(selectedCustomer);
      setIsAddingClient(false);
      onClientSelect(selectedCustomer);
    }
  };

  // 🔹 Lorsqu'on tape dans le formulaire "nouveau client"
  const handleNewClientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (!name) return;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClient = () => {
    if (newClient.firstName.trim() && newClient.phoneNumber.trim()) {
      setClientInfo(newClient);
      onClientSelect(newClient);
      setIsAddingClient(false);
      notifySuccess("✅ Nouveau client ajouté avec succès !");
    } else {
      notifyError("Veuillez remplir tous les champs requis.");
    }
  };

  const handleConfirmation = () => {
    patchField(
      { id: saleId, field: "clientInfo", value: clientInfo },
      {
        onSuccess: () =>{
          
           notifySuccess("Client mis à jour avec succès ✅")
           router.push(`/dashboard/sales/proforma`); 
           }

        ,
        onError: (err: any) => notifyError(err?.message || "Erreur lors de la mise à jour"),
      }
    );
    setConfirmationOpen(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 mb-6 transition-all">
      {/* 🔹 Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Informations du Client</h2>
        <button
          onClick={() => toggleVisibility("clientInfo")}
          className="text-blue-600 hover:text-blue-700 transition"
        >
          {visibility.clientInfo ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {/* 🔹 Contenu */}
      {visibility.clientInfo && (
        <div className="space-y-5">
          {/* Sélecteur client */}
          <SelectionCustomerWthiCreateNew
            placeholderText="Sélectionnez un client"
            optionsData={customers}
            handleSelectionChange={handleChange}
            labelKey1="firstName"
            labelKey2="lastName"
            valueKey="id"
            createNewLabel="➕ Créer un nouveau client"
            selectedValue={clientInfo ? clientInfo.id || "create-new" : ""}
          />

          {/* 🔸 Nouveau client */}
          {isAddingClient ? (
            <div className="space-y-3 border-t pt-4">
              <DropdownSelect
                label="Type de client"
                id="clientType"
                name="clientType"
                options={customerTypes}
                value={newClient.clientType || customerTypes[0]?.value}
                onChange={handleNewClientChange}
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  name="firstName"
                  placeholder="Nom"
                  value={newClient.firstName}
                  onChange={handleNewClientChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
                <input
                  name="lastName"
                  placeholder="Prénom"
                  value={newClient.lastName}
                  onChange={handleNewClientChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>

              <input
                name="address"
                placeholder="Adresse"
                value={newClient.address}
                onChange={handleNewClientChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
              />

              <input
                name="phoneNumber"
                placeholder="Téléphone"
                value={newClient.phoneNumber}
                onChange={handleNewClientChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
              />

              <button
                onClick={handleAddClient}
                disabled={!newClient.firstName.trim() || !newClient.phoneNumber.trim()}
                className={`w-full py-2 rounded-lg font-medium transition-all ${
                  newClient.firstName.trim() && newClient.phoneNumber.trim()
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Ajouter le client
              </button>
            </div>
          ) : (
            clientInfo && (
              <div className="border-t pt-4 text-gray-700 space-y-1">
                <p>
                  <strong>Nom Complet :</strong> {clientInfo.firstName}{" "}
                  {clientInfo.lastName || "N/A"}
                </p>
                <p>
                  <strong>Adresse :</strong> {clientInfo.address || "N/A"}
                </p>
                <p>
                  <strong>Téléphone :</strong> {clientInfo.phoneNumber || "N/A"}
                </p>
              </div>
            )
          )}

          {/* Bouton Confirmer */}
          <div className="pt-4">
            <DynamicButton
              label="Confirmer"
              className="bg-green-600 text-white hover:bg-green-700"
              onConfirm={() => setConfirmationOpen(true)}
              description="Cliquez ici pour confirmer la modification du client."
            />
          </div>
        </div>
      )}

      {/* 🔹 Dialogue de confirmation */}
      <ConfirmationDialog
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={handleConfirmation}
        message="Êtes-vous sûr de vouloir modifier le client ?"
      />
    </div>
  );
};

export default ComponentCustomerEdit;
