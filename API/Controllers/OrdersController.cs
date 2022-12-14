using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;
using Core.DTO;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class OrdersController: BaseApiController
    {
        private readonly StoreContext _context;
        public OrdersController(StoreContext context)
        {
            _context = context;
            
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDTO>>> GetOrders()
        {
            return await _context.Orders
                .ProjectOrderToOrderDTO()
                .Where(x => x.BuyerId == User.Identity.Name)
                .ToListAsync();
        }

        [HttpGet("{id}", Name ="GetOrder")]
        public async Task<ActionResult<OrderDTO>> GetOrder(int id){
            return await _context.Orders
                .ProjectOrderToOrderDTO()
                .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
                .FirstOrDefaultAsync();
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateOrder(CreateOrderDTO orderDTO)
        {
            var basket = await _context.Baskets.RetriveBasketWithItems(User.Identity.Name).FirstOrDefaultAsync();

            if(basket == null) return BadRequest(new ProblemDetails{
                Title = "Could not locate basket"
            });

            var items = new List<OrderItem>();


            foreach (var item in basket.Items)
            {
                var productItem = await _context.Products.FindAsync(item.ProductId);
                var itemOrdered = new ProductItemOrdered
                {
                    ProductId = productItem.Id,
                    Name = productItem.Name,
                    PictureUrl = productItem.PictureUrl
                };

                var orderItem = new OrderItem{
                    ItemOrdered = itemOrdered,
                    Price = Convert.ToInt64(productItem.Price) ,
                    Quantity = item.Quantity
                };

                items.Add(orderItem);
                productItem.quantityInStock -= item.Quantity;
            }

            var subtotal = items.Sum(item => item.Price * item.Quantity);
            var deliveryFee = subtotal > 100 ? 0 : 5;

            var order = new Order
            {
                OrderItems = items,
                BuyerId = User.Identity.Name,
                ShippingAddress = orderDTO.ShippingAddress,
                Subtotal = subtotal,
                DeliveryFee = deliveryFee
            };

            _context.Orders.Add(order);
            _context.Baskets.Remove(basket);

            if(orderDTO.SaveAddress){
                var user = await _context.Users
                    .Include(a => a.Address)
                    .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);

                var address = new UserAddress{

                    FullName = orderDTO.ShippingAddress.FullName,
                    Address1 = orderDTO.ShippingAddress.Address1,
                    Address2 = orderDTO.ShippingAddress.Address2,
                    City = orderDTO.ShippingAddress.City,
                    State = orderDTO.ShippingAddress.State,
                    Country = orderDTO.ShippingAddress.Country,
                    Zip = orderDTO.ShippingAddress.Zip

                };
                user.Address = address;
                //_context.Update(user);
            }

            var result = await _context.SaveChangesAsync() > 0;
            if(result) return CreatedAtRoute("GetOrder",new{id = order.Id}, order.Id);
            return BadRequest("Problem creating order");
        }
    }
}