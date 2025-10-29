import React, { useState, ChangeEvent } from "react";
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

  const handleNewClientChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  return (
    <div className="mt-4">
      <SelectionCustomerWithCreateNew
        placeholderText="Sélectionner un client"
        optionsData={customers}
        handleSelectionChange={handleChange}
        labelKey1="firstName"
        labelKey2="lastName"
        valueKey="id"
        createNewLabel="➕ Créer un nouveau client"
        selectedValue={clientInfo?.id || ""}
      />

      {isAddingClient ? (
        <div className="mt-4 space-y-3">
          <DropdownSelect
            label="Client Type"
            id="clientType"
            name="clientType"
            options={customerTypes}
            value={newClient.clientType || customerTypes[0]?.value}
            onChange={handleNewClientChange}
          />

          <div className="form-custom-row">
            <div className="form-custom-group">
              <input
                type="text"
                name="firstName"
                placeholder="Nom"
                value={newClient.firstName}
                onChange={handleNewClientChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div className="form-custom-group">
              <input
                type="text"
                name="lastName"
                placeholder="Prénom"
                value={newClient.lastName}
                onChange={handleNewClientChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>

          <div className="form-custom-row">
            <div className="form-custom-group">
              <input
                type="text"
                name="address"
                placeholder="Adresse"
                value={newClient.address}
                onChange={handleNewClientChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div className="form-custom-group">
              <input
                type="text"
                name="phoneNumber"
                placeholder="Téléphone"
                value={newClient.phoneNumber}
                onChange={handleNewClientChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <button
              onClick={handleAddClient}
              disabled={!newClient.firstName.trim() || !newClient.phoneNumber?.trim()}
              className="btn btn-submit"
            >
              Ajouter le client
            </button>
          </div>
        </div>
      ) : (
        clientInfo && (
          <div className="bg-gray-100 p-3 rounded-md">
            <p>
              <strong>Nom Complet:</strong> {clientInfo.firstName}{" "}
              {clientInfo.lastName || "N/A"}
            </p>
            <p>
              <strong>Adresse:</strong> {clientInfo.address || "N/A"}
            </p>
            <p>
              <strong>Téléphone:</strong> {clientInfo.phoneNumber || "N/A"}
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default UserSelectWithPreview;
