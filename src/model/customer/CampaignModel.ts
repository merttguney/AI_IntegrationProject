import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { CategoryModel } from "../category/CategoryModel";
import { PageModel } from "../content/PageModel";
import { ProductModel } from "../product/ProductModel";
import { CustomerGroupModel } from "./CustomerGroupModel";
export type CampaignApplyToEnum = "product" | "bag";

export interface CampaignModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  name: string;
  valid_from: string;
  valid_until: string;
  apply_to?: CampaignApplyToEnum;
  min_price?: number;
  max_price?: number;
  discount_percentage?: number;
  percentage_amount?: number;
  customer_groups?: CustomerGroupModel[];
  categories?: CategoryModel[];
  products?: ProductModel[];
  page?: PageModel;
}
