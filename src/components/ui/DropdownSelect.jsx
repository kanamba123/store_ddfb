import React from 'react';
import Select from "react-select";
const DropdownSelect = ({
  id,
  name, // Identifiant unique pour le champ
  options, // Liste des options (tableau de chaînes ou objets { label, value })
  onChange, // Fonction callback à appeler lors de la sélection d'une option
  value, // Valeur sélectionnée
  label = "",
  className=""
}) => {
  const customStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      borderColor: "#ccc",
      backgroundColor: state.hasValue ? "var(--color-primary-tint)" : "white",
      color: state.hasValue ? "white" : "black",
      zIndex: 1, // Pas besoin de trop élevé ici
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "var(--color-primary)"
        : state.isFocused
          ? "#e6f0ff"
          : "white",
      color: state.isSelected ? "white" : "black",
      cursor: "pointer",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999, // <-- très important ici
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999, // <-- utile si menuPortalTarget est défini
    }),
    singleValue: (base) => ({
      ...base,
    }),
  };
  

  return (
    <div
      style={{
        marginBottom: "5px",
        zIndex: "1000",
      }}
    >
      <Select
        className={className}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        options={options}
        isSearchable
        isClearable
        styles={customStyles}
        menuPortalTarget={document.body}
      />
    </div>
  );
};

export default DropdownSelect;
