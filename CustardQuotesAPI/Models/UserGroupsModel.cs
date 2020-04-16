using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace CustardQuotes.Models
{
    public partial class UserGroupsModel
    {
        [Key]
        public string UserId { get; set; }
        [Key]
        public int GroupId { get; set; }
    }
}
