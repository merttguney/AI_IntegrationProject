import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { CustomerAddressModel } from "../customer/CustomerAddressModel";
import { CityModel } from "../meta/CityModel";
import { QuoteModel } from "./QuoteModel";

export interface QuoteAddressModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  name?: string;
  surname?: string;
  address_line1: string;
  address_line2: string;
  town: string;
  postal_code: string;
  city?: CityModel;
  customer_address?: CustomerAddressModel;
  quote?: QuoteModel;
  is_shipping?: boolean;
  is_billing?: boolean;
}
