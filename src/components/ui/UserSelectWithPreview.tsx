import React, { useState } from "react";
import DropdownSelect from "../ui/DropdownSelect";
import { customerTypes } from "../../constants/customerTypes";
import SelectionCustomerWithCreateNew from "./SelectionCustomerWthiCreateNew";

interface Customer {
  id?: string | number;
  firstName: string;
  lastName?: string;
  address?: string;
  phoneNumber?: string;
  clientType?: string;
}

interface UserSelectWithPreviewProps {
  customers: Customer[];
  onClientSelect?: (client: Customer | null) => void;
}

const UserSelectWithPreview: React.FC<UserSelectWithPreviewProps> = ({
  customers,
  onClientSelect,
}) => {
  const [clientInfo, setClientInfo] = useState<Customer | null>(null);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [newClient, setNewClient] = useState<Customer>({
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    clientType: "guest",
  });

  const handleChange = (selectedOption: { label: string; value: string | number } | null) => {
    const selectedValue = selectedOption ? selectedOption.value : null;

    if (selectedValue === "create-new") {
      setIsAddingClient(true);
      setClientInfo(null);
      onClientSelect?.(null);
    } else {
      const selectedCustomer = customers.find((c) => c.id === selectedValue) || null;
      setClientInfo(selectedCustomer);
      setIsAddingClient(false);
      if (selectedCustomer) {
        onClientSelect?.({
          id: selectedCustomer.id,
          firstName: selectedCustomer.firstName,
          lastName: selectedCustomer.lastName,
          address: selectedCustomer.address,
        });
      }
    }
  };

  const handleNewClientChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (!name) return;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClient = () => {
    if (newClient.firstName.trim() && newClient.phoneNumber?.trim()) {
      setClientInfo(newClient);
      onClientSelect?.(newClient);
      setIsAddingClient(false);
    }
  };

  const isFormValid = newClient.firstName.trim() && newClient.phoneNumber?.trim();

  return (
    <div className="space-y-3">
      <SelectionCustomerWithCreateNew
        placeholderText="Sélectionner un client"
        optionsData={customers}
        handleSelectionChange={handleChange}
        labelKey1="firstName"
        labelKey2="lastName"
        valueKey="id"
        createNewLabel="➕ Nouveau client"
        selectedValue={clientInfo?.id || ""}
      />

      {isAddingClient ? (
        <div className="space-y-3 p-3 border border-gray-200 rounded-md bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Type client
              </label>
              <DropdownSelect
                id="clientType"
                name="clientType"
                label=""
                options={customerTypes}
                value={newClient.clientType || customerTypes[0]?.value}
                onChange={handleNewClientChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="Nom"
                value={newClient.firstName}
                onChange={handleNewClientChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Prénom"
                value={newClient.lastName}
                onChange={handleNewClientChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <input
                type="text"
                name="address"
                placeholder="Adresse"
                value={newClient.address}
                onChange={handleNewClientChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Téléphone *
              </label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Téléphone"
                value={newClient.phoneNumber}
                onChange={handleNewClientChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAddClient}
              disabled={!isFormValid}
              className={`px-3 py-2 text-sm rounded font-medium transition-colors ${
                isFormValid
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Ajouter client
            </button>
          </div>
        </div>
      ) : (
        clientInfo && (
          <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">Nom:</span>
                <p className="text-gray-900">
                  {clientInfo.firstName} {clientInfo.lastName || ""}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Adresse:</span>
                <p className="text-gray-900">{clientInfo.address || "N/A"}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Téléphone:</span>
                <p className="text-gray-900">{clientInfo.phoneNumber || "N/A"}</p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default UserSelectWithPreview;