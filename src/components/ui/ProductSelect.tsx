"use client";

import React, { useMemo, useRef } from "react";
import Select, { components, MultiValue } from "react-select";

interface Product {
  id: number;
  variantProductName: string;
  variantType?: string;
  purchasePrice: number;
  sellingPrice?: number;
}

interface SelectedProduct {
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

interface ProductSelectProps {
  variantesProducts: Product[];
  selectedProducts: Record<number, SelectedProduct>;
  setSelectedProducts: React.Dispatch<
    React.SetStateAction<Record<number, SelectedProduct>>
  >;
  isLoading?: boolean;
}

const CustomOption = (props: any) => {
  const { data, isSelected, innerRef, innerProps, selectOption, setValue } = props;

  const handleChange = () => {
    if (isSelected) selectOption(props);
    else setValue(props);
  };

  return (
    <components.Option {...props} ref={innerRef} {...innerProps} className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleChange}
        className="w-4 h-4 text-blue-600 rounded"
      />
      <span className="text-gray-700">{data.label}</span>
    </components.Option>
  );
};

const CustomLoadingIndicator = (props: any) => (
  <components.LoadingIndicator {...props}>
    <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 50 50">
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="90,150"
      />
    </svg>
  </components.LoadingIndicator>
);

const ProductSelect: React.FC<ProductSelectProps> = ({
  variantesProducts,
  selectedProducts,
  setSelectedProducts,
  isLoading = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const options = useMemo(
    () =>
      variantesProducts.map((p) => ({
        value: p.id,
        label: `${p.variantProductName} - $${p.purchasePrice.toFixed(2)}`,
      })),
    [variantesProducts]
  );

  const handleChange = (selectedOptions: MultiValue<any>) => {
    const selectedIds = selectedOptions.map((opt) => opt.value);

    setSelectedProducts((prev) => {
      const updated: Record<number, SelectedProduct> = { ...prev };
      selectedIds.forEach((id) => {
        if (!updated[id]) {
          const variant = variantesProducts.find((p) => p.id === id);
          updated[id] = {
            id,
            name: variant?.variantProductName || "Sans nom",
            variantType: variant?.variantType || "Non classé",
            quantity: 1,
            purchasePrice: variant?.purchasePrice || 0,
            price: variant?.sellingPrice || 0,
            total: variant?.sellingPrice || 0,
            evaluateSale: (variant?.sellingPrice || 0) - (variant?.purchasePrice || 0),
            isPriceModified: false,
            isCustom: false,
          };
        }
      });
      return updated;
    });
  };

  return (
    <div ref={containerRef} className="w-full max-w-md">
      <Select
        isMulti
        options={options}
        value={options.filter((opt) => selectedProducts[opt.value])}
        onChange={handleChange}
        isLoading={isLoading}
        loadingMessage={() =>
          variantesProducts.length === 0 ? <span className="text-blue-600">Chargement des produits...</span> : null
        }
        components={{
          Option: (props) => <CustomOption {...props} selectOption={props.selectOption} setValue={props.setValue} />,
          LoadingIndicator: CustomLoadingIndicator,
        }}
        placeholder="Sélectionner des produits"
        closeMenuOnSelect={false}
        classNames={{
          control: () => "border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-500",
          menu: () => "mt-1 bg-white rounded-lg shadow-lg",
          multiValue: () => "bg-blue-100 text-blue-700 rounded-full px-2 py-1",
          multiValueLabel: () => "text-sm",
          multiValueRemove: () => "hover:bg-blue-500 hover:text-white rounded-full",
        }}
      />
    </div>
  );
};

export default ProductSelect;
