import React from "react";
import Select, { SingleValue, MultiValue } from "react-select";

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
  createNewLabel = "Créer un nouveau client",
  selectedValue,
}: SelectionCustomerWithCreateNewProps<T>) => {
  // Transformer les données en format Select
  const formattedOptions = optionsData.map((item) => ({
    label: `${item[labelKey2]} ${item[labelKey1]}`,
    value: item[valueKey],
  }));

  // Ajouter l'option "Créer un nouvel élément"
  const options = [{ label: createNewLabel, value: "create-new" }, ...formattedOptions];

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderRadius: "0.5rem",
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
      padding: "0.1rem",
      minHeight: "40px",
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
      padding: "0.5rem 1rem",
    }),
    menu: (base: any) => ({ ...base, borderRadius: "0.5rem", zIndex: 9999 }),
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
    singleValue: (base: any) => ({ ...base, color: "#111827" }),
    multiValue: (base: any) => ({ ...base, backgroundColor: "#bfdbfe", borderRadius: "0.375rem" }),
    multiValueLabel: (base: any) => ({ ...base, color: "#1e3a8a" }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: "#1e3a8a",
      cursor: "pointer",
      ":hover": { backgroundColor: "#3b82f6", color: "white" },
    }),
  };

  return (
    <div className="mb-3">
      <Select
        options={options}
        value={selectedValue}
        onChange={handleSelectionChange}
        placeholder={placeholderText}
        isSearchable
        isClearable
        className="w-full text-sm"
        menuPortalTarget={document.body}
        styles={customStyles}
      />
    </div>
  );
};

export default SelectionCustomerWithCreateNew;
