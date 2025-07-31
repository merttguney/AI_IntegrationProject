import { CategoryModel } from "./CategoryModel";
import { StoreViewModel } from "../store/StoreViewModel";
import { UrlModel } from "../content/UrlModel";
import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";

export interface CategoryTranslationModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  name: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  category?: CategoryModel;
  store_view?: StoreViewModel;
  urls?: UrlModel[];
}
