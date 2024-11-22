using System;
using Microsoft.AspNetCore.Mvc;
using TestApplication.Models;

namespace TestApplication.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ColumnController : ControllerBase
    {
        ApplicationDbContext _context;
        public ColumnController(ApplicationDbContext context)
        {
            _context = context;
        }
    }
}
