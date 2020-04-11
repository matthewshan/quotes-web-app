using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CustardQuotes.Models
{
    public partial class CustardQuotesModel
    {
        [Key]
        public int Id { get; set; }
        public string Quote { get; set; }
        public string Person { get; set; }
        public string Author { get; set; }
        public DateTime? DateAdded { get; set; }
        public string Source { get; set; }
        public int? GroupId { get; set; }
    }
}
