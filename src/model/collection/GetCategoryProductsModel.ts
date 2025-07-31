import { CategoryProductAttributesModel } from "../category/CategoryProductAttributesModel";
import { CategoryProductPaginationModel } from "./CategoryProductPaginationModel";

export interface GetCategoryProductsModel {
  category_id: string;
  store_view_id: string;
  min_price?: number;
  max_price?: number;
  attributes?: CategoryProductAttributesModel[];
  sort?: any[];
  pagination?: CategoryProductPaginationModel;
}
