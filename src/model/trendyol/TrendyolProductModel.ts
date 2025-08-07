/**
 * Trendyol Product Model
 * Represents the exact structure from Trendyol API
 * Single Responsibility: Define Trendyol product data structure
 */

export interface TrendyolProductAttribute {
  attributeId: number;
  attributeName: string;
  attributeValue: string;
  attributeValueId?: number;
}

export interface TrendyolProductImage {
  url: string;
}

export interface TrendyolRejectReasonDetail {
  rejectReason: string;
  rejectReasonDetail: string;
}

export interface TrendyolProductModel {
  id: string;
  approved: boolean;
  archived: boolean;
  attributes: TrendyolProductAttribute[];
  barcode: string;
  batchRequestId?: string;
  brand: string;
  brandId: number;
  categoryName: string;
  createDateTime: number;
  description: string;
  dimensionalWeight: number;
  gender?: string;
  hasActiveCampaign: boolean;
  images: TrendyolProductImage[];
  lastPriceChangeDate?: string;
  lastStockChangeDate?: string;
  lastUpdateDate: number;
  listPrice: number;
  locked: boolean;
  lockReason?: string;
  onSale: boolean;
  pimCategoryId: number;
  platformListingId: string;
  productCode?: number;
  productContentId?: number;
  productMainId: string;
  quantity: number;
  salePrice: number;
  stockCode: string;
  stockUnitType: string;
  supplierId: number;
  title: string;
  vatRate: number;
  version?: number;
  rejected: boolean;
  rejectReasonDetails: TrendyolRejectReasonDetail[];
  blacklisted: boolean;
  hasHtmlContent?: boolean;
  productUrl?: string;
}
