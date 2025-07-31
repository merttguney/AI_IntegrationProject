import { FindOneResponseModel } from "@ibrahimbayer/strapi-http-toolkit";
import { QuoteItemModel } from "./QuoteItemModel";
import { QuoteModel } from "./QuoteModel";

export interface MyCartStateModel {
  removeItemFromCart: (quoteItemId: string, successMessage: string) => void;
  updateCart: (overrideCurrency?: string) => Promise<boolean>;
  addProductToCart: (
    productId: string,
    qty: number,
    currency: string
  ) => Promise<FindOneResponseModel<QuoteItemModel> | undefined>;
  quote?: QuoteModel;
  setQuote: (quote: QuoteModel) => void;
}
