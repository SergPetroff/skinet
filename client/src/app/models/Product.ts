import { ProductBrand } from "./ProductBrand";
import { ProductType } from "./ProductType";


    export interface Product {
        id: number;
        name: string;
        description: string;
        price: number;
        pictureUrl: string;
        productType?: ProductType;
        productTypeId?: number;
        productBrand?: ProductBrand;
        productBrandId?: number;
        quantityInStock:number;
    }

    export interface ProductParams {
        orderBy: string;
        searchTerm?:string;
        types:string[];
        brands:string[];
        pageNumber:number;
        pageSize:number;
    }

