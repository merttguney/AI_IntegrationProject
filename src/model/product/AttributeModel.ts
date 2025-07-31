import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { LookupValueModel } from "../meta/LookupValueModel";
import { AttributeSetModel } from "./AttributeSetModel";

export type AttributeType = "text" | "number" | "lookup" | "color";
export interface AttributeModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  name?: string;
  type?: AttributeType;
  searchable?: boolean;
  label?: string;
  required?: any;
  use_in_layered?: any;
  show_on_main_grid?: any;
  attribute_sets?: AttributeSetModel[];
  lookup_values?: LookupValueModel[];
}
