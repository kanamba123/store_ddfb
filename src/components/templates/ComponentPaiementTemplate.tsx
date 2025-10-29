import React, { useState } from "react";

interface PaymentDetails {
  amountPaid?: number | string;
  borderoNumber?: string;
  bankName?: string;
  borderoDate?: string;
  transactionInfo?: string;
  debtAmount?: number | string;
  unreturnedMaterial?: string;
  promoCode?: string;
  promoAmount?: number | string;
}

interface ComponentPaiementTemplateProps {
  visibility: { paymentInfo: boolean };
  toggleVisibility: (section: "paymentInfo") => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  paymentDetails: PaymentDetails;
  setPaymentDetails: (details: PaymentDetails) => void;
  totalPayment: number;
}

const ComponentPaiementTemplate: React.FC<ComponentPaiementTemplateProps> = ({
  visibility,
  toggleVisibility,
  paymentMethod,
  setPaymentMethod,
  paymentDetails,
  setPaymentDetails,
  totalPayment,
}) => {
  const [amountError, setAmountError] = useState(false);

  const handlePaymentChange = (method: string) => {
    setPaymentMethod(method);
    setPaymentDetails({});
    setAmountError(false);
  };

  const parseCurrency = (value: string | number): number => {
    if (typeof value === "string") {
      const cleaned = value.replace(/[^\d,.-]/g, "").replace(",", ".");
      return parseFloat(cleaned) || 0;
    }
    return value;
  };

  const handleDetailChange = (field: keyof PaymentDetails, value: string | number) => {
    let newValue: string | number = value;

    if (field === "amountPaid") {
      const numericValue = parseCurrency(value);

      if (numericValue > totalPayment) {
        setAmountError(true);
        return;
      } else {
        setAmountError(false);
      }

      newValue = numericValue;
    }

    // Correction : passer directement l'objet mis à jour
    setPaymentDetails({
      ...paymentDetails,
      [field]: newValue,
    });
  };

  const paymentMethods = [
    { value: "cash", label: "Cash" },
    { value: "bizcoPay", label: "BizCoPay" },
    { value: "bankTransfer", label: "Versement Bancaire" },
    { value: "electronicDeposit", label: "Dépôt Électronique" },
    { value: "debt", label: "Dette (Paiement Ultérieur)" },
    { value: "promotion", label: "Promotion" },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
      {/* Header compact */}
      <div 
        className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => toggleVisibility("paymentInfo")}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded-md">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-gray-800">Paiement</h5>
            <p className="text-xs text-gray-600 capitalize">{paymentMethod || "Non sélectionné"}</p>
          </div>
        </div>
        <button className="p-1 text-gray-500 hover:text-gray-700 rounded transition-colors">
          {visibility.paymentInfo ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>

      {/* Content */}
      {visibility.paymentInfo && (
        <div className="p-3">
          <div className="space-y-3">
            {/* Méthodes de paiement */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {paymentMethods.map((method) => (
                <label key={method.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer p-2 rounded border border-gray-200 hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    className="w-3.5 h-3.5 accent-blue-600 cursor-pointer"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => handlePaymentChange(e.target.value)}
                  />
                  <span className="text-xs font-medium">{method.label}</span>
                </label>
              ))}
            </div>

            {/* Détails selon la méthode */}
            <div className="mt-2 space-y-2">
              {/* Cash */}
              {paymentMethod === "cash" && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Montant payé
                  </label>
                  <input
                    type="number"
                    placeholder="Montant payé"
                    value={paymentDetails.amountPaid ?? totalPayment}
                    onChange={(e) => handleDetailChange("amountPaid", e.target.value)}
                    className={`w-full p-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                      amountError ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {amountError && (
                    <span className="text-red-500 text-xs mt-1">
                      Montant ne peut pas dépasser {totalPayment.toLocaleString()} FBU
                    </span>
                  )}
                </div>
              )}

              {/* Versement Bancaire */}
              {paymentMethod === "bankTransfer" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Numéro bordereau
                    </label>
                    <input
                      type="text"
                      placeholder="N° bordereau"
                      value={paymentDetails.borderoNumber || ""}
                      onChange={(e) => handleDetailChange("borderoNumber", e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Banque
                    </label>
                    <input
                      type="text"
                      placeholder="Nom banque"
                      value={paymentDetails.bankName || ""}
                      onChange={(e) => handleDetailChange("bankName", e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Montant
                    </label>
                    <input
                      type="number"
                      placeholder="Montant payé"
                      value={paymentDetails.amountPaid || ""}
                      onChange={(e) => handleDetailChange("amountPaid", e.target.value)}
                      className={`w-full p-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                        amountError ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={paymentDetails.borderoDate || ""}
                      onChange={(e) => handleDetailChange("borderoDate", e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {amountError && (
                    <div className="sm:col-span-2">
                      <span className="text-red-500 text-xs">
                        Montant ne peut pas dépasser {totalPayment.toLocaleString()} FBU
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Dépôt Électronique */}
              {paymentMethod === "electronicDeposit" && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Informations transaction
                  </label>
                    <input
                      type="text"
                      placeholder="Détails de la transaction"
                      value={paymentDetails.transactionInfo || ""}
                      onChange={(e) => handleDetailChange("transactionInfo", e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
              )}

              {/* Dette */}
              {paymentMethod === "debt" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Montant dette
                    </label>
                    <input
                      type="number"
                      placeholder="Montant dû"
                      value={paymentDetails.debtAmount || ""}
                      onChange={(e) => handleDetailChange("debtAmount", e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Matériel non remis
                    </label>
                    <input
                      type="text"
                      placeholder="Description du matériel"
                      value={paymentDetails.unreturnedMaterial || ""}
                      onChange={(e) => handleDetailChange("unreturnedMaterial", e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Promotion */}
              {paymentMethod === "promotion" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Code promo
                    </label>
                    <input
                      type="text"
                      placeholder="Code promotionnel"
                      value={paymentDetails.promoCode || ""}
                      onChange={(e) => handleDetailChange("promoCode", e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Montant promo
                    </label>
                    <input
                      type="number"
                      placeholder="Montant réduction"
                      value={paymentDetails.promoAmount || ""}
                      onChange={(e) => handleDetailChange("promoAmount", e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Total à payer */}
            {totalPayment > 0 && (
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">Total à payer :</span>
                  <span className="font-bold text-green-600">
                    {totalPayment.toLocaleString()} FBU
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentPaiementTemplate;