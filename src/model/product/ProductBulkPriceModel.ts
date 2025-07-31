import { ProductVariantModel } from "./ProductVariantModel";

export interface ProductBulkPriceModel {
  id?: number;
  documentId: string;
  min_order?: number;
  max_order?: number;
  price?: string; // using string for precision in monetary values
  variant: ProductVariantModel; // assuming the variant has a defined model
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}
