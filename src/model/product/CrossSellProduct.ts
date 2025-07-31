export interface CrossSellProduct {
    id: string;
    currency: string;
    name: string;
    description: string;
    price: number;
    images: { thumbnail: string; url: string }[];
}