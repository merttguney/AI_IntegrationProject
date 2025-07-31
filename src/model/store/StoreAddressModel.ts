import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { CityModel } from "../meta/CityModel";
import { StoreModel } from "./StoreModel";
import { WebsiteModel } from "./WebsiteModel";

export interface StoreAddressModel extends BaseStrapiModel {
  id?: string;
  documentId: string;
  address_line1?: string;
  address_line2?: string;
  latitude?: number;
  longitude?: number;
  email_address?: string;
  phone_number?: string;
  name?: string;
  website?: WebsiteModel;
  city?: CityModel;
  store?: StoreModel;
}
