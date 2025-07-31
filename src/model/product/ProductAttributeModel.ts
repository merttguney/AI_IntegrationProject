import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { LookupValueModel } from "../meta/LookupValueModel";
import { AttributeModel } from "./AttributeModel";
import { ProductModel } from "./ProductModel";
import { ProductVariantModel } from "./ProductVariantModel";

export interface ProductAttributeModel extends BaseStrapiModel {
  id?: number;
  documentId?: string;
  value_text?: string;
  value_number?: any;
  lookup_value?: LookupValueModel;
  attribute?: AttributeModel;
  product?: ProductModel;
  variant?: ProductVariantModel;
}
