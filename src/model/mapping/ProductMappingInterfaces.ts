/**
 * Product Mapping Interfaces
 * Following Interface Segregation Principle
 */

import { ProductModel } from "../product/ProductModel";
import { TrendyolProductModel } from "../trendyol/TrendyolProductModel";

/**
 * Mapping result interface
 */
export interface MappingResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
  warnings?: string[];
}

/**
 * Attribute mapping configuration
 */
export interface AttributeMappingConfig {
  trendyolAttributeId: number;
  trendyolAttributeName: string;
  targetAttributeId: number;
  targetAttributeName: string;
  mappingType: 'direct' | 'lookup' | 'transform';
  transformFunction?: (value: string) => any;
}

/**
 * Base mapper interface following Dependency Inversion Principle
 */
export interface IProductMapper<TSource, TTarget> {
  map(source: TSource, websiteId: string): Promise<MappingResult<TTarget>>;
  mapBatch(sources: TSource[], websiteId: string): Promise<MappingResult<TTarget[]>>;
}

/**
 * Trendyol specific mapper interface
 */
export interface ITrendyolProductMapper extends IProductMapper<TrendyolProductModel, ProductModel> {
  getAttributeMappings(websiteId: string): Promise<AttributeMappingConfig[]>;
  validateTrendyolProduct(product: TrendyolProductModel): MappingResult<boolean>;
}
