import { ProductStockModel } from "../product/ProductStockModel";
import { OrderItemModel } from "./OrderItemModel";

export interface OrderItemStockModel {
  id?: string;
  documentId: string;
  qty?: number;
  product_stock?: ProductStockModel;
  order_item?: OrderItemModel;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}
