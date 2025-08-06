"use client";
import { StoreByOwner } from "@/types/store";
import {
  Eye,
  Store,
  Edit,
  MapPin,
  Mail,
  Phone,
  Globe,
  Info,
} from "lucide-react";
import { useParams } from "next/navigation";
import { fetchStoreDetails } from "@/libs/api/stores";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";


export default function ProfileTab() {
  const { id } = useParams<{ id: string }>();
  const [store, setStore] = useState<StoreByOwner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadStoreData = async () => {
      if (!user) return;

      try {
        const storeData = await fetchStoreDetails(Number(user.id));
        setStore(storeData);
      } catch (err) {
        setError("Failed to load store data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoreData();
  }, [id, user]);

  // Mock store images - replace with actual images from your API
  const storeImages = [
    "/placeholder-store-1.jpg",
    "/placeholder-store-2.jpg",
    "/placeholder-store-3.jpg",
  ];

  return (
    <div className="container mx-auto px-1">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : store ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Store Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Store Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-none border dark:border-gray-700 p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Store Logo/Avatar */}
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-blue-100 dark:border-gray-600">
                  <Image
                    src="/placeholder-store-logo.jpg" // Replace with store.logoUrl
                    alt={store.storeName}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold">{store.storeName}</h1>
                      <div className="flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-300">
                        <MapPin size={16} />
                        <span>
                          {store.city}, {store.country}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                  </div>

                  {store.storeDescription && (
                    <p className="mt-4 text-gray-700 dark:text-gray-300">
                      {store.storeDescription}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Store Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-none border dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Info size={20} />
                Store Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailCard
                  icon={<Mail size={18} />}
                  title="Email"
                  value={store.storeContactMail}
                />
                <DetailCard
                  icon={<Phone size={18} />}
                  title="Phone"
                  value={store.storeContactPhone?.call}
                />
                <DetailCard
                  icon={<MapPin size={18} />}
                  title="Address"
                  value={store.storeAddress}
                />
                <DetailCard
                  icon={<Globe size={18} />}
                  title="Status"
                  value={store.storeStatus}
                  badge={true}
                />
              </div>
            </div>
          </div>

          {/* Store Gallery Section */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-none border dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4">Store Gallery</h2>

              <div className="grid grid-cols-2 gap-4">
                {storeImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden"
                  >
                    <Image
                      src={img}
                      alt={`Store image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                <button className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-300 transition">
                  <Edit size={24} />
                </button>
              </div>
            </div>

            {/* Verification Status */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-none border dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-2">Verification</h2>
              <div
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  store.verificationStatus === "verified"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : store.verificationStatus === "pending"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {store.verificationStatus.charAt(0).toUpperCase() +
                  store.verificationStatus.slice(1)}
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {store.verificationStatus === "verified"
                  ? "Your store is fully verified"
                  : store.verificationStatus === "pending"
                  ? "Verification is in progress"
                  : "Please complete verification"}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Reusable Detail Card Component
function DetailCard({
  icon,
  title,
  value,
  badge = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | undefined;
  badge?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-blue-50 dark:bg-gray-700 rounded-lg text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        {badge ? (
          <span
            className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
              value === "active"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {value || "Not provided"}
          </span>
        ) : (
          <p className="font-medium">
            {value || <span className="text-gray-400">Not provided</span>}
          </p>
        )}
      </div>
    </div>
  );
}
