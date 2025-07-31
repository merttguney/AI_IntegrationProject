import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { RichTextContent } from "../content/RichTextContentModel";
import { UrlModel } from "../content/UrlModel";
import { StoreViewModel } from "../store/StoreViewModel";
import { ProductVariantModel } from "./ProductVariantModel";

export interface ProductTranslationModel extends BaseStrapiModel {
  id: number;
  name: string;
  documentId: string;
  seo_title: string;
  store_view: StoreViewModel;
  variant?: ProductVariantModel;
  urls: UrlModel[];
  summary: RichTextContent[];
  faq: RichTextContent[];
  material: RichTextContent[];
  size: RichTextContent[];
}
