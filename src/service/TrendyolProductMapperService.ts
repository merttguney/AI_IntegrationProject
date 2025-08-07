/**
 * Trendyol Product Mapper Service
 * Following Single Responsibility and Open/Closed Principles
 */

import { ProductModel, ProductType, ProductVisibility } from "../model/product/ProductModel";
import { TrendyolProductModel } from "../model/trendyol/TrendyolProductModel";
import { 
  ITrendyolProductMapper, 
  MappingResult, 
  AttributeMappingConfig 
} from "../model/mapping/ProductMappingInterfaces";
import Logger from "../logger/Logger";

export class TrendyolProductMapperService implements ITrendyolProductMapper {
  private readonly logger = Logger;

  constructor() {
    // Logger is already initialized as default export
  }

  /**
   * Maps single Trendyol product to internal ProductModel
   */
  async map(source: TrendyolProductModel, websiteId: string): Promise<MappingResult<ProductModel>> {
    try {
      this.logger.info(`Mapping Trendyol product: ${source.id}`);

      // Validate input
      const validation = this.validateTrendyolProduct(source);
      if (!validation.success) {
        return {
          success: false,
          errors: validation.errors
        };
      }

      // Get attribute mappings for the website
      const attributeMappings = await this.getAttributeMappings(websiteId);

      // Map the product
      const mappedProduct: Partial<ProductModel> = {
        documentId: source.id, // Trendyol product ID'sini documentId olarak kullan
        name: source.title,
        product_status: source.approved && !source.archived && !source.rejected,
        visibility: this.mapVisibility(source),
        type: this.mapProductType(source),
        // Map other basic fields
        origin_country: this.extractCountryFromAttributes(source.attributes),
        condition: "NewCondition" as const,
        // Map variants (Trendyol products are typically variants of our products)
        variants: [this.mapToVariant(source)]
      };

      // Map attributes
      const mappedAttributes = await this.mapAttributes(source.attributes, attributeMappings);
      
      // Map variants (Trendyol products are typically variants of our products)
      const mappedVariant = this.mapToVariant(source);

      return {
        success: true,
        data: mappedProduct as ProductModel,
        warnings: []
      };

    } catch (error) {
      this.logger.error(`Error mapping Trendyol product ${source.id}: ${error}`);
      return {
        success: false,
        errors: [`Mapping failed: ${error}`]
      };
    }
  }

  /**
   * Maps multiple Trendyol products
   */
  async mapBatch(sources: TrendyolProductModel[], websiteId: string): Promise<MappingResult<ProductModel[]>> {
    const results: ProductModel[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const source of sources) {
      const result = await this.map(source, websiteId);
      
      if (result.success && result.data) {
        results.push(result.data);
      } else {
        errors.push(...(result.errors || []));
      }
      
      warnings.push(...(result.warnings || []));
    }

    return {
      success: errors.length === 0,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * Validates Trendyol product data
   */
  validateTrendyolProduct(product: TrendyolProductModel): MappingResult<boolean> {
    const errors: string[] = [];

    if (!product.id) errors.push("Product ID is required");
    if (!product.title) errors.push("Product title is required");
    if (!product.productMainId) errors.push("Product main ID is required");
    if (!product.barcode) errors.push("Product barcode is required");
    if (product.listPrice <= 0) errors.push("Product price must be greater than 0");

    return {
      success: errors.length === 0,
      data: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  /**
   * Gets attribute mappings for website
   * In real implementation, this would come from database/config
   */
  async getAttributeMappings(websiteId: string): Promise<AttributeMappingConfig[]> {
    // Mock attribute mappings - in real implementation, fetch from database
    return [
      {
        trendyolAttributeId: 295,
        trendyolAttributeName: "Web Color",
        targetAttributeId: 1,
        targetAttributeName: "color",
        mappingType: "lookup"
      },
      {
        trendyolAttributeId: 47,
        trendyolAttributeName: "Renk",
        targetAttributeId: 1,
        targetAttributeName: "color",
        mappingType: "lookup"
      },
      {
        trendyolAttributeId: 293,
        trendyolAttributeName: "Beden",
        targetAttributeId: 2,
        targetAttributeName: "size",
        mappingType: "lookup"
      },
      {
        trendyolAttributeId: 296,
        trendyolAttributeName: "Cinsiyet",
        targetAttributeId: 3,
        targetAttributeName: "gender",
        mappingType: "lookup"
      }
    ];
  }

  /**
   * Maps Trendyol visibility to internal visibility
   */
  private mapVisibility(source: TrendyolProductModel): ProductVisibility {
    if (source.approved && !source.archived && !source.rejected) {
      return "catalogsearch";
    }
    return "notvisible";
  }

  /**
   * Maps Trendyol product to internal product type
   */
  private mapProductType(source: TrendyolProductModel): ProductType {
    // For now, assume all Trendyol products are simple
    // This can be enhanced based on business rules
    return "simple";
  }

  /**
   * Extracts country information from attributes
   */
  private extractCountryFromAttributes(attributes: any[]): string | undefined {
    // Look for country-related attributes
    const countryAttr = attributes.find(attr => 
      attr.attributeName?.toLowerCase().includes('country') ||
      attr.attributeName?.toLowerCase().includes('ülke')
    );
    
    return countryAttr?.attributeValue || "TR"; // Default to Turkey
  }

  /**
   * Maps attributes from Trendyol to internal format
   */
  private async mapAttributes(
    trendyolAttributes: any[], 
    mappingConfig: AttributeMappingConfig[]
  ): Promise<any[]> {
    const mappedAttributes: any[] = [];

    for (const trendyolAttr of trendyolAttributes) {
      const mapping = mappingConfig.find(m => 
        m.trendyolAttributeId === trendyolAttr.attributeId ||
        m.trendyolAttributeName === trendyolAttr.attributeName
      );

      if (mapping) {
        let mappedValue = trendyolAttr.attributeValue;
        
        // Apply transformation if needed
        if (mapping.transformFunction) {
          mappedValue = mapping.transformFunction(mappedValue);
        }

        mappedAttributes.push({
          attribute_id: mapping.targetAttributeId,
          attribute_name: mapping.targetAttributeName,
          value_text: mappedValue,
          value_lookup_id: trendyolAttr.attributeValueId
        });
      }
    }

    return mappedAttributes;
  }

  /**
   * Maps Trendyol product to ProductVariant
   */
  private mapToVariant(source: TrendyolProductModel): any {
    return {
      documentId: `${source.id}-variant-1`, // Variant için unique ID
      sku: source.stockCode,
      barcode: source.barcode,
      currency: "TRY", // Assume Turkish Lira for Trendyol
      price: source.salePrice || source.listPrice,
      base_price: source.listPrice,
      variant_status: source.approved && !source.archived,
      // Map stock information
      stock_quantity: source.quantity,
      // Map images
      images: source.images.map((img, index) => ({
        url: img.url,
        sort_order: index
      }))
    };
  }
}
