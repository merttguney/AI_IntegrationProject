import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { PaymentMethodModel } from "../payment/PaymentMethodModel";
import { QuoteModel } from "./QuoteModel";
import { StoreViewModel } from "../store/StoreViewModel";

export interface QuotePaymentRequestModel extends BaseStrapiModel {
  documentId: string;
  quote?: QuoteModel;
  request_id: string;
  payment_method?: PaymentMethodModel;
  store_view?: StoreViewModel;
  payment_status?: "new" | "in_progress" | "succeed" | "failed";
  log?: string;
  token?: string;
  signature?: string;
  platform?: string;
}
