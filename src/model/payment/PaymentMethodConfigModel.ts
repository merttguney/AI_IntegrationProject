import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { PaymentMethodModel } from "./PaymentMethodModel";

export interface PaymentMethodConfigModel extends BaseStrapiModel {
  documentId: string;
  id: number;
  api_key: string;
  secret_key: string;
  payment_method?: PaymentMethodModel;
}
