export interface Produto {
  id: number;
  nome: string;
}

export interface Item {
  unidadeMedida: any;
  quantidade: any;
  id: number;
  nome: string;
  produtoId: number; // Referência ao produto
}

export interface Carrinho {
  id: number;
  itensCarrinho: Item[]; // Lista de itens no carrinho
} 