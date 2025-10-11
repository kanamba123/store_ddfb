import React, { useState } from "react";
import { notifyError, notifySuccess } from "./ToastNotification";
import DropdownSelect from "./DropdownSelect";
import { DeliveryOptions } from "@/constants/DeliveryOptions";
import { useCreatePromotion, useDeleteOnePromotion } from "@/hooks/apis/usePromotion";

interface PromotionProps {
    id: string | number;
    field?: string;
    value?: string | number;
    onSave?: (data: any) => void;
    endpoint: string;
    emptyText?: string;
    editable?: boolean;
    isPromotion?: boolean;
    oldPrice?: number;
    promotionGeted?: any;
    promotionId?: number | null;
    itemValue?: any;
    useDialog?: boolean;
}

const TdCustomViewEditPromotion: React.FC<PromotionProps> = ({
    id,
    field,
    value,
    onSave,
    endpoint,
    emptyText = "No promotion",
    editable = false,
    isPromotion = false,
    oldPrice = 0,
    promotionGeted,
}) => {
    const useDeletePro = useDeleteOnePromotion();
    const useCreateProm = useCreatePromotion();

    const [editMode, setEditMode] = useState(false);
    const [newValue, setNewValue] = useState(value);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showPromotion, setShowPromotion] = useState(false);
    const [amountError, setAmountError] = useState(false);

    const today = new Date();
    const startDate = today.toISOString().split("T")[0];
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const endDate = nextMonth.toISOString().split("T")[0];

    const [newPromotion, setNewPromotion] = useState({
        varianteId: id,
        name: "",
        type: "percentage",
        value: {} as any,
        startDate: startDate,
        endDate: endDate,
    });

    const handleTypeChange = (type: string) => {
        setNewPromotion((prev) => ({ ...prev, type, value: { type } }));
    };

    const parseCurrency = (value: any) => {
        if (typeof value === "string") {
            const cleaned = value.replace(/[^\d,.-]/g, "").replace(",", ".");
            return parseFloat(cleaned) || 0;
        }
        return value;
    };

    const handleDetailChange = (field: string, val: any) => {
        let newVal = val;

        if (field === "fixedAmount") {
            const numericValue = parseCurrency(val);
            if (numericValue > oldPrice / 2) {
                setAmountError(true);
                return;
            } else setAmountError(false);
            const newPrice = oldPrice - numericValue;
            const percentage = (numericValue * 100) / oldPrice;
            setNewPromotion((prev) => ({
                ...prev,
                value: { ...prev.value, percentage, value: numericValue, newPrice },
            }));
        }

        if (field === "percentage") {
            const percentage = parseInt(val, 10);
            const discountAmount = (oldPrice * percentage) / 100;
            const newPrice = oldPrice - discountAmount;
            setNewPromotion((prev) => ({
                ...prev,
                value: { ...prev.value, percentage, discountAmount, newPrice },
            }));
        }

        if (field === "freeShipping") {
            setNewPromotion((prev) => ({
                ...prev,
                value: { ...prev.value, [field]: newVal },
            }));
        }
    };

    const handleDeletePromotion = async (id: string | number) => {
        useDeletePro.mutate(id, {
            onSuccess: () => setShowPromotion(false),
            onError: (err) => console.error(err),
        });
    };

    const handleAddPromotion = async () => {
        setLoading(true);
        setError(null);

        useCreateProm.mutate(newPromotion, {
            onSuccess: () => {
                notifySuccess("Promotion ajoutée avec succès !");
                setShowAddForm(false);
                setNewPromotion({ varianteId: id, name: "", type: "percentage", value: {}, startDate, endDate });
                setLoading(false);
            },
            onError: (err: any) => {
                setError(err.message);
                notifyError("Erreur lors de l'ajout !");
                setLoading(false);
            },
        });
    };

    return (
        <div className="relative">
            {isPromotion ? (
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setShowPromotion(true)}
                >
                    <span className="line-through text-gray-400">{oldPrice || emptyText}</span>
                    <span className="font-bold text-green-600">{promotionGeted?.value?.newPrice || emptyText}</span>

                </div>
            ) : loading ? (
                <div className="w-6 h-6 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
            ) : (
                <div className="flex items-center gap-2">
                    <span className="line-through text-gray-400">{value || emptyText}</span>
                    {editable && (
                        <button
                            className="text-sm text-blue-600 hover:underline"
                            onClick={() => setShowAddForm(true)}
                        >
                            Ajouter promotion
                        </button>
                    )}
                </div>
            )}

            {(showPromotion || showAddForm) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div
                        className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded-2xl shadow-lg p-6 w-full max-w-lg relative overflow-y-auto max-h-[90vh] animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xl font-semibold text-gray-800">
                                {showPromotion ? "Détails promotion" : "Ajouter promotion"}
                            </h4>
                            <button
                                className="text-gray-500 hover:text-gray-700 text-xl"
                                onClick={() => { setShowPromotion(false); setShowAddForm(false); }}
                            >
                                &times;
                            </button>
                        </div>

                        {/* Détails promotion */}
                        {showPromotion && promotionGeted && (
                            <div className="space-y-3">
                                <div className="text-lg font-bold text-gray-800">{promotionGeted.name}</div>
                                <div className="grid gap-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Ancien prix:</span>
                                        <span className="line-through text-red-500">{oldPrice}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Nouveau prix:</span>
                                        <span className="text-green-600">{promotionGeted.value?.newPrice}</span>
                                    </div>
                                    {promotionGeted.value?.discountAmount && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Montant réduction:</span>
                                            <span>{promotionGeted.value.discountAmount}</span>
                                        </div>
                                    )}
                                    {promotionGeted.value?.percentage && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Pourcentage:</span>
                                            <span>{promotionGeted.value.percentage}%</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                                        onClick={() => handleDeletePromotion(promotionGeted.id)}
                                    >
                                        Supprimer
                                    </button>
                                    <button
                                        className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg"
                                        onClick={() => setShowPromotion(false)}
                                    >
                                        Fermer
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Formulaire ajout */}
                        {showAddForm && (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nom de la promotion"
                                    value={newPromotion.name}
                                    onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />

                                {/* Type promotion */}
                                <div className="flex flex-col gap-2">
                                    {["percentage", "fixedAmount", "buyOnegetone", "freeShipping"].map((type) => (
                                        <label key={type} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="promotionType"
                                                value={type}
                                                checked={newPromotion.type === type}
                                                onChange={(e) => handleTypeChange(e.target.value)}
                                                className="form-radio"
                                            />
                                            <span className="capitalize">{type}</span>
                                        </label>
                                    ))}
                                </div>

                                {/* Montant ou % */}
                                {newPromotion.type === "percentage" && (
                                    <div className="flex flex-col gap-3">
                                        <label className="text-sm font-medium text-gray-700">
                                            Pourcentage de réduction : <span className="text-blue-600 font-semibold">{newPromotion.value.percentage || 0}%</span>
                                        </label>

                                        {/* Barre d’ajustement */}
                                        <input
                                            type="range"
                                            min={1}
                                            max={50}
                                            step={1}
                                            value={newPromotion.value.percentage || 0}
                                            onChange={(e) => handleDetailChange("percentage", e.target.value)}
                                            className="w-full accent-blue-500"
                                        />

                                        {/* Valeurs dynamiques */}
                                        <div className="flex flex-col gap-1 text-sm">
                                            {newPromotion.value.discountAmount && (
                                                <p className="text-blue-600">
                                                    Montant réduction : <span className="font-semibold">{newPromotion.value.discountAmount} fbu</span>
                                                </p>
                                            )}
                                            {newPromotion.value.newPrice && (
                                                <p className="text-green-600">
                                                    Nouveau prix : <span className="font-semibold">{newPromotion.value.newPrice} fbu</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}


                                {newPromotion.type === "fixedAmount" && (
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="number"
                                            placeholder="Montant fixe"
                                            value={newPromotion.value.value || ""}
                                            onChange={(e) => handleDetailChange("fixedAmount", e.target.value)}
                                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                        {amountError && <p className="text-red-500">Le montant dépasse la moitié du prix initial</p>}
                                    </div>
                                )}

                                {newPromotion.type === "freeShipping" && (
                                    <DropdownSelect
                                        id="freeShipping"
                                        name="freeShipping"
                                        label="Régions livraison gratuite"
                                        options={DeliveryOptions.map(option => ({ label: option.label || option, value: option.value || option }))}
                                        value={newPromotion.value.shippingRegions || null}
                                        onChange={(selectedOption: any | null) =>
                                            handleDetailChange("freeShipping", selectedOption)
                                        }
                                    />

                                )}


                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        value={newPromotion.startDate}
                                        onChange={(e) => setNewPromotion({ ...newPromotion, startDate: e.target.value })}
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <input
                                        type="date"
                                        value={newPromotion.endDate}
                                        onChange={(e) => setNewPromotion({ ...newPromotion, endDate: e.target.value })}
                                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                {error && <p className="text-red-500">{error}</p>}

                                <div className="flex justify-end gap-2">
                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                                        onClick={handleAddPromotion}
                                        disabled={loading}
                                    >
                                        {loading ? <div className="w-5 h-5 border-4 border-white border-dashed rounded-full animate-spin"></div> : "Ajouter"}
                                    </button>
                                    <button
                                        className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg"
                                        onClick={() => setShowAddForm(false)}
                                        disabled={loading}
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TdCustomViewEditPromotion;
