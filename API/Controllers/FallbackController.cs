using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class FallbackController : Controller
    {
        
        public IActionResult Index()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html");
            if(Directory.Exists(path)){
                return PhysicalFile(path, "text/HTML");
            }
            return null;
        }

    }
}