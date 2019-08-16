using AzureWebApp.Models;
using Microsoft.EntityFrameworkCore;

namespace AzureWebApp.DAL
{
    public class DotDbContext : DbContext
    {
        public DotDbContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Product> Products { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Store> Stores { get; set; }
        public DbSet<Sale> Sales { get; set; }

    }
}
