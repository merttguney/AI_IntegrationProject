import { StoreAddressModel } from "../store/StoreAddressModel";
import { ProductStockModel } from "../product/ProductStockModel";
import { StoreModel } from "../store/StoreModel";
import { WebsiteModel } from "../store/WebsiteModel";

export interface WarehouseModel {
  id?: string; // Unique identifier
  documentId: string;
  name: string; // Warehouse name (required, unique)
  website?: WebsiteModel; // Associated website (manyToOne relationship)
  stores?: StoreModel[]; // Stores associated with this warehouse (oneToMany relationship)
  store_address?: StoreAddressModel; // Address of the warehouse (oneToOne relationship)
  product_stocks?: ProductStockModel[]; // Product stocks in the warehouse (oneToMany relationship)
  createdAt?: string; // ISO Date format (optional)
  updatedAt?: string; // ISO Date format (optional)
  publishedAt?: string; // ISO Date format (optional)
}
