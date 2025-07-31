import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { ProductModel } from "../product/ProductModel";
import { CustomerModel } from "./CustomerModel";
import { ProductVariantModel } from "../product/ProductVariantModel";

export interface CustomerPreferenceModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  product_variants?: ProductVariantModel[];
  customer?: CustomerModel;
}
