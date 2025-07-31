import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";

export interface CityModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  name?: string;
  country?: string;
}
