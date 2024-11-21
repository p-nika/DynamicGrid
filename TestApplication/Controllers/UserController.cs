using Microsoft.AspNetCore.Mvc;
using TestApplication.Models;

namespace TestApplication.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        ApplicationDbContext _context;
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("add-user")]
        public async Task<IActionResult> AddUser([FromBody] User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(AddUser), user);
        }

        [HttpGet("is-admin/{mail}")]
        public async Task<IActionResult> IsAdmin(string mail)
        {
            User user = _context.Users.FirstOrDefault(us => us.Email == mail);
            if(user == null)
            {
                return NotFound("User not found");
            }
            return CreatedAtAction(nameof(IsAdmin), user.IsAdmin);
        }

        [HttpGet("get-user/{mail}")]
        public async Task<IActionResult> GetUser(string mail)
        {
            User user = _context.Users.FirstOrDefault(us => us.Email == mail);
            if (user == null)
            {
                return NotFound("User not found");
            }
            return CreatedAtAction(nameof(GetUser), user);
        }
    }
}
