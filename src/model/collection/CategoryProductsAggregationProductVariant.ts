import { CategoryProductsAggregationProductImage } from "./CategoryProductsAggregationProductImage";

export interface CategoryProductsAggregationProductVariant {
  id: number;
  documentId: string;
  sku: string;
  price: number;
  images: CategoryProductsAggregationProductImage[]; //TODO
}
