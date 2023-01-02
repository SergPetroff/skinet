using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.OrderAggregate;

namespace Core.DTO
{
    public class OrderDTO
    {
          public int Id { get; set; }
        public string BuyerId { get; set; }
        public ShippingAddress ShippingAddress { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.Now;

        public List<OrderItemDTO> OrderItems { get; set; }

        public long Subtotal { get; set; }
        public long DeliveryFee { get; set; }

        public string OrderStatus { get; set; }

        public long Total { get; set; }
    }
}