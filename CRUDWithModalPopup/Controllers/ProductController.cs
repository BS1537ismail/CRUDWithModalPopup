using CRUDWithModalPopup.Models;
using Microsoft.AspNetCore.Mvc;

namespace CRUDWithModalPopup.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext dbcontext;

        public ProductController(ApplicationDbContext dbcontext)
        {
            this.dbcontext = dbcontext;
        }
        public IActionResult Index()
        {
            return View();
        }
        public JsonResult GetProducts()
        {
            var products = dbcontext.Products.ToList();
            return Json(products);
        }
        [HttpPost]
        public JsonResult Insert(Product product)
        {
            if(ModelState.IsValid)
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
        public JsonResult Edit(Product product)
        {
            if (ModelState.IsValid)
            {
                dbcontext.Products.Update(product);
                dbcontext.SaveChanges();
                return Json("Product Updated successfully");
            }
            return Json("Model validation failed..");
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
