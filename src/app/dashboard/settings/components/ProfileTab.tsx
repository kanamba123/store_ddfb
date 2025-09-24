"use client";
import { InputChangeEvent } from "@/types/events";
import { Eye } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import StoreDetailsModal from "./StoreDetailsModal";
import { useStoreWithUserDetails } from "@/hooks/apis/useStores";

interface StoreProfileTabProps {
  handleChange: (e: InputChangeEvent) => void;
}

export default function ProfileTab({ handleChange }: StoreProfileTabProps) {
  const { id } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { data: store, isLoading } = useStoreWithUserDetails(user?.id);
  const router = useRouter();

  const handleSaveStore = async (updatedStore: any) => {
    try {
      // await updateStoreDetails(updatedStore.id, updatedStore);
      // setStore(updatedStore);
      // Show success message
    } catch (err) {
      // Show error message
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto ">
      {/* Summary View */}
      <div className="bg-[var(--color-bg-primary)] p-2 rounded-xl shadow-sm dark:shadow-none  ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{store?.storeName}</h2>
          <button
            onClick={() => router.push("/dashboard/profile")}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400"
          >
            <Eye size={16} />
            View Details
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField label="Email" value={store?.storeContactMail} />
          <InfoField label="Phone" value={store?.storeContactPhone?.call} />
          <InfoField label="Address" value={store?.storeAddress} />
          <InfoField label="City" value={store?.city} />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && store && (
        <StoreDetailsModal
          store={store}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveStore}
        />
      )}
    </div>
  );
}

// Reusable InfoField component for summary view
function InfoField({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium">
        {value || <span className="text-gray-400">Not provided</span>}
      </p>
    </div>
  );
}