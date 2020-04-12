using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace CustardQuotes.Models
{
    public partial class GroupsModel
    {
        [Key]
        public int GroupId { get; set; }
        public string Name { get; set; }
        public string Owner { get; set; }
        public string DiscordServer { get; set; }
    }
}
