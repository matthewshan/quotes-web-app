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
    public class UsersController : ControllerBase
    {
        private readonly CustardQuotesContext _context;

        public UsersController(CustardQuotesContext context)
        {
            _context = context;
        }

        private async Task<UsersModel> CreateUser(UsersModel usersModel)
        {
            usersModel.Id = Guid.NewGuid().ToString();
            _context.Users.Add(usersModel);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException e)
            {
                if (UsersModelExists(usersModel.Id))
                {
                    return await CreateUser(usersModel);
                }
                else
                {
                    throw e;
                }
            }

            return usersModel;
        }

        private async Task UpdateUser(UsersModel usersModel)
        {
            var local = _context.Set<UsersModel>()
                .Local
                .FirstOrDefault(entry => entry.Id.Equals(usersModel.Id));

            if (local != null)
            {
                _context.Entry(local).State = EntityState.Detached;
            }

            _context.Entry(usersModel).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        [HttpPut("discord/{discordId}")]
        public async Task<ActionResult<UsersModel>> RequestUserDiscord(string discordId, string email)
        {
            List<UsersModel> result = await _context.Users.Where(user => user.DiscordId == discordId).ToListAsync();

            UsersModel user = new UsersModel
            {
                DiscordId = discordId,
                Email = email
            };

            //Creates new user if does not exists
            if (result.Count == 0)
            {
                return await CreateUser(user);
            }
            // Updates the user if any information was updated
            else if(!result[0].Equals(user))
            {
                user.Id = result[0].Id;
                await UpdateUser(user);
                return user;
            }
            // If things are the same, don't change anything. Just return the userID
            return result[0];          
        }

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
