import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { LookupValueModel } from "../meta/LookupValueModel";
import { StoreViewModel } from "../store/StoreViewModel";

export interface AttributeLookupValueTranslationModel
  extends AttributeLookupValueTranslationRequestModel {
  id: number;
  documentId: string;
}

export interface AttributeLookupValueTranslationRequestModel
  extends BaseStrapiModel {
  label?: string;
  store_view?: StoreViewModel;
  value?: LookupValueModel;
  groupId?: string;
}
