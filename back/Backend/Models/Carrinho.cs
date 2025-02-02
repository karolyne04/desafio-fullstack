public class Carrinho
{
    public int Id { get; set; }
    public List<CarrinhoItem> ItensCarrinho { get; set; } = new();
}