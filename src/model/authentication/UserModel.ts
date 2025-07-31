import { CustomerModel } from "../customer/CustomerModel";

export interface UserModel {
  id: string;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: string;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  customer?: CustomerModel;
}
