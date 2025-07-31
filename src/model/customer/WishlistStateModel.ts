import { ProductModel } from "../product/ProductModel"

export interface WishlistStateModel {
    products?: ProductModel[]
    counter?: number
}