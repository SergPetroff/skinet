using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Services;
using Core.DTO;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccauntController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        public TokenService _tokenService { get; }

        public AccauntController(UserManager<User> userManager, TokenService tokenService)
        {
            _tokenService = tokenService;
            _userManager = userManager;
        }


        [HttpPost("login")]

        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDto){
            var user = await _userManager.FindByNameAsync(loginDto.UserName);

            if(user == null || !await _userManager.CheckPasswordAsync(user,loginDto.Password))
                return Unauthorized();
            
            return new UserDTO
            {
                Email= user.Email,
                Token = await _tokenService.GenerateToken(user)
            };
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

            return new UserDTO
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user)
            };
        }
    }
}