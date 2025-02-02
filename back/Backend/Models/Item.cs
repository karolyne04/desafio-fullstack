public class Item
{
    public int Id { get; set; }
    public int ProdutoId { get; set; }
    public int Quantidade { get; set; }
    public string? UnidadeMedida { get; set; }

    public Produto Produto { get; set; } = new Produto();
    public List<CarrinhoItem> CarrinhoItens { get; set; } = new List<CarrinhoItem>();
}