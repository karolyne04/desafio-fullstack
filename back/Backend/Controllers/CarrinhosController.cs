using Backend.Data; 
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Backend.Controllers
{
    [ApiController]
    [Route("/carrinhos")]
    public class CarrinhosController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<CarrinhosController> _logger;

        public CarrinhosController(AppDbContext context, ILogger<CarrinhosController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<List<Carrinho>> Get()
        {
            _logger.LogInformation("Obtendo todos os carrinhos.");
            return _context.Carrinhos.Include(c => c.ItensCarrinho).ToList();
        }

        [HttpGet("{id}")]
        public ActionResult<Carrinho> Get(int id)
        {
            var carrinho = _context.Carrinhos.Include(c => c.ItensCarrinho).FirstOrDefault(c => c.Id == id);
            if (carrinho == null)
            {
                return NotFound();
            }
            return carrinho;
        }

        [HttpPost]
        public ActionResult<Carrinho> Post(Carrinho carrinho)
        {
            _context.Carrinhos.Add(carrinho);
            _context.SaveChanges();
            return CreatedAtAction(nameof(Get), new { id = carrinho.Id }, carrinho);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, Carrinho carrinho)
        {
            if (id != carrinho.Id)
            {
                return BadRequest("IDs n");
            }
            var carrinhoExistente = _context.Carrinhos.Include(c => c.ItensCarrinho).FirstOrDefault(c => c.Id == id);
            if (carrinhoExistente == null)
            {
                return NotFound("Carrinho não encontrado.");
            }
            carrinhoExistente.ItensCarrinho = carrinho.ItensCarrinho;
            _context.Entry(carrinhoExistente).State = EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var carrinho = _context.Carrinhos.Find(id);
            if (carrinho == null)
            {
                return NotFound("Carrinho não encontrado.");
            }

            _context.Carrinhos.Remove(carrinho);
            _context.SaveChanges();

            return NoContent();
        }
        [HttpPost("{carrinhoId}/adicionar-item")]
        public ActionResult<CarrinhoItem> AdicionarItemAoCarrinho(int carrinhoId, [FromBody] CarrinhoItem carrinhoItem)
        {
            var carrinho = _context.Carrinhos.Include(c => c.ItensCarrinho).FirstOrDefault(c => c.Id == carrinhoId);
            if (carrinho == null)
            {
               return NotFound("Carrinho não encontrado.");
            }    

            var itemExistente = _context.Itens.Find(carrinhoItem.ItemId);  

            if (itemExistente == null)
            {
               return NotFound("Item não encontrado.");
            }

            carrinhoItem.CarrinhoId = carrinhoId;
            _context.CarrinhoItens.Add(carrinhoItem);
            _context.SaveChanges();
   

           return CreatedAtAction(nameof(Get), new { id = carrinhoItem.Id }, carrinhoItem);
        }

        [HttpPost("{carrinhoId}/remover-item")]
        public IActionResult RemoverItemDoCarrinho(int carrinhoId,  int itemId)
        {
            var carrinhoItem = _context.CarrinhoItens.FirstOrDefault(ci => ci.CarrinhoId == carrinhoId && ci.ItemId == itemId);
            if (carrinhoItem == null)
            {
                return NotFound("Item não encontrado no carrinho.");
            }
            _context.CarrinhoItens.Remove(carrinhoItem);
            _context.SaveChanges();
            return NoContent();
        }
    }

}
