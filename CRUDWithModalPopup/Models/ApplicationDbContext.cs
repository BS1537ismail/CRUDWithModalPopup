using Microsoft.EntityFrameworkCore;

namespace CRUDWithModalPopup.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
                
        }
        public DbSet<Product> Products { get; set; }
    }
}
