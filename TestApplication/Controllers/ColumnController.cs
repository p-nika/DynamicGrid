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

        [HttpPost]
        public async Task<IActionResult> AddColumn([FromBody] Column column)
        {
            _context.Columns.Add(column);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(AddColumn), new {name = column}, column);
        }
    }
}
