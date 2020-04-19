using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using CustardQuotes.Models;
using CustardQuotes.Filters;
using Microsoft.EntityFrameworkCore;

namespace CustardQuotes.Controllers
{
    [ApiController]
    [ApiKeyAuth]
    [Route("[controller]")]
    public class QuotesController : ControllerBase
    {

        private readonly CustardQuotesContext _context;
        private readonly ILogger<QuotesController> _logger;

        public QuotesController(ILogger<QuotesController> logger, CustardQuotesContext context)
        {
            _logger = logger;
            _context = context;
        }

        /// <summary>
        /// Checks to see if the API is active
        /// </summary>
        [HttpHead]
        public ActionResult Ping()
        {
            return Ok();
        }

        /// <summary>
        ///  Gets ALL quotes in the database
        /// </summary>
        [HttpGet("all")]
        public async Task<ActionResult<List<CustardQuotesModel>>> Get()
        {
            return await _context.CustardQuotes.ToListAsync();
        }

        /// <summary>
        ///  Gets the quotes of a particular group
        /// </summary>
        [HttpGet("byGroup")]
        public async Task<ActionResult<List<CustardQuotesModel>>> Get(int groupID)
        {
            return await _context.CustardQuotes.Where(quote => quote.GroupId == groupID).OrderByDescending(quote => quote.DateAdded).ToListAsync();
        }

        /// <summary>
        ///  Gets the quotes of a specfic Person/Quotee
        /// </summary>
        [HttpGet("byName")]
        public async Task<ActionResult<List<CustardQuotesModel>>> Get(String name, int groupID)
        {
            return await _context.CustardQuotes.Where(quote => quote.Person == name && quote.GroupId == groupID).OrderBy(quote => quote.DateAdded).ToListAsync();
        }

        /// <summary>
        ///  Gets the quotes by ID
        /// </summary>
        [HttpGet("byId")]
        public async Task<ActionResult<CustardQuotesModel>> GetByID(int id)
        {
            var result = await _context.CustardQuotes.Where(quote => quote.Id == id).OrderBy(quote => quote.DateAdded).ToListAsync();
            return result[0];
        }

        /// <summary>
        ///  Gets all the quotees based on a group
        /// </summary>
        [HttpGet("allNames")]
        public async Task<ActionResult<List<string>>> GetNames(int groupID)
        {
            return await _context.CustardQuotes.Where(quote => quote.GroupId == groupID).Select(quote => quote.Person).Distinct().ToListAsync();
        }

        /// <summary>
        ///  Creates a new quote
        /// </summary>
        [HttpPost("new")]
        public async Task<ActionResult> Add([FromBody] CustardQuotesModel newQuote)
        {
            await _context.CustardQuotes.AddAsync(newQuote);
            await _context.SaveChangesAsync(); //TODO: Check if change is allowed

            return Ok();
        }


        /// <summary>
        ///  Helps rename quotees in case of a typo
        /// </summary>
        [HttpPut("merge")]
        public async Task<ActionResult> MergeNames([FromBody] List<string> oldNames, string newName, int groupId)
        {
            oldNames.ForEach(name =>
            {
                var nameList = _context.CustardQuotes.Where(quote => quote.Person == name && quote.GroupId == groupId).ToList();
                nameList.ForEach(quote =>
                {
                    quote.Person = newName;
                    _context.Entry(quote).State = EntityState.Modified;
                });
            });
            try
            {
                _context.SaveChanges();
            }
            catch(Exception e)
            {
                return StatusCode(500, e.Message);
            }
            return Ok();
        }

        /// <summary>
        ///  Deletes quote based on id
        /// </summary>
        [HttpDelete("delete")]
        public async Task<ActionResult<CustardQuotesModel>> Delete(int id)
        {
            var result = await _context.CustardQuotes.FindAsync(id);
            if (result == null)
            {
                return NotFound();
            }

            _context.CustardQuotes.Remove(result);
            try { 
                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }

            return result;
        }
    }
}
