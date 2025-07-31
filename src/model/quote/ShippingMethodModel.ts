import { StoreModel } from "../store/StoreModel";
import { WebsiteModel } from "../store/WebsiteModel";

export interface ShippingMethodModel {
  id: number;
  documentId: string;
  name: string;
  method?: string;
  carrier?: string;
  sort_order?: number;
  price?: number;
  currency: string;
  enabled?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  website: WebsiteModel;
  store: StoreModel;
}
