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

        [HttpHead]
        public ActionResult Ping()
        {
            return Ok();
        }

        [HttpGet("all")]
        public async Task<ActionResult<List<CustardQuotesModel>>> Get()
        {
            return await _context.CustardQuotes.ToListAsync();
        }

        [HttpGet("byGroup")]
        public async Task<ActionResult<List<CustardQuotesModel>>> Get(int groupID)
        {
            return await _context.CustardQuotes.Where(quote => quote.GroupId == groupID).OrderByDescending(quote => quote.DateAdded).ToListAsync();
        }

        [HttpGet("byName")]
        public async Task<ActionResult<List<CustardQuotesModel>>> Get(String name, int groupID)
        {
            return await _context.CustardQuotes.Where(quote => quote.Person == name && quote.GroupId == groupID).OrderBy(quote => quote.DateAdded).ToListAsync();
        }

        [HttpGet("byId")]
        public async Task<ActionResult<CustardQuotesModel>> GetByID(int id)
        {
            var result = await _context.CustardQuotes.Where(quote => quote.Id == id).OrderBy(quote => quote.DateAdded).ToListAsync();
            return result[0];
        }

        [HttpGet("allNames")]
        public async Task<ActionResult<List<string>>> GetNames(int groupID)
        {
            return await _context.CustardQuotes.Where(quote => quote.GroupId == groupID).Select(quote => quote.Person).Distinct().ToListAsync();
        }

        [HttpPost("new")]
        public async Task<ActionResult> Add([FromBody] CustardQuotesModel newQuote)
        {
            await _context.CustardQuotes.AddAsync(newQuote);
            try 
            {
                await _context.SaveChangesAsync(); //TODO: Check if change is allowed
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }

            return Ok();
        }

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
