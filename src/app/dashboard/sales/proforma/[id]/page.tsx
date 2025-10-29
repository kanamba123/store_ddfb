"use client";

import React, { useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { FaPrint, FaArrowLeft, FaBuilding, FaUser, FaBox, FaFileAlt } from "react-icons/fa";
import { useProformaDetail } from "@/hooks/apis/useProformas";

export default function ViewProformaDetail() {
  const { id } = useParams();
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  const { data: proforma, isLoading, isError, refetch } = useProformaDetail(id as string);

  const handlePrint = () => {
    if (!printRef.current) return;
    
    const printContent = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    const originalTitle = document.title;
    
    const printDocument = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Proforma Win2Cop - ${proforma?.proformaNumber}</title>
          <style>
            @media print {
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
                color: #1f2937;
                font-size: 13px;
                line-height: 1.4;
              }
              .print-container { max-width: 100%; }
              .print-header { 
                border-bottom: 3px solid #2563eb; 
                padding-bottom: 20px; 
                margin-bottom: 25px;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
              }
              .company-info { flex: 1; }
              .proforma-info { 
                text-align: right;
                background: #f8fafc;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #2563eb;
              }
              .logo-container {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 8px;
              }
              .logo { 
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 14px;
              }
              .company-name {
                font-size: 24px;
                font-weight: 700;
                color: #1e40af;
                margin: 0;
              }
              .section { 
                margin-bottom: 20px; 
                page-break-inside: avoid;
              }
              .section-title { 
                background: linear-gradient(135deg, #2563eb, #3b82f6);
                color: white;
                padding: 10px 16px;
                font-weight: 600;
                border-radius: 6px;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 8px;
              }
              .section-title svg { width: 14px; height: 14px; }
              .info-grid { 
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
              }
              .info-card {
                background: #f8fafc;
                padding: 12px;
                border-radius: 6px;
                border-left: 3px solid #2563eb;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 12px 0;
                font-size: 12px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              th { 
                background: #1e40af;
                color: white;
                padding: 10px;
                text-align: left;
                font-weight: 600;
              }
              td { 
                padding: 10px; 
                border-bottom: 1px solid #e5e7eb;
              }
              tr:nth-child(even) { background: #f8fafc; }
              tr:hover { background: #f1f5f9; }
              .total-section { 
                background: linear-gradient(135deg, #f8fafc, #e2e8f0);
                padding: 20px;
                border-radius: 8px;
                margin-top: 20px;
                border: 1px solid #e5e7eb;
              }
              .total-row {
                display: flex;
                justify-content: space-between;
                padding: 6px 0;
              }
              .total-final {
                border-top: 2px solid #059669;
                padding-top: 10px;
                margin-top: 8px;
                font-size: 16px;
              }
              .total-amount { 
                font-weight: 700; 
                color: #059669;
              }
              .footer { 
                margin-top: 30px; 
                padding-top: 20px; 
                border-top: 2px solid #e5e7eb;
                text-align: center;
                font-size: 11px;
                color: #6b7280;
              }
              .badge {
                background: #10b981;
                color: white;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 10px;
                font-weight: 600;
              }
              @page { 
                margin: 1.5cm;
                size: A4;
              }
              .no-print { display: none !important; }
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
    window.print();
    document.body.innerHTML = originalContents;
    document.title = originalTitle;
    window.location.reload();
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner text="Chargement du proforma..." isLoading />
    </div>
  );
  
  if (isError || !proforma) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner text="Erreur ou proforma introuvable" isError />
    </div>
  );

  const companyInfo = {
    name: "Win2Cop",
    address: "Avenue de l'Université, Bujumbura",
    phone: "+257 61 123 456",
    email: "contact@win2cop.bi",
    website: "www.win2cop.bi"
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-500",
      sent: "bg-blue-500",
      accepted: "bg-green-500",
      rejected: "bg-red-500",
      expired: "bg-yellow-500"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* En-tête avec boutons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 no-print">
          <button
            className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-700"
            onClick={() => router.back()}
          >
            <FaArrowLeft className="text-lg" />
            <span className="font-medium">Retour</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
              <span className="text-sm text-gray-600">Statut:</span>
              <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(proforma.status)}`}>
                {proforma.status.toUpperCase()}
              </span>
            </div>
            <button
              className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:from-green-700 hover:to-emerald-700 font-medium"
              onClick={handlePrint}
            >
              <FaPrint className="text-lg" />
              <span>Imprimer le Proforma</span>
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div ref={printRef} className="p-8">
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
                  <p><strong>Date:</strong> {new Date(proforma.createdAt).toLocaleDateString('fr-FR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                  <p><strong>Statut:</strong> <span className="badge capitalize">{proforma.status}</span></p>
                </div>
              </div>
            </div>

            {/* Grid d'informations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Informations Client */}
              <div className="section">
                <div className="section-title">
                  <FaUser className="inline" />
                  INFORMATIONS CLIENT
                </div>
                <div className="info-card">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Nom complet</label>
                      <p className="font-medium text-gray-800">
                        {proforma.customer?.firstName} {proforma.customer?.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Adresse</label>
                      <p className="text-gray-700">{proforma.customer?.address || "Non renseignée"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Téléphone</label>
                        <p className="text-gray-700">{proforma.customer?.phone || "Non renseigné"}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
                        <p className="text-gray-700">{proforma.customer?.email || "Non renseigné"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations Magasin */}
              {proforma.store && (
                <div className="section">
                  <div className="section-title">
                    <FaBuilding className="inline" />
                    MAGASIN
                  </div>
                  <div className="info-card">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Nom du magasin</label>
                        <p className="font-medium text-gray-800">{proforma.store.name}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Adresse</label>
                        <p className="text-gray-700">{proforma.store.address || "Non renseignée"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Produits et Services */}
            <div className="section">
              <div className="section-title">
                <FaBox className="inline" />
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
                        <td>
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                            {item.variantType}
                          </span>
                        </td>
                        <td className="text-center font-semibold">{item.quantity}</td>
                        <td className="text-right font-mono">{Number(item.price).toLocaleString()} FBu</td>
                        <td className="text-right font-mono font-semibold text-green-600">
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
                  <span className="text-gray-600">Sous-total:</span>
                  <span className="font-mono font-semibold">{Number(proforma.subtotal).toLocaleString()} FBu</span>
                </div>
                {proforma.tax > 0 && (
                  <div className="total-row">
                    <span className="text-gray-600">Taxe:</span>
                    <span className="font-mono font-semibold">{Number(proforma.tax).toLocaleString()} FBu</span>
                  </div>
                )}
                <div className="total-row total-final">
                  <span className="text-lg font-bold text-gray-800">Total général:</span>
                  <span className="total-amount text-lg font-mono">
                    {Number(proforma.total).toLocaleString()} FBu
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {proforma.notes && (
              <div className="section">
                <div className="section-title">
                  <FaFileAlt className="inline" />
                  NOTES
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800 leading-relaxed">{proforma.notes}</p>
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
                  Proforma générée le {new Date().toLocaleDateString('fr-FR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}