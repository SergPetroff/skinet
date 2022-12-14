using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using API.Extensions;
using Microsoft.EntityFrameworkCore;
using API.RequestHelpers;
using System.Text.Json;

namespace API.Controllers
{ 
    public class ProductsController:BaseApiController
    {
        private readonly IProductRepository _repo;
        public ProductsController(IProductRepository repo){
            _repo = repo;


        }
        [HttpGet]   
        public async Task<ActionResult<PageList<Product>>> GetProducts([FromQuery]ProductParams productParams){
            //string? orderBy = null, string? searchTerm=null, string? brands = null, string? types = null
           
            var qproducts = await _repo.GetProductsAsync();
            var qbrands = await _repo.GetProductBrandsAsync();
            var qtypes = await _repo.GetProductTypesAsync();
            var query = qproducts.AsQueryable()
                .Sort(productParams.OrderBy)
                .Search(productParams.SearchTerm)
                .Filter(qbrands.AsQueryable(), qtypes.AsQueryable(),productParams.Brands, productParams.Types);
          
            var products = await PageList<Product>.ToPagedList(query,productParams.PageNumber, productParams.PageSize);
            
            Response.AddPginationHeader(products.MetaData);

            return Ok(products);
        }
        [HttpGet("filters")]
        public async Task<IActionResult>GetFilters(){
            var qbrands = await _repo.GetProductsAsync();
            var brands = qbrands.Select(p => p.ProductBrand.Name).Distinct().ToList();
            
            var types = qbrands.Select(p => p.ProductType.Name).Distinct().ToList();

            return Ok(new {brands, types});
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id){
            var product = await _repo.GetProductByIdAsync(id);
            if(product == null) return NotFound();
            return product;
        }

        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductsBrands(){
            return Ok(await _repo.GetProductBrandsAsync());
        }

        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductsTypes(){
            return Ok(await _repo.GetProductTypesAsync());
        }
    }
}