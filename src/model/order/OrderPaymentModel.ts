import { PaymentMethodModel } from "../payment/PaymentMethodModel";
import { OrderModel } from "./OrderModel";

export type OrderPaymentStatus =
  | "pending"
  | "authorized"
  | "captured"
  | "failed"
  | "refunded"
  | "partially_refunded"
  | "cancelled";
export interface OrderPaymentModel {
  id: number;
  documentId: string;
  grand_total: number;
  currency: string;
  order_payment_status: OrderPaymentStatus;
  external_reference_id?: string;
  order?: OrderModel;
  payment_method?: PaymentMethodModel;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}
