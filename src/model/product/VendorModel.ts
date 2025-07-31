import { ProductModel } from "./ProductModel";

export interface VendorModel {
    id:string;
    documentId:string;
    name?: string;
    products?: ProductModel[];
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
}