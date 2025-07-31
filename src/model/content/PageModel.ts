import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { StoreViewModel } from "../store/StoreViewModel";
import { UrlModel } from "./UrlModel";
import { WidgetModel } from "./WidgetModel";

export interface PageModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  name?: string;
  h1?: string;
  meta_title?: string;
  meta_description?: string;
  store_view?: StoreViewModel;
  urls?: UrlModel[];
  widgets?: WidgetModel[];
}
