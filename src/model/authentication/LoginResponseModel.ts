import { ErrorModel } from "@ibrahimbayer/strapi-http-toolkit";
import { UserModel } from "./UserModel";

export interface LoginResponseModel {
  jwt?: string;
  user?: UserModel;
  error?: ErrorModel;
}
