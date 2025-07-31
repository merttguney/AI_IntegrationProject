import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { WebsiteModel } from "../store/WebsiteModel";
import { CustomerModel } from "./CustomerModel";

export interface NewsletterModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  email?: string;
  customer?: CustomerModel;
  website?: WebsiteModel;
}
