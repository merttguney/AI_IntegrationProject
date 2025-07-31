import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { AttributeLookupValueTranslationModel } from "../product/AttributeLookupValueTranslationModel";
import { AttributeModel } from "../product/AttributeModel";

export interface LookupValueModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  translations?: AttributeLookupValueTranslationModel[];
  attribute?: AttributeModel;
}
