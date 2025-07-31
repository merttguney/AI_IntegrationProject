import { ErrorModel } from "@ibrahimbayer/strapi-http-toolkit";

export interface ForgotPasswordModel {
  ok?: boolean;
  email?: string;
  error?: ErrorModel;
}
