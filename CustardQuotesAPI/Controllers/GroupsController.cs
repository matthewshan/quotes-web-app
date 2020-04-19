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

        /// <summary>
        ///  Updates the User's groups based on their discord servers.
        /// </summary>
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

            return Ok();
        }

        /// <summary>
        ///  Adds a new user to a group
        /// </summary>
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

        /// <summary>
        ///  Get the groups associated with a user
        /// </summary>
        [HttpGet("UserGroups/{userId}")]
        public async Task<ActionResult<List<GroupsModel>>> GetUsersGroups(string userId)
        {
            UsersModel user = await _context.Users.FindAsync(userId);
            List<int> groups = await _context.UserGroups.Where(userGroup => userGroup.UserId == userId).Select(group => group.GroupId).ToListAsync();
            return await _context.Groups.Where(group => groups.Contains(group.GroupId)).ToListAsync();
        }

        /// <summary>
        ///  Adds a user to a group via email
        /// </summary>
        [HttpPost("UserGroups/shareEmail")]
        public async Task<ActionResult> ShareViaEmail(string email, int groupId)
        {
            List<UsersModel> user = await _context.Users.Where(user => user.Email == email).ToListAsync();
            if(user.Count == 0)
            {
                return NotFound();
            }
            await AddUserToGroup(user[0].Id, groupId);
            return Ok();
        }        

        private bool GroupsModelExists(int id)
        {
            return _context.Groups.Any(e => e.GroupId == id);
        }
    }
}
