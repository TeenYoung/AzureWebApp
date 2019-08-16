using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AzureWebApp.Models
{
    public class Store
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MaxLength(255)]
        public string Address { get; set; }

        public virtual ICollection<Sale> Sales { get; set; }
    }
}
