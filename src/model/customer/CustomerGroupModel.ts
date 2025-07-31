import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";

export interface CustomerGroupModel extends BaseStrapiModel {
  id: number;
  documentId?: string;
  name?: string;
  type?: "personal" | "corporate";
}
