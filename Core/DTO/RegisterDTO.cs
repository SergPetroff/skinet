using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.DTO
{
    public class RegisterDTO : LoginDTO
    {
        public string Email { get; set; }
    }
}