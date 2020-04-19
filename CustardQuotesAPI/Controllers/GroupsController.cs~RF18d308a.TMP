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
    [ApiKeyAuth]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        private readonly CustardQuotesContext _context;

        public GroupsController(CustardQuotesContext context)
        {
            _context = context;
        }

        private async Task AddUserToGroup(string userId, int groupId)
        {
            UserGroupsModel entry = new UserGroupsModel
            {
                UserId = userId,
                GroupId = groupId
            };
            _context.UserGroups.Add(entry);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException e)
            {
                Console.WriteLine("Already in the DB");
            }
        }

        [HttpPut("discord/{userId}")]
        public async Task<ActionResult> AddDiscordEntries(string userId, List<string> serverIds)
        {
            List<int> discordGroups = await _context.Groups.Where(group => serverIds.Contains(group.DiscordServer)) //Users' discord groups
                                                            .Select(group => group.GroupId).ToListAsync(); //Just get the groupId

            List<int> currentGroups = await _context.UserGroups.Where(userGroup => userGroup.UserId == userId) //Get the users' group ids
                                                                .Select(userGroup => userGroup.GroupId).ToListAsync();  //Just get the groupId

            List<int> toAdd = discordGroups.Except(currentGroups).ToList();
            foreach(int item in toAdd)
            {
                await AddUserToGroup(userId, item);
            }

            return NoContent();
        }

        [HttpPost("UserGroups")]
        public async Task<ActionResult<UserGroupsModel>> AddUserGroup(string userId, int groupId)
        {
            UserGroupsModel entry = new UserGroupsModel
            {
                UserId = userId,
                GroupId = groupId
            };
            _context.UserGroups.Add(entry);
            await _context.SaveChangesAsync();
            return entry;
        }   
        [HttpGet("UserGroups/{userId}")]
        public async Task<ActionResult<List<GroupsModel>>> GetUsersGroups(string userId)
        {
            UsersModel user = await _context.Users.FindAsync(userId);
            List<int> groups = await _context.UserGroups.Where(userGroup => userGroup.UserId == userId).Select(group => group.GroupId).ToListAsync();
            return await _context.Groups.Where(group => groups.Contains(group.GroupId)).ToListAsync();
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
        public async Task<ActionResult<GroupsModel>> PostGroupsModel([FromBody] GroupsModel groupsModel)
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

            return groupsModel;
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
