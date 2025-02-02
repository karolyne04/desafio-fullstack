using Backend.Data; 
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Backend.Controllers
{
    [ApiController]
    [Route("/itens")]
    public class ItensController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ItensController> _logger;

        public ItensController(AppDbContext context, ILogger<ItensController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<List<Item>> Get()
        {
            _logger.LogInformation("Obtendo todos os itens.");
            return _context.Itens.Include(i => i.Produto).ToList();
        }

        [HttpGet("{id}")]
        public ActionResult<Item> Get(int id)
        {
            var item = _context.Itens.Include(i => i.Produto).FirstOrDefault(i => i.Id == id);
            if (item == null)
            {
                return NotFound();
            }
            return item;
        }

        [HttpPost]
        public ActionResult<Item> Post(Item item)
        {
            _context.Itens.Add(item);
            _context.SaveChanges();
            return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, Item item)
        {
            if (id != item.Id)
            {
                return BadRequest();
            }

            _context.Entry(item).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var item = _context.Itens.Find(id);
            if (item == null)
            {
                return NotFound();
            }

            _context.Itens.Remove(item);
            _context.SaveChanges();

            return NoContent();
        }
    }
} 