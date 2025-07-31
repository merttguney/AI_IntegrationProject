import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { CityModel } from "../meta/CityModel";
import { CustomerModel } from "./CustomerModel";

export interface CustomerAddressModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  name?: string;
  type?: string;
  address_line1?: string;
  address_line2?: string;
  town?: string;
  postal_code?: string;
  customer?: CustomerModel | undefined;
  city?: CityModel;
  phone_number?: string;
  is_shipping?: boolean;
  is_billing?: boolean;
}
