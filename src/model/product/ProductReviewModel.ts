import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { ProductModel } from "./ProductModel";

export interface ProductReviewModel extends BaseStrapiModel {
  id: string;
  documentId: string;
  title: string;
  reviewer?: string;
  description?: string;
  rating: number;
  visible: boolean;
  product: ProductModel;
}
