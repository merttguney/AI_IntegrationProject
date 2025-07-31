import { FileModel } from "../content/FileModel";
import { PaymentMethodModel } from "../payment/PaymentMethodModel";
import { ShippingMethodModel } from "../quote/ShippingMethodModel";
import { StoreAddressModel } from "./StoreAddressModel";
import { StoreConfigurationModel } from "./StoreConfigurationModel";
import { StoreViewModel } from "./StoreViewModel";
import { WebsiteModel } from "./WebsiteModel";

export interface StoreModel {
  id: number;
  documentId: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  identifier?: string;
  url?: string;
  logo?: FileModel;
  website?: WebsiteModel;
  views?: StoreViewModel[];
  shipping_methods?: ShippingMethodModel[];
  payment_methods?: PaymentMethodModel[];
  address?: StoreAddressModel;
  newsletter_enabled?: boolean;
  store_configuration?: StoreConfigurationModel;
  facebook_pixel?: string; // Facebook Pixel ID for client-side tracking
  ga_measurement_id?: string; // Added for Google Analytics support
  tiktok_pixel?: string; // Future extension for TikTok Pixel
  adobe_analytics_id?: string; // Future extension for Adobe Analytics
}
