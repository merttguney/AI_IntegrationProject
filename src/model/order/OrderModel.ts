import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { CustomerModel } from "../customer/CustomerModel";
import { QuoteModel } from "../quote/QuoteModel";
import { StoreModel } from "../store/StoreModel";
import { OrderAddressModel } from "./OrderAddressModel";
import { OrderInvoiceModel } from "./OrderInvoiceModel";
import { OrderItemModel } from "./OrderItemModel";
import { OrderPaymentModel } from "./OrderPaymentModel";
import { OrderShippingModel } from "./OrderShippingModel";
export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "shipped"
  | "completed"
  | "refund";

export interface OrderModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  bill_to_name?: string;
  ship_to_name?: string;
  grand_total?: number;
  order_status?: OrderStatus;
  order_number: string;
  currency?: string;
  items?: OrderItemModel[];
  quote?: QuoteModel;
  shippings?: OrderShippingModel[];
  payments?: OrderPaymentModel[];
  invoices?: OrderInvoiceModel[];
  addresses?: OrderAddressModel[];
  customer?: CustomerModel;
  //language?: LanguageModel;
  store?: StoreModel;
}
