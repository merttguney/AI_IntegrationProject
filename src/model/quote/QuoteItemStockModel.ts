import { ProductStockModel } from "../product/ProductStockModel";
import { QuoteItemModel } from "./QuoteItemModel";


export interface QuoteItemStockModel {
  id?: string; // Unique identifier
  documentId: string;
  qty: number; // Quantity associated with the stock
  quote_item?: QuoteItemModel; // Associated quote item (manyToOne relationship)
  product_stock?: ProductStockModel; // Associated product stock (manyToOne relationship)
  createdAt?: string; // ISO Date format (optional)
  updatedAt?: string; // ISO Date format (optional)
  publishedAt?: string; // ISO Date format (optional)
}
