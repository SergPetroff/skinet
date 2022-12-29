import {createAsyncThunk, createEntityAdapter, createSlice} from '@reduxjs/toolkit'
import { Action } from '@remix-run/router';
import { stat } from 'fs';
import agent from '../../app/api/agent';
import { MetaData } from '../../app/models/pagination';
import { Product, ProductParams } from '../../app/models/Product'
import { RootState } from '../../app/store/configureStore';


interface CatalogState {
    productsLoaded:boolean;
    filtersLoaded : boolean;
    status: string;
    brands: string[];
    types: string[];
    productParams: ProductParams;
    metaData: MetaData | null;
}
const productsAdapter = createEntityAdapter<Product>();


function getAxiosParams(productParams:ProductParams){
    const params = new URLSearchParams();
    params.append('pageNumber', productParams.pageNumber.toString());
    params.append('pageSize', productParams.pageSize.toString());
    params.append('orderBy', productParams.orderBy.toString());
    if(productParams.searchTerm){
        params.append('searchTerm', productParams.searchTerm.toString());
    }
    if(productParams.brands.length>0){
        params.append('brands', productParams.brands.toString());
    }
    if(productParams.types.length > 0){
        params.append('types', productParams.types.toString());
    }

    return params;
    
}

export const fetchProductsAsync = createAsyncThunk<Product[], void,{state:RootState}>(
    'catalog/fetchProductsAsync',
    async (_, thunkAPI) => {
        const params = getAxiosParams(thunkAPI.getState().catalog.productParams);
        const response:any =  await agent.Catalog.list(params);
        
        thunkAPI.dispatch(setMeteData(response.metaData))

        return response.items;
    
    }
)
export const fetchProductAsync = createAsyncThunk<Product, number>(
    'catalog/fetchProductAsync',
    async (productId) => {


        return await agent.Catalog.details(productId);
        /* try{
            return await agent.Catalog.details(productId);
        }catch(error:any){
            thunkAPI.rejectWithValue({error: error.data})
        } */
       
    
    }
)

export const fetchFilters = createAsyncThunk(
    'catalog/fetchFilters',
    async (_, thunkAPI) => {
        try{
            return agent.Catalog.fetchFilters();
        }catch(error){
            return thunkAPI.rejectWithValue({error:error})
        }
    }
)

function initParams(){
    return {
        pageNumber:1,
        pageSize:6,
        orderBy:'name',
        brands:[],
        types:[]
    }
}


export const catalogSlice = createSlice({
    name:'catalog',
    initialState: productsAdapter.getInitialState<CatalogState>({
        productsLoaded:false,
        filtersLoaded:false,
        status:'idle',
        brands:[],
        types:[],
        productParams:initParams(),
        metaData: null
    }),
    reducers:{
        setProductParams:(state, action) => {
            state.productsLoaded = false;
            state.productParams = {...state.productParams, ...action.payload, pageNumber:1};
        },
        setPageNumber:(state, action) => {
            state.productsLoaded = false;
            state.productParams ={...state.productParams, ...action.payload};
        },

        setMeteData:(state, action) => {
            state.metaData = action.payload
        },
        resetProductParams:(state) => {
            state.productParams= initParams();
        }
    },
    extraReducers:(builder => {
        builder.addCase(fetchProductsAsync.pending, (state) =>{
            state.status = 'pendingFetchProducts'

        });
        builder.addCase(fetchProductsAsync.fulfilled,(state, action) =>{
            productsAdapter.setAll(state, action.payload);
            state.status = 'idle';
            state.productsLoaded = true;
        });
        builder.addCase(fetchProductsAsync.rejected, (state) =>{
            state.status = 'idle';

        });
        builder.addCase(fetchProductAsync.pending, (state) =>{
            state.status = 'pendingFetchProduct'

        });
        builder.addCase(fetchProductAsync.fulfilled,(state, action) =>{
            productsAdapter.upsertOne(state, action.payload);
            state.status = 'idle';
        });
        builder.addCase(fetchProductAsync.rejected, (state) =>{
            state.status = 'idle';

        });
        builder.addCase(fetchFilters.pending, (state) =>{
            state.status = 'pendingFetchFilters'

        });

        builder.addCase(fetchFilters.fulfilled,(state, action) => {
     
            var payload:any = action.payload
            state.brands = payload['brands'];
            state.types =   payload['types'];
            state.status = 'idle';
            state.filtersLoaded = true;
        });

        builder.addCase(fetchFilters.rejected, (state, action) => {
            state.status = 'idle';
           
        });
       

    })
})

export const productSelectors = productsAdapter.getSelectors((state:RootState) => state.catalog);

export const {setProductParams, resetProductParams, setMeteData, setPageNumber} = catalogSlice.actions;