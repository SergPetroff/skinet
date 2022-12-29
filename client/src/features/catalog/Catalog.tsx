
import { Grid, Paper } from "@mui/material";
import { useEffect } from "react";
import AppPagination from "../../app/Components/AppPagination";
import CheckBoxButtons from "../../app/Components/CheckBoxButtons";
import RadioButtonGroup from "../../app/Components/RadioButtonGroup";
import LoadingCpmponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchFilters, fetchProductsAsync, productSelectors, setPageNumber, setProductParams } from "./catalogSlice";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";



const sortOption = [
    { value: 'name', label: 'Alphabetical' },
    { value: 'priceDesd', label: 'Price - High to low' },
    { value: 'price', label: 'Price - Low to high' },
]


export default function Catalog() {

    const products = useAppSelector(productSelectors.selectAll);
    const { productsLoaded, filtersLoaded, brands, types, productParams, metaData } = useAppSelector(state => state.catalog)
    const dispatch = useAppDispatch();


    useEffect(() => {
        if (!productsLoaded) dispatch(fetchProductsAsync());

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productsLoaded, dispatch]);

    useEffect(() => {

        if (!filtersLoaded) dispatch(fetchFilters());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, filtersLoaded])


    if (!filtersLoaded) return <LoadingCpmponent message="Loading products ..." />

    return (
        <Grid container spacing={4}>

            <Grid item xs={3}>
                <Paper sx={{ mb: 2 }}>
                    <ProductSearch />
                </Paper>
                <Paper sx={{ md: 2, p: 2 }}>
                    <RadioButtonGroup selectedValue={productParams.orderBy}
                        options={sortOption}
                        onChange={(e) => dispatch(setProductParams({
                            orderBy: e.target.value
                        }))}
                    />
                </Paper>
                <Paper sx={{ md: 2, p: 2 }}>
                    <CheckBoxButtons
                        items={brands}
                        checked={productParams.brands!}
                        onChange={(items: string[]) => {
                            dispatch(setProductParams({
                                brands: items,
                                pageNumber: 1
                            }))
                        }}
                    />
                </Paper>
                <Paper sx={{ md: 2, p: 2 }}>
                    <CheckBoxButtons
                        items={types}
                        checked={productParams.types!}
                        onChange={(items: string[]) => {
                            dispatch(setProductParams({
                                types: items
                            }))
                        }}
                    />
                </Paper>
            </Grid>
            <Grid item xs={9}>
                <ProductList products={products} />
            </Grid>
            <Grid item xs={3}>

            </Grid>
            <Grid item xs={9} sx={{ mb: 2 }}>
                {metaData && <AppPagination
                    metaData={metaData}
                    onPageChange={
                        (page: number) => dispatch(setPageNumber({
                            pageNumber: page
                        }))
                    } />}

            </Grid>

        </Grid>


    )
}