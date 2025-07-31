import { RichTextContent } from "../content/RichTextContentModel";
import { CategoryProductsAggregationProductImage } from "./CategoryProductsAggregationProductImage";
import { CategoryProductsAggregationProductVariant } from "./CategoryProductsAggregationProductVariant";

export interface CategoryProductsAggregationProduct {
  productId: string;
  name: string;
  tax: number;
  currency?: string;
  price: number;
  priceWithTax: number;
  url: string;
  variantCount: number;
  imageCount: number;
  images: CategoryProductsAggregationProductImage[];
  variants: CategoryProductsAggregationProductVariant[];
  status?: boolean
  summary: RichTextContent[];
  faq: RichTextContent[]
  material: RichTextContent[]
  size: RichTextContent[]
}

