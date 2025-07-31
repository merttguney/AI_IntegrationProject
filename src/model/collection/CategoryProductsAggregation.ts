import { ErrorModel } from "@ibrahimbayer/strapi-http-toolkit";
import { CategoryProductsAggregationMeta } from "./CategoryProductsAggregationMeta";
import { CategoryProductsAggregationProduct } from "./CategoryProductsAggregationProduct";

export interface CategoryProductsAggregation {
  products: CategoryProductsAggregationProduct[];
  meta: CategoryProductsAggregationMeta;
  error?: ErrorModel;
}
