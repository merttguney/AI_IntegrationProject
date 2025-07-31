import { ProductAttributeModel } from "./ProductAttributeModel";
import { ProductBulkPriceModel } from "./ProductBulkPriceModel";
import { ProductImageModel } from "./ProductImageModel";
import { ProductModel } from "./ProductModel";
import { ProductStockModel } from "./ProductStockModel";
import { ProductTranslationModel } from "./ProductTranslationModel";

export interface ProductVariantModel {
  id: number;
  documentId: string;
  sku: string;
  name?: string;
  display_order?: number;
  barcode?: string;
  ean?: string;
  currency: string;
  price: number;
  base_price?: number;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  is_in_stock?: ProductStockModel | null;
  bulk_prices?: ProductBulkPriceModel[];
  images?: ProductImageModel[];
  product?: ProductModel | null;
  attributes?: ProductAttributeModel[];
  translations?: ProductTranslationModel[];
  variant_status?: boolean;
}
