using System;
using System.ComponentModel.DataAnnotations;

namespace AzureWebApp.Models
{
    public class Sale
    {
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        public int CustomerId { get; set; }

        [Required]
        public int StoreId { get; set; }

        [Required]
        public DateTime DateSold { get; set; }


        public virtual Product Product{ get; set; }

        public virtual Customer Customer { get; set; }

        public virtual Store Store { get; set; }


    }
}
