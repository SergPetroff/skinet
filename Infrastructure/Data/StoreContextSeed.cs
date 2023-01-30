using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data
{
    public class StoreContextSeed
    {
        public static async Task SeedAsync(StoreContext context, ILoggerFactory loggerFactory, UserManager<User> userManager)
        {
            try
            {

                if (!userManager.Users.Any())
                {
                    var user = new User
                    {
                        UserName = "Bob",
                        Email = "bob@test.com"
                    };

                    await userManager.CreateAsync(user, "Pa$$w0rd");
                    await userManager.AddToRoleAsync(user, "Member");

                    var admin = new User
                    {
                        UserName = "admin",
                        Email = "admin@test.com"
                    };

                    await userManager.CreateAsync(admin, "Pa$$w0rd");
                    await userManager.AddToRolesAsync(admin, new[] { "Member", "Admin" });
                }
                if (!context.ProductBrands.Any())
                {
                    var brandsData = File.ReadAllText("../Infrastructure/Data/SeedData/brands.json");
                    var brands = JsonSerializer.Deserialize<List<ProductBrand>>(brandsData);
                    foreach (var brand in brands)
                    {
                        context.ProductBrands.Add(brand);
                    }

                    await context.SaveChangesAsync();
                }

                if (!context.ProductTypes.Any())
                {
                    var typesData = File.ReadAllText("../Infrastructure/Data/SeedData/types.json");
                    var types = JsonSerializer.Deserialize<List<ProductType>>(typesData);
                    foreach (var type in types)
                    {
                        context.ProductTypes.Add(type);
                    }

                    await context.SaveChangesAsync();
                }

                if (!context.Products.Any())
                {
                    var productsData = File.ReadAllText("../Infrastructure/Data/SeedData/products.json");
                    var products = JsonSerializer.Deserialize<List<Product>>(productsData);
                   /*  var products = new List<Product>
                        {
                            new Product
                            {
                                Name = "Angular Speedster Board 2000",
                                Description =
                                    "123",
                                Price = 200,
                                ProductTypeId = 1,
                                ProductBrandId = 2,
                                PictureUrl = "/images/products/sb-ang1.png",

                                quantityInStock = 100
                            },
                            new Product
                            {
                                Name = "Green Angular Board 3000",
                                Description = "34545",
                                Price = 150,
                                PictureUrl = "/images/products/sb-ang2.png",
                                ProductBrandId = 3,
                                ProductTypeId = 4,
                                quantityInStock = 100
                            },
                            };
                     */
                    
                    foreach (var product in products)
                    {
                        context.Products.Add(product);
                    }

                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger<StoreContextSeed>();
                logger.LogError(ex.Message);

            }
        }
    }
}