using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace CustardQuotes.Models
{
    public partial class UsersModel
    {
        [Key]
        public string Id { get; set; }
        public string Email { get; set; }
        public string DiscordId {get; set;}
        public string FacebookId {get; set;}

        public bool Equals(UsersModel obj)
        {
            return (Email == obj.Email && DiscordId == obj.DiscordId && FacebookId == obj.FacebookId);
        }
    }
}
