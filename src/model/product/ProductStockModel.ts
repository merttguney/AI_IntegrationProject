import { ProductVariantModel } from "./ProductVariantModel";
import { WarehouseModel } from "../warehouse/WarehouseModel";
import { OrderItemStockModel } from "../order/OrderItemStockModel";


export interface ProductStockModel {
  id?: string;
  documentId: string;
  qty: number;
  sold_qty: number;
  warehouse?: WarehouseModel;
  variant?: ProductVariantModel; // Variant (manyToOne relationship)
  order_item_stocks?: OrderItemStockModel[];
  createdAt: string; // ISO Date format (optional)
  updatedAt: string; // ISO Date format (optional)
  publishedAt: string; // ISO Date format (optional)
}
