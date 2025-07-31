import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { UserModel } from "../authentication/UserModel";
import { FileModel } from "../content/FileModel";
import { OrderModel } from "../order/OrderModel";
import { WebsiteModel } from "../store/WebsiteModel";
import { CustomerAddressModel } from "./CustomerAddressModel";
import { CustomerGroupModel } from "./CustomerGroupModel";
import { CustomerPreferenceModel } from "./CustomerPreferenceModel";

export interface CustomerModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  name: string;
  surname?: string;
  gender?: string;
  birth_date?: string;
  addresses?: CustomerAddressModel[];
  user?: UserModel;
  preference?: CustomerPreferenceModel;
  group?: CustomerGroupModel;
  website?: WebsiteModel;
  profile_image?: FileModel;
  orders?: OrderModel[];
  phone_number?: string;
}
