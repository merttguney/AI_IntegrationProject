import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { StoreModel } from "./StoreModel";

export interface StoreConfigurationModel extends BaseStrapiModel {
  documentId: string;
  id: number;
  facebook_access_token?: string; // Facebook Pixel Access Token for server-side tracking
  facebook_test_event_code?: string; // Facebook Test Event Code for testing pixel events
  ga_api_secret?: string; // Google Analytics API Secret for server-side tracking
  google_tag_manager_id?: string; // Google Tag Manager ID for enhanced tracking
  google_ads_conversion_id?: string; // Google Ads Conversion ID for ad tracking
  google_ads_conversion_label?: string; // Google Ads Conversion Label for specific conversions
  google_ads_remarketing_id?: string; // Google Ads Remarketing ID for retarget
  store?: StoreModel;
}
