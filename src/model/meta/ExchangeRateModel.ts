import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { WebsiteModel } from "../store/WebsiteModel";

export interface ExchangeRateModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  rate?: number;
  from: string;
  to: string;
  website?: WebsiteModel;
}
