using CRUDWithModalPopup.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace CRUDWithModalPopup.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext dbcontext;

        public ProductController(ApplicationDbContext dbcontext)
        {
            this.dbcontext = dbcontext;
        }
        public IActionResult Index(string sortOrder, string search)
        {
            ViewData["PriceSortParm"] = String.IsNullOrEmpty(sortOrder) ? "price_desc" : "";
            ViewData["CurrentFilter"] = search;

            var data = dbcontext.Products.AsQueryable();
        
            if (!string.IsNullOrEmpty(search))
            {
                data = data.Where(x => x.ProductName.Contains(search) || (x.Price.ToString() == search));
            }
            switch (sortOrder)
            {
                case "price_desc":
                    data = data.OrderByDescending(s => s.Price).ThenBy(s=>s.ProductName);
                    break;
                default:
                    data = data.OrderBy(s => s.Price).ThenBy(s => s.ProductName);
                    break;
            }
            
            return View(data);
        }
        public JsonResult GetProducts()
        {
            var products = dbcontext.Products.ToList();
            return Json(products);
        }
        [HttpPost]
        public JsonResult Insert(Product product)
        {
            if (ModelState.IsValid)
            {
                dbcontext.Products.Add(product);
                dbcontext.SaveChanges();
                return Json("Product details Saved..");
            }
            return Json("Model validation failed...");
        }
        [HttpGet]
        public JsonResult Edit(int id)
        {
            var data = dbcontext.Products.Find(id);
            return Json(data);
        }
        [HttpPost]
        public JsonResult Update(Product product)
        {
            if (ModelState.IsValid)
            {
                    dbcontext.Products.Update(product);
                    dbcontext.SaveChanges();

                    return Json("Product updated successfully.");
            }
            return Json("Model validation failed.");
        }

        [HttpGet]
        public JsonResult Details(int id)
        {
            var data = dbcontext.Products.Find(id);
            if (data != null)
            {
                return Json(data);
            }
            return Json(null);
        }

        [HttpGet]
        public IActionResult Search(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return Json(new List<Product>());
            }

            var products = dbcontext.Products
                .Where(p => p.ProductName.Contains(query) || p.Price.ToString() == query).ToList();

            return Json(products);
        }


        [HttpPost]
        public JsonResult Delete(int id)
        {
            var data = dbcontext.Products.Find(id);

            if (data != null)
            {
                dbcontext.Products.Remove(data);
                dbcontext.SaveChanges();
                return Json("Product deleted successfully");
            }
            return Json("Product not found");
        }
    }
}
