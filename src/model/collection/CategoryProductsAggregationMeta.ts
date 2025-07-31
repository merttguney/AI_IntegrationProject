import { CategoryProductsAggregationMetaAttributes } from "./CategoryProductsAggregationMetaAttributes";

export interface CategoryProductsAggregationMeta {
  product_count: number;
  min_price: number;
  max_price: number;
  attributes: CategoryProductsAggregationMetaAttributes[];
}
