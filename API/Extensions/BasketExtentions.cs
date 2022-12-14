using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.DTO;
using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class BasketExtentions
    {
        public static BasketDTO MapBasketToDto(this Basket basket)
        {
            return new BasketDTO
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    ProductBrandId = item.Product.ProductBrandId,
                    ProductTypeId = item.Product.ProductTypeId,
                    Quantity = item.Quantity


                }).ToList()
            };
        }

        public static IQueryable<Basket> RetriveBasketWithItems(this IQueryable<Basket> query, string buyerId)
        {
            return query.Include(i => i.Items).ThenInclude(p => p.Product)
                .Where(b => b.BuyerId == buyerId);
        }

    }


}