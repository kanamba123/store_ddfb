"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Ajouter useParams
import { notifySuccess } from "@/components/ui/ToastNotification";
import { useVariants } from "@/hooks/apis/useVariants";
import { useCustomers } from "@/hooks/apis/useCustomers";
import ComponentCustomerEdit from "../../components/ComponentCustomerEdit";
import ComponentProductEdit from "../../components/ComponentProductEdit";
import { usePatchProformaField, useProformaDetails } from "@/hooks/apis/useProformas";
import PreviewPanel from "./PreviewPanel";

// Supprimer l'interface PageProps et utiliser useParams() à l'intérieur du composant


const ProformaEdit: React.FC = () => {
    // Utiliser useParams() pour obtenir les paramètres
    const params = useParams();
    const proformaId = params?.id as string;

    const { data: proformaDetails, isLoading: isLoadingProforma, isError: isErrorProforma } = useProformaDetails(proformaId);
    const { data: variants = [], isLoading, isError } = useVariants();
    const { data: customers = [] } = useCustomers();
    const patchProformaField = usePatchProformaField();

    const [visibility, setVisibility] = useState({
        sellerInfo: true,
        clientInfo: true,
        productInfo: true,
        paymentInfo: true,
        proformaInfo: true,
    });

    const [selectedProducts, setSelectedProducts] = useState<Record<string, any>>({});
    const [salessProducts, setSalessProducts] = useState<any[]>([]);
    const [selectedClient, setSelectedClient] = useState<string | number>("");
    const [organisationInfo, setOrganisationInfo] = useState<any>(null);

    const [paymentDetails, setPaymentDetails] = useState({ amountPaid: 0, amountDue: 0 });
    const [totals, setTotals] = useState({ subtotal: 0, discountAmount: 0, total: 0 });

    const [showPreview, setShowPreview] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info">("success");
    const [errorMessage, setErrorMessage] = useState("");

    // Initialiser les données du proforma
    useEffect(() => {
        if (!proformaDetails?.proforma) return; // safeguard
        const { proforma } = proformaDetails;

        setSelectedClient(proforma.customerId || "");
        setOrganisationInfo(proforma.store || null);

        const productsObj: Record<string, any> = {};
        const itemsArray = proforma.items ? Object.values(proforma.items) : [];
        itemsArray.forEach((p: any) => {
            productsObj[p.id] = {
                id: p.id,
                name: p.name || "",
                price: p.price || 0,
                quantity: p.quantity || 0,
                total: p.total || 0,
                variantType: p.variantType || "Non classé",
                isCustom: p.isCustom || false,
            };
        });

        setSelectedProducts(productsObj);
        setSalessProducts(itemsArray);

        setPaymentDetails({
            amountPaid: proforma.amountPaid || 0,
            amountDue: proforma.amountDue || 0,
        });

        setTotals({
            subtotal: proforma.subtotal || 0,
            discountAmount: proforma.discountAmount || 0,
            total: proforma.total || 0,
        });
    }, [proformaDetails]);


    // Calcul des totaux
    useEffect(() => {
        const subtotal = Object.values(selectedProducts).reduce(
            (total, p) => total + (p.price || 0) * (p.quantity || 0),
            0
        );
        const discountAmount = 0;
        const total = subtotal - discountAmount;
        setTotals({ subtotal, discountAmount, total });
    }, [selectedProducts]);

    const toggleVisibility = (section: string) => {
        setVisibility((prev: any) => ({ ...prev, [section as any]: !prev[section as any] }));
    };

    const handleClientSelect = (client: any) => {
        setSelectedClient(client?.id || client || "");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClient) {
            setErrorMessage("Veuillez sélectionner un client.");
            setSnackbarMessage("Veuillez sélectionner un client.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }
        setShowPreview(true);
        setErrorMessage("");
    };

    const handlePreviewClose = () => setShowPreview(false);

    const handleConfirmSubmit = () => {
        if (!proformaId) {
            return;
        }

        patchProformaField.mutate(
            { id: proformaId, field: "items", value: salessProducts },
            {
                onSuccess: () => {
                    notifySuccess("Proforma mise à jour avec succès !");
                    setShowPreview(false);
                },
                onError: (err) => {
                    console.error("Erreur update proforma :", err);
                    setShowPreview(false);
                },
            }
        );
    };

    // Gérer le cas où proformaId n'est pas encore disponible
    if (!proformaId) {
        return <div className="text-center py-10">Chargement...</div>;
    }

    if (isLoadingProforma) return <div className="text-center py-10">Chargement du proforma...</div>;
    if (isErrorProforma) return <div className="text-center py-10 text-red-600">Erreur lors du chargement du proforma</div>;

    return (
        <section className="h-full bg-gray-100 p-4">
            {errorMessage && (
                <div className="mb-4 text-center text-red-600 font-medium">{errorMessage}</div>
            )}

            <div className="space-y-6">
                <ComponentCustomerEdit
                    customers={customers}
                    visibility={visibility}
                    toggleVisibility={toggleVisibility}
                    onClientSelect={handleClientSelect}
                    initialClient={proformaDetails?.customer || null} 
                    saleId={proformaId}
                />

                <ComponentProductEdit
                    variantesProducts={variants as any[]}
                    isLoading={isLoading}
                    isError={isError}
                    setVariantProduct={setSelectedProducts}
                    visibility={visibility}
                    toggleVisibility={toggleVisibility}
                    sendToBackend={setSalessProducts}
                    initialProducts={proformaDetails?.items || []} 
                    proformaId={proformaId}
                />

                <div className="text-center">
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Prévisualiser Proforma
                    </button>
                </div>
            </div>

            {showPreview && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6">
                        <h2 className="text-xl font-semibold mb-4">Prévisualisation Proforma</h2>
                        <PreviewPanel
                            organizations={organisationInfo}
                            selectedClient={selectedClient}
                            salessProducts={salessProducts}
                            paymentDetails={paymentDetails}
                            subtotal={totals.subtotal}
                            discountAmount={totals.discountAmount}
                            total={totals.total}
                            paymentMethod="cash"
                        />
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={handlePreviewClose} className="px-4 py-2 border rounded-lg">
                                Fermer
                            </button>
                            <button onClick={handleConfirmSubmit} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                Confirmer
                            </button>
                            <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Imprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {snackbarOpen && (
                <div
                    className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow text-white ${snackbarSeverity === "success" ? "bg-green-600" : snackbarSeverity === "error" ? "bg-red-600" : "bg-blue-600"
                        }`}
                >
                    {snackbarMessage}
                    <button className="ml-4 font-bold" onClick={() => setSnackbarOpen(false)}>
                        ✕
                    </button>
                </div>
            )}
        </section>
    );
};

export default ProformaEdit;