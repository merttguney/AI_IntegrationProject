import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { ProductVariantModel } from "../product/ProductVariantModel";
import { QuoteItemModel } from "../quote/QuoteItemModel";
import { OrderItemStockModel } from "./OrderItemStockModel";
import { OrderModel } from "./OrderModel";
import { OrderShippingModel } from "./OrderShippingModel";

export type OrderItemStatus =
  | "pending"
  | "reserved"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

export interface OrderItemModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  order_item_status: OrderItemStatus;
  price: number;
  qty: number;
  product_variant?: ProductVariantModel;
  order_item_stocks?: OrderItemStockModel[];
  order?: OrderModel;
  quote_item?: QuoteItemModel;
  order_shipping?: OrderShippingModel;
}
