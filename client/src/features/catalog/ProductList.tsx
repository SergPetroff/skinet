import { Grid } from "@mui/material"
import { Product } from "../../app/models/Product"
import { useAppSelector } from "../../app/store/configureStore"
import ProductCard from "./ProductCard"
import ProductCardSkeleton from "./ProductCardSceleton"



interface Props {
    products: Product[]
}

export default function ProductList({ products }: Props) {

    const { productsLoaded } = useAppSelector(state => state.catalog);

    const render_prod = products.map(product =>
    (
        <Grid item xs={4} key={product.id} >
            {!productsLoaded ? (
                <ProductCardSkeleton />
            ) : <ProductCard product={product} />}

        </Grid>

    ))
    return (
        <Grid container spacing={4}>
            {render_prod}
        </Grid>
    )
}