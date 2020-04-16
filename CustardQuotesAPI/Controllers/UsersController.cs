using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CustardQuotes.Models;

namespace CustardQuotes.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly CustardQuotesContext _context;

        public UsersController(CustardQuotesContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsersModel>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UsersModel>> GetUsersModel(string id)
        {
            var usersModel = await _context.Users.FindAsync(id);

            if (usersModel == null)
            {
                return NotFound();
            }

            return usersModel;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsersModel(string id, UsersModel usersModel)
        {
            if (id != usersModel.Id)
            {
                return BadRequest();
            }

            _context.Entry(usersModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsersModelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<UsersModel>> PostUsersModel(UsersModel usersModel)
        {
            _context.Users.Add(usersModel);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UsersModelExists(usersModel.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUsersModel", new { id = usersModel.Id }, usersModel);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<UsersModel>> DeleteUsersModel(string id)
        {
            var usersModel = await _context.Users.FindAsync(id);
            if (usersModel == null)
            {
                return NotFound();
            }

            _context.Users.Remove(usersModel);
            await _context.SaveChangesAsync();

            return usersModel;
        }

        private bool UsersModelExists(string id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
