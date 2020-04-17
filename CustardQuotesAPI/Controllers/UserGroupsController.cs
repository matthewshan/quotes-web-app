using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CustardQuotes.Models;
using CustardQuotes.Filters;


namespace CustardQuotes.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [ApiKeyAuth]
    public class UserGroupsController : ControllerBase
    {
        private readonly CustardQuotesContext _context;

        public UserGroupsController(CustardQuotesContext context)
        {
            _context = context;
        }

        // GET: api/UserGroups
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserGroupsModel>>> GetUserGroups()
        {
            return await _context.UserGroups.ToListAsync();
        }

        // GET: api/UserGroups/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserGroupsModel>> GetUserGroupsModel(string id)
        {
            var userGroupsModel = await _context.UserGroups.FindAsync(id);

            if (userGroupsModel == null)
            {
                return NotFound();
            }

            return userGroupsModel;
        }

        // PUT: api/UserGroups/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserGroupsModel(string id, UserGroupsModel userGroupsModel)
        {
            if (id != userGroupsModel.UserId)
            {
                return BadRequest();
            }

            _context.Entry(userGroupsModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserGroupsModelExists(id))
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

        // POST: api/UserGroups
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<UserGroupsModel>> PostUserGroupsModel(UserGroupsModel userGroupsModel)
        {
            _context.UserGroups.Add(userGroupsModel);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserGroupsModelExists(userGroupsModel.UserId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUserGroupsModel", new { id = userGroupsModel.UserId }, userGroupsModel);
        }

        // DELETE: api/UserGroups/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<UserGroupsModel>> DeleteUserGroupsModel(string id)
        {
            var userGroupsModel = await _context.UserGroups.FindAsync(id);
            if (userGroupsModel == null)
            {
                return NotFound();
            }

            _context.UserGroups.Remove(userGroupsModel);
            await _context.SaveChangesAsync();

            return userGroupsModel;
        }

        private bool UserGroupsModelExists(string id)
        {
            return _context.UserGroups.Any(e => e.UserId == id);
        }
    }
}
