import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import ItemForm from "./ItemForm";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import api from "../api";
import { Item, Produto } from "../types";



const ItemList: React.FC<ItemListProps> = () => {
    const [itens, setItens] = useState<Item[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [isItemFormOpen, setIsItemFormOpen] = useState(false);  // Estado separado para o formulário de item
    const [currentItem, setCurrentItem] = useState<Item | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    

    const fetchItens = async () => {
        try {
            const response = await api.get('/itens');
            setItens(response.data);
        } catch (error) {
            console.error('Erro ao buscar itens:', error);
        }
    };

    const fetchProdutos = async () => {
        try {
            const response = await api.get('/produtos');
            setProdutos(response.data);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    useEffect(() => {
        fetchItens();
        fetchProdutos();
    }, []);

    const handleAddItem = () => {
        setCurrentItem(null); // Para adicionar um novo item
        setIsItemFormOpen(true); // Abre o formulário de item
    };

    const handleEditItem = (item: Item) => {
        setCurrentItem(item); // Para editar um item existente
        setIsItemFormOpen(true); // Abre o formulário de item
    };

    const handleDeleteItem = async (id: number) => {
        try {
            await api.delete(`/itens/${id}`);
            fetchItens();
            setSnackbarMessage('Item excluído com sucesso!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage('Erro ao excluir item.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    
    const handleFormSubmit = async (item: Item) => {
        try {
            if (item.id) {
                await api.put(`/itens/${item.id}`, item);
            } else {
                await api.post('/itens', {
                    produtoId: item.produtoId,
                    quantidade: item.quantidade,
                    unidadeMedida: item.unidadeMedida,
                    produto: {
                        id: item.produtoId,
                        nome: item.produto.nome || '',
                    }
                });
            }
            fetchItens();
            setSnackbarMessage('Item salvo com sucesso!');
            setSnackbarSeverity('success');
        } catch (error: any) {
            console.error('Erro ao salvar item:', error);
            setSnackbarMessage(error?.reponse?.data?.message ||'Erro ao salvar item.');
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
            setIsItemFormOpen(false);
        }
    };


    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const filteredItens = itens.filter(item => {
        const produtoNome = produtos.find(prod => prod.id === item.produtoId)?.nome || '';
        return produtoNome.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div>
            <div style={{  marginBottom: '1rem', marginRight: "1rem"}}>
                <TextField
                    label="Pesquisar Item"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginRight: '2rem'}}
                />
                <Button variant="contained" color="primary" onClick={handleAddItem}>Adicionar Item</Button>
                
            </div>

            <Dialog open={isItemFormOpen} onClose={() => setIsItemFormOpen(false)}>
                <DialogTitle>{currentItem ? "Editar Item" : "Adicionar Item"}</DialogTitle>
                <DialogContent>
                    <ItemForm onSubmit={handleFormSubmit} closeForm={() => setIsItemFormOpen(false)} produtos={produtos} item={currentItem}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsItemFormOpen(false)} color="primary">
                        Cancelar
                    </Button>
                </DialogActions>

            </Dialog>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Produto ID</TableCell>
                            <TableCell>Nome do Produto</TableCell>
                            <TableCell>Quantidade</TableCell>
                            <TableCell>Unidade de Medida</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredItens.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6}>Nenhum item encontrado</TableCell>
                            </TableRow>
                        ) : (
                            filteredItens.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.produtoId}</TableCell>
                                    <TableCell>{produtos.find(prod => prod.id === item.produtoId)?.nome || 'Nome não disponível'}</TableCell>
                                    <TableCell>{item.quantidade}</TableCell>
                                    <TableCell>{item.unidadeMedida}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleEditItem(item)}>
                                            <EditIcon />
                                        </Button>
                                        <Button onClick={() => handleDeleteItem(item.id)}>
                                            <DeleteIcon />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                severity={snackbarSeverity}
            />
        </div>
    );
};

export default ItemList;