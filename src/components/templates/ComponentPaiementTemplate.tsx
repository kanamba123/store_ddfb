import React, { useState, ChangeEvent } from "react";

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

    // setPaymentDetails((prev) => ({
    //   ...prev,
    //   [field]: newValue,
    // }));
  };

  return (
    <div className="bg-gray-50 text-gray-800 border border-gray-200 rounded-lg shadow-sm p-4 mb-6 transition-all">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-lg font-semibold text-gray-800 m-0">Type de Paiement</h5>
        <button
          className="text-blue-600 text-lg font-bold bg-none border-none cursor-pointer"
          onClick={() => toggleVisibility("paymentInfo")}
        >
          {visibility.paymentInfo ? "▲" : "▼"}
        </button>
      </div>

      {/* Content */}
      {visibility.paymentInfo && (
        <div className="mt-3 space-y-4">
          <div className="flex flex-col gap-4">
            {/* Cash */}
            <label className="flex items-center gap-2 text-gray-700 font-medium cursor-pointer">
              <input
                type="radio"
                className="w-4 h-4 accent-blue-600 cursor-pointer"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(e) => handlePaymentChange(e.target.value)}
              />
              Cash
            </label>
            {paymentMethod === "cash" && (
              <input
                type="number"
                placeholder="Montant Payé"
                value={paymentDetails.amountPaid ?? totalPayment}
                onChange={(e) => handleDetailChange("amountPaid", e.target.value)}
                className={`mt-1 w-full p-2 text-sm border rounded-lg focus:outline-none focus:border-blue-600 ${
                  amountError ? "border-red-500" : "border-gray-300"
                }`}
              />
            )}

            {/* BizCoPay */}
            <label className="flex items-center gap-2 text-gray-700 font-medium cursor-pointer">
              <input
                type="radio"
                className="w-4 h-4 accent-blue-600 cursor-pointer"
                value="bizcoPay"
                checked={paymentMethod === "bizcoPay"}
                onChange={(e) => handlePaymentChange(e.target.value)}
              />
              BizCoPay
            </label>

            {/* Bank Transfer */}
            <label className="flex items-center gap-2 text-gray-700 font-medium cursor-pointer">
              <input
                type="radio"
                className="w-4 h-4 accent-blue-600 cursor-pointer"
                value="bankTransfer"
                checked={paymentMethod === "bankTransfer"}
                onChange={(e) => handlePaymentChange(e.target.value)}
              />
              Versement Bancaire
            </label>
            {paymentMethod === "bankTransfer" && (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Numéro de Bordereau"
                  value={paymentDetails.borderoNumber || ""}
                  onChange={(e) => handleDetailChange("borderoNumber", e.target.value)}
                  className="mt-1 w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
                <input
                  type="text"
                  placeholder="Nom de la Banque"
                  value={paymentDetails.bankName || ""}
                  onChange={(e) => handleDetailChange("bankName", e.target.value)}
                  className="mt-1 w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
                <input
                  type="number"
                  placeholder="Montant Payé"
                  value={paymentDetails.amountPaid || ""}
                  onChange={(e) => handleDetailChange("amountPaid", e.target.value)}
                  className={`mt-1 w-full p-2 text-sm border rounded-lg focus:outline-none focus:border-blue-600 ${
                    amountError ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {amountError && (
                  <span className="text-red-500 text-xs mt-1 ml-0.5">
                    Montant ne peut pas dépasser le total dû.
                  </span>
                )}
                <input
                  type="date"
                  value={paymentDetails.borderoDate || ""}
                  onChange={(e) => handleDetailChange("borderoDate", e.target.value)}
                  className="mt-1 w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
            )}

            {/* Electronic Deposit */}
            <label className="flex items-center gap-2 text-gray-700 font-medium cursor-pointer">
              <input
                type="radio"
                className="w-4 h-4 accent-blue-600 cursor-pointer"
                value="electronicDeposit"
                checked={paymentMethod === "electronicDeposit"}
                onChange={(e) => handlePaymentChange(e.target.value)}
              />
              Dépôt Électronique
            </label>
            {paymentMethod === "electronicDeposit" && (
              <input
                type="text"
                placeholder="Informations de Transaction"
                value={paymentDetails.transactionInfo || ""}
                onChange={(e) => handleDetailChange("transactionInfo", e.target.value)}
                className="mt-1 w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              />
            )}

            {/* Debt */}
            <label className="flex items-center gap-2 text-gray-700 font-medium cursor-pointer">
              <input
                type="radio"
                className="w-4 h-4 accent-blue-600 cursor-pointer"
                value="debt"
                checked={paymentMethod === "debt"}
                onChange={(e) => handlePaymentChange(e.target.value)}
              />
              Dette (Paiement Ultérieur)
            </label>
            {paymentMethod === "debt" && (
              <div className="flex flex-col gap-2">
                <input
                  type="number"
                  placeholder="Montant de la Dette"
                  value={paymentDetails.debtAmount || ""}
                  onChange={(e) => handleDetailChange("debtAmount", e.target.value)}
                  className="mt-1 w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
                <input
                  type="text"
                  placeholder="Matériel Non Remis"
                  value={paymentDetails.unreturnedMaterial || ""}
                  onChange={(e) => handleDetailChange("unreturnedMaterial", e.target.value)}
                  className="mt-1 w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
            )}

            {/* Promotion */}
            <label className="flex items-center gap-2 text-gray-700 font-medium cursor-pointer">
              <input
                type="radio"
                className="w-4 h-4 accent-blue-600 cursor-pointer"
                value="promotion"
                checked={paymentMethod === "promotion"}
                onChange={(e) => handlePaymentChange(e.target.value)}
              />
              Promotion
            </label>
            {paymentMethod === "promotion" && (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Code Promotionnel"
                  value={paymentDetails.promoCode || ""}
                  onChange={(e) => handleDetailChange("promoCode", e.target.value)}
                  className="mt-1 w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
                <input
                  type="number"
                  placeholder="Montant Promotion"
                  value={paymentDetails.promoAmount || ""}
                  onChange={(e) => handleDetailChange("promoAmount", e.target.value)}
                  className="mt-1 w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentPaiementTemplate;
