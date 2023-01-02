using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.OrderAggregate;

namespace Core.DTO
{
    public class CreateOrderDTO
    {
        public bool SaveAddress {get; set;}

        public ShippingAddress ShippingAddress {get; set;}
    }
}