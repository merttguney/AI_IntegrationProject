import { FileModel } from "../content/FileModel";
import { ProductModel } from "./ProductModel";
import { ProductVariantModel } from "./ProductVariantModel";

export interface ProductImageModel {
  id: number; // Benzersiz kimlik
  documentId: string;
  image?: FileModel; // Medya türü alan
  variant?: ProductVariantModel; // Product Variant ilişkisi
  product?: ProductModel; // Product ilişkisi
  createdAt?: string; // Oluşturulma tarihi
  updatedAt?: string; // Güncellenme tarihi
  publishedAt?: string; // Yayınlanma tarihi
}
