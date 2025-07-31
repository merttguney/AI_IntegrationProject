import { ShippingMethodModel } from "../quote/ShippingMethodModel";
import { OrderItemModel } from "./OrderItemModel";
import { OrderModel } from "./OrderModel";

export type OrderShippingStatus =
  | "not_required"
  | "pending"
  | "ready_to_ship"
  | "in_transit"
  | "delivered"
  | "delayed"
  | "returned"
  | "failed";
export interface OrderShippingModel {
  id: number;
  documentId: string;
  tracking_number?: string;
  order_shipping_status?: OrderShippingStatus;
  order?: OrderModel;
  shipping_method?: ShippingMethodModel;
  order_items?: OrderItemModel[];
  price: number;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  estimated_delivery_date?: string;
  actual_delivery_date?: string;
}
