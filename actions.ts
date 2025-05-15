"use server";

import ebilling from "@/lib/ebilling";

export async function createInvoiceOnServer(data: {
  payer_msisdn: string;
  amount: number;
  short_description: string;
  payer_email: string;
  description: string;
  external_reference: string;
}) {
  const invoice = await ebilling.createInvoice(data);
  return invoice;
}

export async function getGatewayUrl(billId: string) {
    try {
      const { url } = await ebilling.getGatewayPortal(
        billId,
        "http://localhost:3000/paiement/success",
        "http://localhost:3000/api/notification-ebilling"
      );
  
      return { url };
    } catch (error) {
      console.error("Erreur génération URL portail :", error);
      throw error;
    }
  }

  