import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { StoreViewModel } from "../store/StoreViewModel";
import { WebsiteModel } from "../store/WebsiteModel";
import { PageModel } from "./PageModel";
import { WidgetDetailsModel } from "./WidgetDetailsModel";

export enum HomepageWidgetEnum {
  PRODUCT = "product",
  CAROUSEL = "carousel",
  BANNER = "banner",
  IMAGE = "image",
  PAGE = "page",
  CATEGORY = "category",
}

export interface WidgetModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  sort_order?: number;
  type?: HomepageWidgetEnum;
  name: string;
  widget_details?: WidgetDetailsModel[];
  store_view?: StoreViewModel;
  website?: WebsiteModel;
  page?: PageModel;
}
