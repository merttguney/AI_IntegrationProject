import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { CategoryModel } from "../category/CategoryModel";
import { CustomerGroupModel } from "../customer/CustomerGroupModel";
import { WebsiteModel } from "../store/WebsiteModel";
import { ProductAttributeModel } from "./ProductAttributeModel";
import { ProductImageModel } from "./ProductImageModel";
import { ProductLabelModel } from "./ProductLabelModel";
import { ProductReviewModel } from "./ProductReviewModel";
import { ProductVariantModel } from "./ProductVariantModel";
import { TaxModel } from "./TaxModel";
import { VendorModel } from "./VendorModel";

export type ProductVisibility =
  | "catalog"
  | "search"
  | "catalogsearch"
  | "notvisible";
export type ProductType =
  | "simple"
  | "virtual"
  | "configurable"
  | "downloadable"
  | "visual";
export type ProductCondition = "NewCondition" | "Used";
export interface ProductModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  name: string;
  images?: ProductImageModel[];
  main_category?: CategoryModel | null;
  categories?: CategoryModel[];
  variants?: ProductVariantModel[];
  tax?: TaxModel | null;
  cross_sell_products?: ProductModel[];
  upsell_products?: ProductModel[];
  website?: WebsiteModel | null;
  reviews?: ProductReviewModel[];
  vendors?: VendorModel[];
  attributes?: ProductAttributeModel[];
  related_products?: ProductModel[];
  visibility: ProductVisibility;
  type: ProductType;
  product_status?: boolean;
  customer_group?: CustomerGroupModel | null;
  labels?: ProductLabelModel[];
  origin_country?: string;
  condition?: ProductCondition;
}
