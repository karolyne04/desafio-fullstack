public class CarrinhoItem
{
    public int Id { get; set; }
    public int CarrinhoId { get; set; }
    public Carrinho Carrinho { get; set; } 
    public int ItemId { get; set; }
    public Item Item { get; set; } 
    public int Quantidade { get; set; }
}