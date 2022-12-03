using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.DTO
{
    public class BasketDTO: BaseEntity
    {
        public string BuyerId { get; set; }

        public List<BasketItemDto>Items{ get; set; }
        
    }
}