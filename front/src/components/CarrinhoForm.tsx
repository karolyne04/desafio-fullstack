import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';

interface Carrinho {
  id: number;
  itensCarrinho: {
    id: number;
    produtoId: number;
    quantidade: number;
    unidadeMedida: string;
    produto: {
      id: number;
      nome: string;
    };
  }[];
}

interface CarrinhoFormProps {
  onSubmit: (carrinho: Carrinho) => void;
  closeForm: () => void;
  carrinho?: Carrinho; // Para edição
}

const CarrinhoForm: React.FC<CarrinhoFormProps> = ({ onSubmit, closeForm, carrinho }) => {
  const [id, setId] = useState<number>(carrinho ? carrinho.id : 0); // Se for edição, preenche com o ID existente

  useEffect(() => {
    if (carrinho) {
      setId(carrinho.id); // Preenche o ID se for edição
    }
  }, [carrinho]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id <= 0) {
      alert("Por favor, insira um ID válido para o carrinho.");
      return;
    }
    onSubmit({ id, itensCarrinho: carrinho?.itensCarrinho || [] }); // Apenas o ID será alterado
    closeForm();
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="ID do Carrinho"
        variant="outlined"
        value={id}
        onChange={(e) => setId(Number(e.target.value))}
        required
        type="number" // Garantindo que seja um número
      />
      <Button type="submit" variant="contained" style={{ marginLeft: '1rem' }}>
        Atualizar
      </Button>
      <Button onClick={closeForm} variant="outlined" style={{ marginLeft: '1rem' }}>
        Cancelar
      </Button>
    </form>
  );
};

export default CarrinhoForm;
