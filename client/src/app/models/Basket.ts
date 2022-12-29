import { ProductBrand } from "./ProductBrand";
import { ProductType } from "./ProductType";


   

    export interface BasketItem {
        productId: number;
        name: string;
        price: number;
        pictureUrl: string;
        productBrand: ProductBrand;
        productBrandId: number;
        productType: ProductType;
        productTypeId: number;
        quantity: number;
    }

    export interface Basket {
        id: number;
        buyerId: string;
        items: BasketItem[];
    }



