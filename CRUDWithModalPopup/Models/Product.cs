using System.ComponentModel.DataAnnotations;

namespace CRUDWithModalPopup.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string ProductName { get; set; }
        [Required]
        public double Price { get; set; }
    }
}
