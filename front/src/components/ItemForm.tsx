import React, { useState, useEffect } from 'react';
import { TextField, Button, Snackbar, Select, MenuItem, InputLabel, FormControl } from '@mui/material';


interface Produto {
    id?: number;
    nome: string;
}

interface Item {
    id: number;
    produtoId: number; // Referência ao produto
    quantidade: number;
    unidadeMedida: string; // Alterado para unidadeMedida
}

interface ItemFormProps {
    onSubmit: (item: Item) => void;
    closeForm: () => void;
    produtos: Produto[]; // Lista de produtos
    item?: Item; // Para edição
}

const ItemForm: React.FC<ItemFormProps> = ({ onSubmit, closeForm, produtos, item }) => {
    const [produtoId, setProdutoId] = useState<number>(0);
    const [quantidade, setQuantidade] = useState<number>(0);
    const [unidadeMedida, setUnidadeMedida] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false); // Estado para controle do Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState('');
    useEffect(() => {
        if (item) {
            setProdutoId(item.produtoId);
            setQuantidade(item.quantidade);
            setUnidadeMedida(item.unidadeMedida);
        }
    }, [item]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (produtoId <= 0 || quantidade <= 0) {
            alert("Por favor, insira valores válidos.");
            return;
        }
        onSubmit({
            produtoId,
            quantidade,
            unidadeMedida,
            produto: {
                id: produtoId,
                nome: produtos.find(prod => prod.id === produtoId)?.nome || ''
            }
        });
        setSnackbarMessage("Item salvo com sucesso");
        closeForm();
    };



    return (
        <form onSubmit={handleSubmit}>
            <FormControl fullWidth variant="outlined" style={{ marginBottom: '1rem' }}>
                <InputLabel>Produto</InputLabel>
                <Select
                    value={produtoId}
                    onChange={(e) => setProdutoId(Number(e.target.value))}
                    required
                >
                    {produtos.map(produto => (
                        <MenuItem key={produto.id} value={produto.id}>{produto.nome}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                label="Quantidade"
                variant="outlined"
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                required
                fullWidth
                style={{ marginBottom: '1rem' }}
            />
            <TextField
                label="Unidade de Medida"
                variant="outlined"
                value={unidadeMedida}
                onChange={(e) => setUnidadeMedida(e.target.value)}
                required
                fullWidth
                style={{ marginBottom: '1rem' }}
            />
            <Button type="submit" variant="contained" style={{ marginRight: '1rem' }}>
                {item ? 'Atualizar' : 'Criar'}
            </Button>
            <Button onClick={closeForm} variant="outlined">
                Cancelar
            </Button>

            {/* Snackbar para feedback */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
            />
        </form>
    );
};

export default ItemForm;
