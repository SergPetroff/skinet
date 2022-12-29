using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;
using API.Services;
using Core.DTO;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        public TokenService _tokenService { get; }
        private readonly StoreContext _context;

        public AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext context)
        {
            _context = context;
            _tokenService = tokenService;
            _userManager = userManager;
        }


        [HttpPost("login")]

        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDto){
            var user = await _userManager.FindByNameAsync(loginDto.UserName);

            if(user == null || !await _userManager.CheckPasswordAsync(user,loginDto.Password))
                return Unauthorized();
            
            var userBasket = await RetrieveBasket(loginDto.UserName);
            var anonimBasket = await RetrieveBasket(Request.Cookies["buyerId"]);

            if(anonimBasket != null){
                if(userBasket != null) _context.Baskets.Remove(userBasket);
                anonimBasket.BuyerId = user.UserName;
                Response.Cookies.Delete("buyerId");
                await _context.SaveChangesAsync();
            }
            return new UserDTO
            {
                Email= user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = anonimBasket != null ? anonimBasket.MapBasketToDto(): userBasket?.MapBasketToDto()
            };
        }

         private async Task<Basket> RetrieveBasket(string buyerId)
        {
            if (string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }

            var resultbasket = await _context.Baskets
                        .Include(i => i.Items)
                        .ThenInclude(p => p.Product)
                        .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
            return resultbasket;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDTO registerDto){
            var user = new User{
                UserName = registerDto.UserName, Email = registerDto.Email
            };
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if(!result.Succeeded){
                foreach(var error in result.Errors){
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return ValidationProblem();
            }

            await _userManager.AddToRoleAsync(user,"Member");

            return StatusCode(201);
        }

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDTO>> GetCurrentUser(){
            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            var userBasket = await RetrieveBasket(User.Identity.Name);
            return new UserDTO
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = userBasket?.MapBasketToDto()
            };
        }
    }
}