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
        public ActionResult<List<CustardQuotesModel>> Get()
        {
            return _context.CustardQuotes.ToList();
        }

        [HttpGet("byGroup")]
        public ActionResult<List<CustardQuotesModel>> Get(int groupID)
        {
            return _context.CustardQuotes.Where(quote => quote.GroupId == groupID).OrderBy(quote => quote.DateAdded).ToList();
        }

        [HttpGet("byName")]
        public ActionResult<List<CustardQuotesModel>> Get(String name, int groupID)
        {
            return _context.CustardQuotes.Where(quote => quote.Person == name && quote.GroupId == groupID).OrderBy(quote => quote.DateAdded).ToList();
        }

        [HttpGet("byId")]
        public ActionResult<CustardQuotesModel> GetByID(int id)
        {
            return _context.CustardQuotes.Where(quote => quote.Id == id).OrderBy(quote => quote.DateAdded).ToList()[0];
        }

        [HttpGet("allNames")]
        public ActionResult<List<string>> GetNames(int groupID)
        {
            return _context.CustardQuotes.Where(quote => quote.GroupId == groupID).Select(quote => quote.Person).Distinct().ToList();
        }

        [HttpPost("new")]
        public ActionResult Add([FromBody] CustardQuotesModel newQuote)
        {
            _context.CustardQuotes.Add(newQuote);
            try 
            { 
                _context.SaveChanges(); //TODO: Check if change is allowed
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }

            return Ok();
        }

        [HttpPut("merge")]
        public ActionResult MergeNames([FromBody] List<string> oldNames, string newName, int groupId)
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
        public ActionResult<CustardQuotesModel> Delete(int id)
        {
            var result = _context.CustardQuotes.Find(id);
            if (result == null)
            {
                return NotFound();
            }

            _context.CustardQuotes.Remove(result);
            try { 
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }

            return result;
        }
    }
}
