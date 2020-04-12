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
    [Route("api/[controller]")]
    [ApiKeyAuth]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        private readonly CustardQuotesContext _context;

        public GroupsController(CustardQuotesContext context)
        {
            _context = context;
        }

        // GET: api/Groups
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GroupsModel>>> GetGroups()
        {
            return await _context.Groups.ToListAsync();
        }

        // GET: api/Groups/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GroupsModel>> GetGroupsModel(int id)
        {
            var groupsModel = await _context.Groups.FindAsync(id);

            if (groupsModel == null)
            {
                return NotFound();
            }

            return groupsModel;
        }

        // PUT: api/Groups/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGroupsModel(int id, GroupsModel groupsModel)
        {
            if (id != groupsModel.GroupId)
            {
                return BadRequest();
            }

            _context.Entry(groupsModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GroupsModelExists(id))
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

        // POST: api/Groups
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<GroupsModel>> PostGroupsModel(GroupsModel groupsModel)
        {
            _context.Groups.Add(groupsModel);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (GroupsModelExists(groupsModel.GroupId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetGroupsModel", new { id = groupsModel.GroupId }, groupsModel);
        }

        // DELETE: api/Groups/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<GroupsModel>> DeleteGroupsModel(int id)
        {
            var groupsModel = await _context.Groups.FindAsync(id);
            if (groupsModel == null)
            {
                return NotFound();
            }

            _context.Groups.Remove(groupsModel);
            await _context.SaveChangesAsync();

            return groupsModel;
        }

        private bool GroupsModelExists(int id)
        {
            return _context.Groups.Any(e => e.GroupId == id);
        }
    }
}
