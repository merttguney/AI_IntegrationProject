import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { FormatsModel } from "../context/FormatsModel";

export interface FileModel extends BaseStrapiModel {
  id: string;
  documentId: string;
  name: string;
  alternativeText?: any;
  type: "image" | "video" | "file";
  caption?: any;
  width: number;
  height: number;
  formats: FormatsModel;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  thumbnail?: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: any;
}
