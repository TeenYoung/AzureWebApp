using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AzureWebApp.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        public float Price { get; set; }

        public virtual ICollection<Sale> Sales { get; set; }
    }
}
