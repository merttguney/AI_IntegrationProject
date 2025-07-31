import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit/dist/BaseStrapiModel";
import { AttributeSetModel } from "../product/AttributeSetModel";
import { ProductModel } from "../product/ProductModel";
import { StoreModel } from "../store/StoreModel";
import { CategoryTranslationModel } from "./CategoryTranslationModel";

export interface CategoryModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  name: string;
  enabled: boolean;
  show_in_menu: boolean;
  children?: CategoryModel[];
  parent?: CategoryModel;
  category_translations?: CategoryTranslationModel[];
  attribute?: AttributeSetModel;
  stores?: StoreModel[];
  products?: ProductModel[];
}
