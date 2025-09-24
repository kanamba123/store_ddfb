import { useState, ChangeEvent } from "react";
import { X, Check, Edit } from "lucide-react";

interface StoreDetailsModalProps {
  store: any;
  onClose: () => void;
  onSave: (updatedStore: any) => void;
}

type FieldType = {
  label: string;
  value: string | null;
  fieldName: string;
  textarea?: boolean;
};

export default function StoreDetailsModal({
  store,
  onClose,
  onSave,
}: StoreDetailsModalProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState<string>("");
  const [tempStore, setTempStore] = useState(store);

  const handleFieldClick = (field: string, value: string | null) => {
    setEditingField(field);
    setEditedValue(value || "");
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedValue(e.target.value);
  };

  const handleSaveField = () => {
    if (!editingField) return;

    if (editingField.includes(".")) {
      const [parent, child] = editingField.split(".");
      setTempStore({
        ...tempStore,
        [parent]: {
          ...tempStore[parent],
          [child]: editedValue,
        },
      });
    } else {
      setTempStore({
        ...tempStore,
        [editingField]: editedValue,
      });
    }
    setEditingField(null);
  };

  const handleSaveAll = () => {
    onSave(tempStore);
    onClose();
  };

  const basicInfoFields: FieldType[] = [
    { label: "Store Name", value: tempStore.storeName, fieldName: "storeName" },
    { label: "Store Type", value: tempStore.storeType, fieldName: "storeType" },
    {
      label: "Email",
      value: tempStore.storeContactMail,
      fieldName: "storeContactMail",
    },
    {
      label: "Phone",
      value: tempStore.storeContactPhone.call,
      fieldName: "storeContactPhone.call",
    },
  ];

  const addressFields: FieldType[] = [
    {
      label: "Address",
      value: tempStore.storeAddress,
      fieldName: "storeAddress",
    },
    { label: "City", value: tempStore.city, fieldName: "city" },
    { label: "Country", value: tempStore.country, fieldName: "country" },
  ];

  const additionalFields: FieldType[] = [
    {
      label: "Description",
      value: tempStore.storeDescription,
      fieldName: "storeDescription",
      textarea: true,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Store Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <Section
            title="Basic Information"
            fields={basicInfoFields}
            editingField={editingField}
            editedValue={editedValue}
            handleFieldClick={handleFieldClick}
            handleChange={handleChange}
            handleSaveField={handleSaveField}
          />

          <Section
            title="Address"
            fields={addressFields}
            editingField={editingField}
            editedValue={editedValue}
            handleFieldClick={handleFieldClick}
            handleChange={handleChange}
            handleSaveField={handleSaveField}
          />

          <Section
            title="Additional Information"
            fields={additionalFields}
            editingField={editingField}
            editedValue={editedValue}
            handleFieldClick={handleFieldClick}
            handleChange={handleChange}
            handleSaveField={handleSaveField}
          />
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAll}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Check size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  fields: FieldType[];
  editingField: string | null;
  editedValue: string;
  handleFieldClick: (field: string, value: string | null) => void;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSaveField: () => void;
}

function Section({
  title,
  fields,
  editingField,
  editedValue,
  handleFieldClick,
  handleChange,
  handleSaveField,
}: SectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-800 dark:text-gray-200">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <Field
            key={field.fieldName}
            label={field.label}
            value={field.value}
            editing={editingField === field.fieldName}
            onChange={handleChange}
            onClick={() => handleFieldClick(field.fieldName, field.value)}
            onSave={handleSaveField}
            textarea={field.textarea}
          />
        ))}
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string | null;
  editing: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClick: () => void;
  onSave: () => void;
  textarea?: boolean;
}

function Field({
  label,
  value,
  editing,
  onChange,
  onClick,
  onSave,
  textarea = false,
}: FieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      {editing ? (
        <div className="flex gap-2">
          {textarea ? (
            <textarea
              value={value || ""}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={3}
            />
          ) : (
            <input
              type="text"
              value={value || ""}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          )}
          <button
            onClick={onSave}
            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            aria-label="Save"
          >
            <Check size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={onClick}
          className="group relative w-full px-3 py-2 border border-transparent rounded-lg hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer transition-colors"
        >
          {value || <span className="text-gray-400 italic">Not provided</span>}
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit size={14} className="text-gray-400" />
          </div>
        </div>
      )}
    </div>
  );
}
