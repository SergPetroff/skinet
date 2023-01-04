import axios, { AxiosError, AxiosResponse } from "axios";
import { Product } from "../models/Product";
import {  toast } from 'react-toastify';
import { PaginatedResponse } from "../models/pagination";
import { store } from "../store/configureStore";


axios.defaults.baseURL="http://localhost:5001/api/"
axios.defaults.withCredentials = true

const sleep = () => new Promise(resolve => setTimeout(resolve, 500))
const responseBody = <T>(response: AxiosResponse<T>) => response.data

axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token;
    if(token) config.headers!.Authorization = `Bearer ${token}`
    return config
})

axios.interceptors.response.use(async response =>{
    await sleep()
    const pagination =response.headers['pagination'];
    
    if(pagination){
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination))
       
        return response;
    }
    return response
}, (error: AxiosError) => {
    const {data,status} = error.response as any;
    switch(status){
        case 400:
            if(data.errors){
                const modelStateErrors: string[] = []
                for(const key in data.errors){
                    if(data.errors[key]){
                        modelStateErrors.push(data.errors[key])
                    }
                }

                throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;
        case 401:
            console.log('un')
            toast.error(data.title);
            break;
        case 500:
            
            break;
        default:
            break;
    }
    return Promise.reject(error.response);
})

const request = {
    get:<T>(url:string, params?: URLSearchParams) => axios.get<T>(url,{params}).then(responseBody),
    post:(url:string, body:{}) => axios.post(url, body).then(responseBody),
    put:(url:string, body:{}) => axios.put(url, body).then(responseBody),
    delete:(url:string) => axios.delete(url).then(responseBody)

}

const Catalog = {
    list: (params:URLSearchParams) => request.get<Product[]>('products', params),
    details:(id:number) => request.get<Product>(`products/${id}`),
    fetchFilters:() => request.get('products/filters')
}

const TestErrors = {
    get400Error: () => request.get('buggy/bad-request'),
    get401Error: () => request.get('buggy/unauthorised'),
    get404Error: () => request.get('buggy/not-found'),
    get500Error: () => request.get('buggy/server-error'),
    getValidationError: () => request.get('buggy/validation-error'),

}

const Basket = {
    get: () => request.get('basket'),
    addItem:(productId:number, quantity =1) => request.post(`basket?productId=${productId}&quantity=${quantity}`,{}),
    removeItem:(productId:number, quantity =1) => request.delete(`basket?productId=${productId}&quantity=${quantity}`)

}

const Account ={
    login: (values:any) => request.post('account/login', values),
    register:(values:any) => request.post('account/register', values),
    currentUser: () => request.get('account/currentUser'),
    fetchAddress:()=> request.get('account/savedAddress')
}

const Orders ={
    list: () => request.get('orders'),
    fetch:(id:number) => request.get(`orders/${id}`),
    create:(values:any) => request.post('orders', values)
    
}

const agent = {
    Catalog,TestErrors,Basket,Account,Orders
}

export default agent