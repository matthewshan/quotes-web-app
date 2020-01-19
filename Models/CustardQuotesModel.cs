using System;
using System.Collections.Generic;

namespace CustardQuotes.Models
{
    public partial class CustardQuotesModel
    {
        public int Id { get; set; }
        public string Quote { get; set; }
        public string Person { get; set; }
        public string Author { get; set; }
        public DateTime? DateAdded { get; set; }
        public string Source { get; set; }
    }
}
