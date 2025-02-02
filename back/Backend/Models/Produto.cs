using System.ComponentModel.DataAnnotations; // Para KeyAttribute
using System.ComponentModel.DataAnnotations.Schema; // Para DatabaseGeneratedAttribute e DatabaseGeneratedOption

public class Produto
{
    [Key] // Adicione esta anotação
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Adicione esta anotação
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
}