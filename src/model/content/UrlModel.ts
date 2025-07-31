import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { CategoryTranslationModel } from "../category/CategoryTranslationModel";
import { ProductTranslationModel } from "../product/ProductTranslationModel";
import { StoreViewModel } from "../store/StoreViewModel";
import { PageModel } from "./PageModel";

export interface UrlModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  key: string;
  page?: PageModel;
  product?: ProductTranslationModel;
  category?: CategoryTranslationModel;
  store_view?: StoreViewModel;
}
