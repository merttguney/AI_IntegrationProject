import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { OrderItemModel } from "./OrderItemModel";
import { OrderModel } from "./OrderModel";

export enum InvoiceType {
  SALES = "sales",
  REFUND = "refund",
}

export interface OrderInvoiceModel extends BaseStrapiModel {
  id: number;
  documentId: string;
  invoice_number: string;
  invoice_date?: string;
  due_date?: string;
  grand_total: number;
  currency: string;
  external_reference_id?: string;
  invoice_type?: InvoiceType;
  remarks?: string;
  order?: OrderModel;
  order_items?: OrderItemModel[];
}
