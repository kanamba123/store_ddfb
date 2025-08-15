"use client";
import {
  Store,
  Edit,
  MapPin,
  Mail,
  Phone,
  Globe,
  Info,
  Users,
  ShoppingBag,
  Calendar,
  Clock,
  FileText,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { useStoreWithUserDetails } from "@/hooks/apis/useStores";

export default function ProfileTab() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { data: store, isLoading,isError } = useStoreWithUserDetails(user?.id);



  return (
    <div className="container mx-auto px-1">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : isError ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {isError}
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
                  {store.storePlatformUrl?.[0] ? (
                    <Image
                      src={store.storePlatformUrl[0]}
                      alt={store.storeName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Store size={32} className="text-gray-400" />
                    </div>
                  )}
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
                        {store.location && (
                          <span className="text-xs text-gray-400">
                            ({store.location.latitude}, {store.location.longitude})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-300">
                        <ShoppingBag size={16} />
                        <span className="capitalize">{store.storeType}</span>
                        {store.Market && (
                          <span className="text-sm">
                            • {store.Market.marketName}
                          </span>
                        )}
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
                  additionalValues={[
                    { label: "Business", value: store.storeContactPhone?.Busness },
                    { label: "WhatsApp", value: store.storeContactPhone?.Whatsapp },
                    { label: "Communication", value: store.storeContactPhone?.Communication }
                  ]}
                />
                <DetailCard
                  icon={<MapPin size={18} />}
                  title="Address"
                  value={store.storeAddress}
                />
                <DetailCard
                  icon={<Globe size={18} />}
                  title="Website"
                  value={store.storePlatformUrl?.[0] ? (
                    <a
                      href={store.storePlatformUrl[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Store
                    </a>
                  ) : "Not provided"}
                />
                <DetailCard
                  icon={<Shield size={18} />}
                  title="Status"
                  value={store.storeStatus}
                  badge={true}
                />
                <DetailCard
                  icon={<FileText size={18} />}
                  title="Business Papers"
                  value={store.bp || "Not provided"}
                />
                {store.Market && (
                  <DetailCard
                    icon={<Store size={18} />}
                    title="Market"
                    value={`${store.Market.marketName} (${store.Market.marketType})`}
                    additionalValue={store.Market.adressMarket}
                  />
                )}
                <DetailCard
                  icon={<Calendar size={18} />}
                  title="Created At"
                  value={new Date(store.createdAt).toLocaleDateString()}
                  additionalValue={`Last updated: ${new Date(store.updatedAt).toLocaleDateString()}`}
                />
              </div>
            </div>

            {/* Person References */}
            {store.personReferences && store.personReferences.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-none border dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users size={20} />
                  Person References
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {store.personReferences.map((person: any, index: string) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-medium">{person.name}</h3>
                      <div className="mt-2 space-y-1">

                        {(person as any).phoneNumbers?.map?.((phone: string, i: number) => (
                          phone && (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <Phone size={14} className="text-gray-500" />
                              <span>{phone}</span>
                            </div>
                          )
                        ))}
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Section */}
          <div className="space-y-6">
            {/* Owner Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-none border dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4">Owner Information</h2>
              {store.OwnerStore && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      {store.OwnerStore.profil ? (
                        <Image
                          src={store.OwnerStore.profil}
                          alt={store.OwnerStore.fullName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Users size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{store.OwnerStore.fullName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        @{store.OwnerStore.userName}
                      </p>
                    </div>
                  </div>
                  <DetailCard
                    icon={<Mail size={16} />}
                    title="Email"
                    value={store.OwnerStore.email}
                    small
                  />
                  <DetailCard
                    icon={<Phone size={16} />}
                    title="Phone"
                    value={store.OwnerStore.phoneNumber}
                    small
                  />
                  <DetailCard
                    icon={<ShoppingBag size={16} />}
                    title="Business"
                    value={store.OwnerStore.businessName}
                    small
                  />
                </div>
              )}
            </div>

            {/* Verification Status */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-none border dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-2">Verification</h2>
              <div
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${store.verificationStatus === "verified"
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
              {store.verifiedAt && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock size={12} />
                  Verified on: {new Date(store.verifiedAt).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Store Gallery Section */}
            {store.storePlatformUrl && store.storePlatformUrl.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-none border dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-4">Store Images</h2>
                <div className="grid grid-cols-2 gap-4">
                  {store.storePlatformUrl?.map((img: string, index: string) => (
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
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Enhanced Detail Card Component
function DetailCard({
  icon,
  title,
  value,
  additionalValue,
  additionalValues,
  badge = false,
  small = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  additionalValue?: string;
  additionalValues?: { label: string; value?: string }[];
  badge?: boolean;
  small?: boolean;
}) {
  return (
    <div className={`flex items-start gap-3 ${small ? 'text-sm' : ''}`}>
      <div className={`p-2 bg-blue-50 dark:bg-gray-700 rounded-lg text-blue-600 dark:text-blue-400 ${small ? 'p-1' : ''}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className={`text-gray-500 dark:text-gray-400 ${small ? 'text-xs' : 'text-sm'}`}>{title}</p>
        {badge ? (
          <span
            className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${value === "active"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
          >
            {value || "Not provided"}
          </span>
        ) : (
          <p className={`font-medium ${small ? 'text-sm' : ''}`}>
            {value || <span className="text-gray-400">Not provided</span>}
          </p>
        )}
        {additionalValue && (
          <p className={`text-gray-500 dark:text-gray-400 ${small ? 'text-xs' : 'text-sm'} mt-1`}>
            {additionalValue}
          </p>
        )}
        {additionalValues && additionalValues.map((item, index) => (
          item.value && (
            <div key={index} className="mt-1">
              <span className={`text-gray-500 dark:text-gray-400 ${small ? 'text-xs' : 'text-sm'}`}>
                {item.label}:
              </span>{' '}
              <span className={`font-medium ${small ? 'text-sm' : ''}`}>
                {item.value}
              </span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}