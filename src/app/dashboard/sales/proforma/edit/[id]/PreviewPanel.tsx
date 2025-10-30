import React from "react";

interface PreviewPanelProps {
  organizations?: any;
  selectedClient?: any;
  salessProducts?: any[];
  paymentDetails?: any;
  subtotal?: number;
  discountAmount?: number;
  total?: number;
  paymentMethod?: string;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  organizations,
  selectedClient,
  salessProducts = [],
  paymentDetails,
  subtotal = 0,
  discountAmount = 0,
  total = 0,
  paymentMethod,
}) => {
  const formatDate = (date: any) => {
    if (date instanceof Date && !isNaN(date.getTime())) return date.toLocaleDateString();
    if (typeof date === "string") return new Date(date).toLocaleDateString();
    return "N/A";
  };

  const formatCurrency = (value: any) => {
    const number = parseFloat(value);
    return !isNaN(number) ? `${number.toFixed(2)} FBU` : "0 FBU";
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Preview</h2>

      {/* Client Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Customer Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <p><strong>First Name:</strong> {selectedClient?.firstName || "N/A"}</p>
          <p><strong>Last Name:</strong> {selectedClient?.lastName || "N/A"}</p>
          <p className="col-span-2"><strong>Address:</strong> {selectedClient?.address || "N/A"}</p>
          <p><strong>Phone Number:</strong> {selectedClient?.phoneNumber || "N/A"}</p>
        </div>
      </div>

      {/* Organization Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Organisation Details</h3>
        <p><strong>Nom:</strong> {organizations?.storeName || "N/A"}</p>
        <p><strong>Adresse:</strong> {organizations?.storeAddress || "N/A"}</p>
        <p><strong>Email:</strong> {organizations?.storeContactMail || "N/A"}</p>

        <div className="mt-2">
          <h4 className="font-semibold">Numéros de Contact</h4>
          <div className="grid grid-cols-2 gap-4 mt-1">
            <p><strong>Appel:</strong> {organizations?.storeContactPhone?.call || "N/A"}</p>
            <p><strong>Business:</strong> {organizations?.storeContactPhone?.Busness || "N/A"}</p>
            <p><strong>WhatsApp:</strong> {organizations?.storeContactPhone?.Whatsapp || "N/A"}</p>
            <p><strong>Communication:</strong> {organizations?.storeContactPhone?.Communication || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Produits Sélectionnés</h3>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-md">
            <thead className="bg-gray-100 font-semibold">
              <tr>
                <th className="p-2 text-left">Produit</th>
                <th className="p-2 text-center">Quantité</th>
                <th className="p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {salessProducts.length > 0 ? (
                salessProducts.map((product, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{product.name || "Produit inconnu"}</td>
                    <td className="p-2 text-center">x{product.quantity}</td>
                    <td className="p-2 text-right">{formatCurrency(product.price * product.quantity)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-2 text-center text-red-500" colSpan={3}>Aucun produit sélectionné</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Payment Information</h3>
        <p><strong>Payment Method:</strong> {paymentMethod || "N/A"}</p>

        {paymentMethod === "cash" && (
          <p><strong>Amount Paid:</strong> {paymentDetails?.amountPaid || "N/A"}</p>
        )}

        {paymentMethod === "bankTransfer" && (
          <>
            <p><strong>Bordero Number:</strong> {paymentDetails?.borderoNumber || "N/A"}</p>
            <p><strong>Bank Name:</strong> {paymentDetails?.bankName || "N/A"}</p>
            <p><strong>Amount Paid:</strong> {paymentDetails?.amountPaid || "N/A"}</p>
            <p><strong>Bordero Date:</strong> {formatDate(paymentDetails?.borderoDate)}</p>
          </>
        )}

        {paymentMethod === "electronicDeposit" && (
          <p><strong>Number of Transaction:</strong> {paymentDetails?.transactionInfo || "N/A"}</p>
        )}

        {paymentMethod === "debt" && (
          <p><strong>Montant du dette:</strong> {paymentDetails?.debtAmount || "N/A"}</p>
        )}

        {paymentMethod === "promotion" && (
          <p><strong>Montant promotion:</strong> {paymentDetails?.promoAmount || "N/A"}</p>
        )}
      </div>

      {/* Sale Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Sale Summary</h3>
        <p><strong>Subtotal:</strong> {formatCurrency(subtotal)}</p>
        <p><strong>Discount:</strong> {formatCurrency(discountAmount)}</p>
        <p><strong>Total:</strong> {formatCurrency(total)}</p>
      </div>

      <div className="border-t mt-4"></div>
    </div>
  );
};

export default PreviewPanel;
