import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { WebsiteModel } from "../store/WebsiteModel";

export interface LanguageModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  code: string;
  name: string;
  website?: WebsiteModel;
}
