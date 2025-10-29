import React from "react";
import Select from "react-select";

interface SelectionCustomerWithCreateNewProps<T> {
  optionsData: T[];
  handleSelectionChange: (value: any) => void;
  labelKey1: keyof T;
  labelKey2: keyof T;
  valueKey: keyof T;
  placeholderText?: string;
  createNewLabel?: string;
  selectedValue: any;
}

const SelectionCustomerWithCreateNew = <T,>({
  optionsData,
  handleSelectionChange,
  labelKey1,
  labelKey2,
  valueKey,
  placeholderText = "Sélectionner un client",
  createNewLabel = "➕ Nouveau client",
  selectedValue,
}: SelectionCustomerWithCreateNewProps<T>) => {
  // Transformer les données en format Select
  const formattedOptions = optionsData.map((item) => ({
    label: `${item[labelKey1]} ${item[labelKey2] || ""}`.trim(),
    value: item[valueKey],
  }));

  // Ajouter l'option "Créer un nouvel élément"
  const options = [{ label: createNewLabel, value: "create-new" }, ...formattedOptions];

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderRadius: "0.375rem",
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
      padding: "0.1rem",
      minHeight: "38px",
      fontSize: "0.875rem",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
        ? "#e0f2fe"
        : "white",
      color: state.isSelected ? "white" : "#111827",
      cursor: "pointer",
      padding: "0.375rem 0.75rem",
      fontSize: "0.875rem",
    }),
    menu: (base: any) => ({ 
      ...base, 
      borderRadius: "0.375rem", 
      zIndex: 9999,
      fontSize: "0.875rem"
    }),
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
    singleValue: (base: any) => ({ 
      ...base, 
      color: "#111827",
      fontSize: "0.875rem"
    }),
    placeholder: (base: any) => ({
      ...base,
      fontSize: "0.875rem",
      color: "#6b7280"
    }),
    input: (base: any) => ({
      ...base,
      fontSize: "0.875rem"
    }),
  };

  return (
    <div>
      <Select
        options={options}
        value={options.find(option => option.value === selectedValue)}
        onChange={handleSelectionChange}
        placeholder={placeholderText}
        isSearchable
        isClearable
        className="text-sm"
        menuPortalTarget={document.body}
        styles={customStyles}
      />
    </div>
  );
};

export default SelectionCustomerWithCreateNew;