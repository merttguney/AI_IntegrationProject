import { CategoryProductsAggregationMetaAttributesLookup } from "./CategoryProductsAggregationMetaAttributesLookup"

export interface CategoryProductsAggregationMetaAttributes {
    attribute_id: number
    attribute_label: string,
    product_attribute_id: number,
    value_type: "lookup" | "text" | "number",
    lookup_values: CategoryProductsAggregationMetaAttributesLookup[]
}