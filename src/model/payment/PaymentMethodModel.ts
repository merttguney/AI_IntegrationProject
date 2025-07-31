import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { FileModel } from "../content/FileModel";
import { StoreModel } from "../store/StoreModel";
import { WebsiteModel } from "../store/WebsiteModel";
import { PaymentMethodConfigModel } from "./PaymentMethodConfigModel";

export interface PaymentMethodModel extends BaseStrapiModel {
  id: number; // Payment method unique identifier
  documentId: string;
  name: string;
  handler?: string;
  logo?: FileModel;
  type: "on_delivery" | "web_online" | "credit_card";
  website?: WebsiteModel;
  store?: StoreModel;
  description: string;
  url: string;
  enabled: boolean;
  payment_method_configuration?: PaymentMethodConfigModel;
}
