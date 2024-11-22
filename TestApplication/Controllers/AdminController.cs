﻿using Microsoft.AspNetCore.Mvc;
using TestApplication.Models;
using TestApplication.Requests;

namespace TestApplication.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        ApplicationDbContext _context;
        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("add-user-permission")]
        public async Task<IActionResult> AddUserPermission([FromBody] AddUserPermissionRequest request)
        {
            User user = _context.Users.FirstOrDefault(us => us.Email == request.UserEmail);
            if(user == null)
            {
                return NotFound("User not found!");
            }
            user.AccessToTables.Add(request.TableId);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(AddUserPermission), user);
        }

        [HttpDelete("remove-user-permission")]
        public async Task<IActionResult> RemoveUserPermission([FromBody] AddUserPermissionRequest request)
        {
            User user = _context.Users.FirstOrDefault(us => us.Email == request.UserEmail);
            if (user == null)
            {
                return NotFound("User not found!");
            }
            user.AccessToTables.Remove(request.TableId);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(AddUserPermission), user);
        }



    }
}