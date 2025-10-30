"use client";

import React, { useRef, useState } from "react";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { FaPrint, FaShare, FaDownload, FaKey, FaTimes } from "react-icons/fa";
import { useProformaDetail } from "@/hooks/apis/useProformas";
import { useAuth } from "@/contexts/AuthContext";
import { useStoreDetail } from "@/hooks/apis/useStores";
import API from "@/config/Axios";


export default function PublicProformaView() {
  const { id } = useParams();
  const printRef = useRef<HTMLDivElement>(null);

  const [isTokenPanelOpen, setIsTokenPanelOpen] = useState(false);
  const [validHours, setValidHours] = useState(24);
  const [tokenData, setTokenData] = useState<any>(null);
  const [loadingToken, setLoadingToken] = useState(false);

  const { user } = useAuth();

  const { data: detailStore } = useStoreDetail(user?.store?.id as string);

  const { data: proforma, isLoading, isError } = useProformaDetail(id as string);

  const handlePrint = () => {
    if (!printRef.current || !proforma) return;

    const printContent = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    const originalTitle = document.title;

    const printDocument = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Proforma Win2Cop - ${proforma.proformaNumber}</title>
        <style>
          @media print {
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 15px;
              color: #1f2937;
              font-size: 12px;
              line-height: 1.3;
            }
            .print-container { 
              max-width: 100%;
              page-break-inside: avoid;
            }
            .print-header { 
              border-bottom: 2px solid #2563eb; 
              padding-bottom: 15px; 
              margin-bottom: 20px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              page-break-after: avoid;
            }
            .company-info { flex: 1; }
            .proforma-info { 
              text-align: right;
              background: #f8fafc;
              padding: 12px;
              border-radius: 6px;
              border-left: 3px solid #2563eb;
              page-break-inside: avoid;
            }
            .logo-container {
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 6px;
            }
            .logo { 
              width: 50px;
              height: 50px;
              background: linear-gradient(135deg, #2563eb, #1d4ed8);
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 12px;
            }
            .company-name {
              font-size: 20px;
              font-weight: 700;
              color: #1e40af;
              margin: 0;
            }
            .section { 
              margin-bottom: 15px; 
              page-break-inside: avoid;
            }
            .section-title { 
              background: linear-gradient(135deg, #2563eb, #3b82f6);
              color: white;
              padding: 8px 12px;
              font-weight: 600;
              border-radius: 4px;
              margin-bottom: 10px;
              font-size: 11px;
              page-break-after: avoid;
            }
            .info-card {
              background: #f8fafc;
              padding: 10px;
              border-radius: 4px;
              border-left: 2px solid #2563eb;
              page-break-inside: avoid;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 10px 0;
              font-size: 11px;
              page-break-inside: avoid;
            }
            th { 
              background: #1e40af;
              color: white;
              padding: 8px;
              text-align: left;
              font-weight: 600;
              font-size: 10px;
            }
            td { 
              padding: 8px; 
              border-bottom: 1px solid #e5e7eb;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            tr { 
              page-break-inside: avoid;
              break-inside: avoid;
            }
            tr:nth-child(even) { background: #f8fafc; }
            .total-section { 
              background: linear-gradient(135deg, #f8fafc, #e2e8f0);
              padding: 15px;
              border-radius: 6px;
              margin-top: 15px;
              border: 1px solid #e5e7eb;
              page-break-inside: avoid;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 4px 0;
            }
            .total-final {
              border-top: 2px solid #059669;
              padding-top: 8px;
              margin-top: 6px;
              font-size: 14px;
            }
            .total-amount { 
              font-weight: 700; 
              color: #059669;
            }
            .footer { 
              margin-top: 20px; 
              padding-top: 15px; 
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 10px;
              color: #6b7280;
              page-break-before: avoid;
            }
            .badge {
              background: #10b981;
              color: white;
              padding: 3px 6px;
              border-radius: 10px;
              font-size: 9px;
              font-weight: 600;
            }
            
            /* Optimisations pour éviter les coupures */
            .no-print { display: none !important; }
            .public-banner {
              background: linear-gradient(135deg, #667eea, #764ba2);
              color: white;
              padding: 8px;
              text-align: center;
              margin-bottom: 15px;
              border-radius: 4px;
              font-size: 11px;
              page-break-after: avoid;
            }
            
            /* Empêcher les coupures dans les éléments importants */
            h1, h2, h3, h4, h5, h6 {
              page-break-after: avoid;
            }
            
            /* Gestion des tableaux longs */
            table {
              break-inside: auto;
            }
            
            tr {
              break-inside: avoid;
              break-after: auto;
            }
            
            /* Ajustement des marges de page */
            @page { 
              margin: 1cm;
              size: A4;
            }
            
            @page :first {
              margin-top: 1.5cm;
            }
          }
          @media screen {
            .print-only { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          ${printContent}
        </div>
      </body>
    </html>
  `;

    document.body.innerHTML = printDocument;

    // Attendre que le contenu soit chargé avant d'imprimer
    setTimeout(() => {
      window.print();

      // Restaurer le contenu original
      setTimeout(() => {
        document.body.innerHTML = originalContents;
        document.title = originalTitle;
        window.location.reload();
      }, 500);
    }, 100);
  };


  const handleGenerateToken = async () => {
    try {
      setLoadingToken(true);
      const body = {
        customerId: proforma?.customerId,
        storeId: user?.store?.id,
        proformaId: proforma?.id,
        validHours,
      };

      const res = await API.post(`/public-upload/generateLinkToShareProforma/client`, {
        ...body
      });

      setTokenData(res.data);
      console.log("Date ", tokenData)

    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingToken(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Proforma Win2Cop - ${proforma?.proformaNumber}`,
          text: `Veuillez trouver votre proforma ${proforma?.proformaNumber}`,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert('Lien copié dans le presse-papier !');
      }
    } catch (error) {
      console.error('Erreur de partage:', error);
    }
  };

  const handleDownloadPDF = () => {
    alert('Fonctionnalité PDF à implémenter');
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner text="Chargement du proforma..." isLoading />
    </div>
  );

  if (isError || !proforma) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner text="Proforma introuvable ou lien expiré" isError />
    </div>
  );

  const companyInfo = {
    name: detailStore.storeName,
    address: detailStore?.storeAddress,
    phone: detailStore?.storeContactPhone?.call,
    email: detailStore?.storeContactMail,
    website: "https://www.win2cop.com"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Bannière publique */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl mb-6 text-center">
          <h1 className="text-xl font-bold mb-2">Votre Proforma Win2Cop</h1>
          <p className="text-blue-100">Ce lien vous permet de visualiser et partager votre proforma</p>
        </div>

        {/* Actions publiques */}
        <div className="flex flex-wrap gap-3 justify-center mb-6 no-print">
          <button
            className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300 text-gray-700"
            onClick={handlePrint}
          >
            <FaPrint />
            <span>Imprimer</span>
          </button>

          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:bg-blue-700"
            onClick={handleShare}
          >
            <FaShare />
            <span>Partager</span>
          </button>

          <button
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:bg-green-700"
            onClick={handleDownloadPDF}
          >
            <FaDownload />
            <span>Télécharger PDF</span>
          </button>

          <button
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl hover:bg-indigo-700 transition"
            onClick={() => setIsTokenPanelOpen(true)}
          >
            <FaKey /> <span>Générer un lien public</span>
          </button>
        </div>

        {/* Contenu du proforma */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div ref={printRef} className="p-6">
            {/* Bannière publique pour l'impression */}
            <div className="public-banner print-only">
              <strong>PROFORMA CLIENT - WIN2COP</strong>
            </div>

            {/* En-tête d'impression */}
            <div className="print-header">
              <div className="company-info">
                <div className="logo-container">
                  <div className="logo print-only">
                    W2C
                  </div>
                  <div>
                    <h1 className="company-name">{companyInfo.name}</h1>
                    <div className="space-y-1 text-sm text-gray-600 mt-2">
                      <p>📍 {companyInfo.address}</p>
                      <p>📞 {companyInfo.phone}</p>
                      <p>✉️ {companyInfo.email}</p>
                      <p>🌐 {companyInfo.website}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="proforma-info">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">PROFORMA</h2>
                <div className="space-y-2 text-sm">
                  <p><strong>N°:</strong> <span className="text-blue-600 font-semibold">{proforma.proformaNumber}</span></p>
                  <p><strong>Date:</strong> {new Date(proforma.createdAt).toLocaleDateString('fr-FR')}</p>
                  <p><strong>Statut:</strong> <span className="badge capitalize">{proforma.status}</span></p>
                </div>
              </div>
            </div>

            {/* Informations Client */}
            <div className="section">
              <div className="section-title">
                INFORMATIONS CLIENT
              </div>
              <div className="info-card">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Nom:</strong> {proforma.customer?.firstName} {proforma.customer?.lastName}</p>
                    <p><strong>Adresse:</strong> {proforma.customer?.address || "Non renseignée"}</p>
                  </div>
                  <div>
                    <p><strong>Téléphone:</strong> {proforma.customer?.phone || "Non renseigné"}</p>
                    <p><strong>Email:</strong> {proforma.customer?.email || "Non renseigné"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Produits et Services */}
            <div className="section">
              <div className="section-title">
                PRODUITS ET SERVICES
              </div>
              <div className="overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Type</th>
                      <th className="text-center">Qté</th>
                      <th className="text-right">Prix unitaire</th>
                      <th className="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(proforma.items).map((item: any, idx: number) => (
                      <tr key={idx}>
                        <td className="font-medium text-gray-800">{item.name}</td>
                        <td className="capitalize">{item.variantType}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-right">{Number(item.price).toLocaleString()} FBu</td>
                        <td className="text-right font-semibold text-green-600">
                          {Number(item.total).toLocaleString()} FBu
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totaux */}
            <div className="total-section">
              <div className="max-w-md ml-auto">
                <div className="total-row">
                  <span>Sous-total:</span>
                  <span className="font-semibold">{Number(proforma.subtotal).toLocaleString()} FBu</span>
                </div>
                {proforma.tax > 0 && (
                  <div className="total-row">
                    <span>Taxe:</span>
                    <span className="font-semibold">{Number(proforma.tax).toLocaleString()} FBu</span>
                  </div>
                )}
                <div className="total-row total-final">
                  <strong>Total général:</strong>
                  <span className="total-amount">
                    {Number(proforma.total).toLocaleString()} FBu
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {proforma.notes && (
              <div className="section">
                <div className="section-title">
                  NOTES
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800">{proforma.notes}</p>
                </div>
              </div>
            )}

            {/* Pied de page */}
            <div className="footer">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Merci pour votre confiance !</p>
                <p className="text-xs text-gray-500">
                  {companyInfo.name} • {companyInfo.address} • {companyInfo.phone}
                </p>
                <p className="text-xs text-gray-400">
                  Document généré le {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Informations de contact */}
        <div className="mt-6 text-center text-sm text-gray-600 no-print">
          <p>Pour toute question concernant cette proforma, contactez-nous :</p>
          <p className="font-medium">{companyInfo.phone} | {companyInfo.email}</p>
        </div>

        {/* ✅ PANEL TOKEN */}
        <div
          className={`fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-2xl transform transition-transform duration-300 ${isTokenPanelOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FaKey className="text-indigo-600" /> Générer un lien public
            </h2>
            <button
              onClick={() => setIsTokenPanelOpen(false)}
              className="text-gray-500 hover:text-gray-800"
            >
              <FaTimes />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Durée de validité (en heures)
              </label>
              <input
                type="number"
                min="1"
                value={validHours}
                onChange={(e) => setValidHours(Number(e.target.value))}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <button
              disabled={loadingToken}
              onClick={handleGenerateToken}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              {loadingToken ? "Génération..." : "Générer le lien sécurisé"}
            </button>

            {tokenData && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-700 text-sm font-medium mb-2">
                  ✅ Lien généré avec succès !
                </p>
                <input
                  readOnly
                  value={`${tokenData.url}`}
                  className="w-full text-xs border border-gray-200 rounded px-2 py-1 bg-gray-50"
                />
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(tokenData.url)
                  }
                  className="mt-2 text-xs text-blue-600 underline"
                >
                  Copier le lien
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}