import { OrderModel } from "../order/OrderModel";
import { QuoteAddressModel } from "./QuoteAddressModel";
import { QuoteItemModel } from "./QuoteItemModel";
import { ShippingMethodModel } from "./ShippingMethodModel";
import { StoreModel } from "../store/StoreModel";
import { CustomerModel } from "../customer/CustomerModel";
import { PaymentMethodModel } from "../payment/PaymentMethodModel";

export type QuoteStatus = "new" | "ordered" | "cancelled";

export interface QuoteModel {
  id: number;
  documentId: string;
  email?: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  phone_number?: any;
  quote_status?: QuoteStatus;
  token?: string;
  quote_items?: QuoteItemModel[]; //
  order?: OrderModel; //
  customer?: CustomerModel; //
  store?: StoreModel; //
  addresses?: QuoteAddressModel[]; //
  payment_method?: PaymentMethodModel;
  shipping_method?: ShippingMethodModel; //
  currency: string;
  total_price_without_tax?: number;
  total_price_with_tax?: number;
  total_product_counter?: number;
  total_tax?: number;
  total_shipping?: number;
  vat_number?: string;
  vat_office?: string;
  company?: string;
}
