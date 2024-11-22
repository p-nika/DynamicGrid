using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        [HttpGet("get-user-tables/{mail}")]
        public async Task<IActionResult> GetUserTables(string mail)
        {
            List<AccessedTablesEntry> accessedTables = new List<AccessedTablesEntry>();
            var tables = await _context.Tables.Include(t => t.Rows).ThenInclude(r => r.Values).ToListAsync();
            Table userPermissionsTable = tables.FirstOrDefault(t => t.Id == 1);
            userPermissionsTable.Rows.ForEach(row =>
            {
                bool good = false;
                int tableId = -1;
                row.Values.ForEach(cv =>
                {
                    if(cv.CellType == ColumnType.Email && cv.GetValue<EmailValue>().Email == mail)
                    {
                        good = true;
                    }
                    if(good && cv.CellType == ColumnType.Numeric)
                    {
                        tableId = cv.GetValue<NumericValue>().Number;
                    }
                });
                if (good)
                {
                    accessedTables.Add(new AccessedTablesEntry() { TableId = tableId, TableName = tables.FirstOrDefault(t => t.Id == tableId).Name });
                }
            });

            return Ok(accessedTables);
        }
    }
}
