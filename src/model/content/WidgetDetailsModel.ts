import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { CategoryModel } from "../category/CategoryModel";
import { ProductModel } from "../product/ProductModel";
import { WebsiteModel } from "../store/WebsiteModel";
import { FileModel } from "./FileModel";
import { RichTextContent } from "./RichTextContentModel";
import { UrlModel } from "./UrlModel";
import { WidgetModel } from "./WidgetModel";

export interface WidgetDetailsModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  heading: string;
  subhead?: string;
  background_color?: string;
  font_color?: string;
  cta_text?: string;
  sort_order?: number;
  url?: UrlModel;
  product?: ProductModel;
  category?: CategoryModel;
  image?: FileModel;
  content?: RichTextContent[];
  widget?: WidgetModel;
  website?: WebsiteModel;
}
