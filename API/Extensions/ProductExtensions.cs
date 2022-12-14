using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace API.Extensions
{
    public static class ProductExtensions
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy){

            if(string.IsNullOrWhiteSpace(orderBy)) return query.OrderBy(p => p.Name);
            query = orderBy switch{
                "price" => query.OrderBy(p => p.Price),
                "priceDesc" => query.OrderByDescending(p => p.Price),
                _ =>query.OrderBy(p => p.Name)
            };

            return query;
        }

        public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
        {
            if(string.IsNullOrWhiteSpace(searchTerm)) return query;
            var lowerCaseTerm = searchTerm.Trim().ToLower();
            return query.Where(p => p.Name.ToLower().Contains(searchTerm));
        }

        public static IQueryable<Product> Filter(this IQueryable<Product> queryProduct, IQueryable<ProductBrand> qbrands, IQueryable<ProductType> qtypes, string brands, string types){
            var brandList = new List<string>();
            var typeList = new List<string>();

            if(!string.IsNullOrEmpty(brands)){
                brandList.AddRange(brands.ToLower().Split(",").ToList());
            }
            if(!string.IsNullOrEmpty(types)){
                typeList.AddRange(types.ToLower().Split(",").ToList());
            }

            qbrands = qbrands.Where(qb => brandList.Contains(qb.Name.ToLower()));
            qtypes = qtypes.Where(qt => typeList.Contains(qt.Name.ToLower()));
    

            queryProduct = queryProduct.Where(p => qbrands.Count() == 0 || qbrands.Contains(p.ProductBrand));
            queryProduct = queryProduct.Where(p => qtypes.Count() == 0 || qtypes.Contains(p.ProductType));

            return queryProduct;

        }
    }
}