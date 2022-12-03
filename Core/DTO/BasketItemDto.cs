using Core.Entities;

namespace Core.DTO
{
    public class BasketItemDto
    {

        public int ProductId { get; set; }

        public string Name { get; set; }

        public decimal Price { get; set; }

        public string PictureUrl { get; set; }

        public ProductBrand ProductBrand { get; set; }

        public int ProductBrandId { get; set; }
        public ProductType ProductType { get; set; }
        
        public int ProductTypeId { get; set; }

        public int Quantity { get; set; }
    }
}