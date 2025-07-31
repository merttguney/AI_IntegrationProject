import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { FileModel } from "../content/FileModel";
import { WidgetModel } from "../content/WidgetModel";
import { LanguageModel } from "../meta/LanguageModel";
import { ThemeConfigurationModel } from "../theme/ThemeConfigurationModel";
import { StoreModel } from "./StoreModel";
import { WebsiteModel } from "./WebsiteModel";

export interface StoreViewModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  name: string;
  meta_description?: string;
  meta_keywords?: string;
  meta_title?: string;
  html_page_title?: string;
  og_image?: FileModel;
  view_id?: any;
  language?: LanguageModel;
  store?: StoreModel;
  website?: WebsiteModel;
  //direction?: string;
  widgets?: WidgetModel[];
  currencies: string;
  default_country_code: string;
  date_format?: string;
  datetime_format?: string;
  theme?: ThemeConfigurationModel;
  locale_code: string;
}
