import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { WebsiteModel } from "../store/WebsiteModel";

export interface ConfigModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  parameter: string;
  website?: WebsiteModel;
  value: string;
}
