import { AttributeModel } from "./AttributeModel";

export interface AttributeSetModel {
    id: number;
    documentId: string;
    name?: string; 
    attributes?: AttributeModel[];
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  }