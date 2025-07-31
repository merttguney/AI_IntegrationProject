import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { CityModel } from "../meta/CityModel";
import { OrderModel } from "./OrderModel";

export type OrderAddressStatus = "valid" | "invalid" | "pending_verification";

export interface OrderAddressModel extends BaseStrapiModel {
  id: string;
  documentId: string;
  name?: string;
  phone_number?: string;
  email?: string;
  order_address_status?: OrderAddressStatus;
  address_line1?: string;
  address_line2?: string;
  postcode?: string;
  town?: string;
  city?: CityModel;
  state?: string;
  country?: string;
  is_billing?: boolean;
  is_shipping?: boolean;
  order?: OrderModel;
  company_name?: string;
}
