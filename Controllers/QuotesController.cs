using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using CustardQuotes.Models;

namespace CustardQuotes.Controllers
{
    [ApiController]
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

        //https://www.learnentityframeworkcore.com/dbset/querying-data

        [HttpGet]
        public ActionResult<List<CustardQuotesModel>> Get()
        {
            return _context.CustardQuotes.ToList();
        }

        [HttpGet("Person/{name}")]
        public ActionResult<List<CustardQuotesModel>> Get(String name)
        {
            
            return _context.CustardQuotes.Where(quote => quote.Person == name).ToList();
        }
    }
}
