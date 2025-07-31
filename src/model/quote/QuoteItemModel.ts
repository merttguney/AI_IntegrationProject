import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { ProductVariantModel } from "../product/ProductVariantModel";
import { QuoteModel } from "./QuoteModel";

export interface QuoteItemModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  qty: number;
  calculated_price: number;
  quote?: QuoteModel;
  product_variant?: ProductVariantModel;
  quote_item_status?: string;
}
