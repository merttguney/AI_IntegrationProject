import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { StoreViewModel } from "../store/StoreViewModel";
import { WebsiteModel } from "../store/WebsiteModel";
import { FileModel } from "./FileModel";
import { PageFooterFlex } from "./PageFooterFlex";
import { UrlModel } from "./UrlModel";

export interface FooterAttributes extends BaseStrapiModel {
  id: number;
  documentId: string;
  flex: PageFooterFlex;
  sort_order: number;
  header_label: string;
  website?: WebsiteModel;
  store_view?: StoreViewModel;
  details?: DetailsFooterAttributes[];
}

export interface DetailsFooterAttributes extends BaseStrapiModel {
  id: number;
  documentId: string;
  label: string;
  sort_order: number;
  website?: WebsiteModel;
  icon?: FileModel;
  page_footer?: FooterAttributes;
  url?: UrlModel;
}
