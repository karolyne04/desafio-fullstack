using Backend.Data; 
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Backend.Controllers
{
    [ApiController]
    [Route("/produtos")]
    public class ProdutosController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ProdutosController> _logger;

        public ProdutosController(AppDbContext context, ILogger<ProdutosController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<List<Produto>> Get()
        {
            _logger.LogInformation("Obtendo todos os produtos.");
            return _context.Produtos.ToList();
        }

    

[HttpPost]
public ActionResult<Produto> Post([FromBody] Produto produto)
{
    if (string.IsNullOrWhiteSpace(produto.Nome))
    {
        _logger.LogWarning("O nome do produto não pode ser vazio.");
        return BadRequest("O nome do produto é obrigatório.");
    }

    // Não defina o id aqui, pois ele será gerado automaticamente
    _context.Produtos.Add(produto);
    _context.SaveChanges();
    return CreatedAtAction(nameof(Get), new { id = produto.Id }, produto);
}

        

        [HttpPut("{id}")]
        public IActionResult Put(int id, Produto produto)
        {
            if (id != produto.Id)
            {
                return BadRequest();
            }

            _context.Entry(produto).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var produto = _context.Produtos.Find(id);
            if (produto == null)
            {
                return NotFound();
            }

            _context.Produtos.Remove(produto);
            _context.SaveChanges();

            return NoContent();
        }
    }
} 