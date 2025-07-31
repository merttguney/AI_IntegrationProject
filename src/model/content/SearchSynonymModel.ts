import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { StoreViewModel } from "../store/StoreViewModel";
import { WebsiteModel } from "../store/WebsiteModel";

export interface SearchSynonymModel extends BaseStrapiModel {
  id: string;
  documentId: string;
  synonym: string;
  store_view?: StoreViewModel;
  website?: WebsiteModel;
}
