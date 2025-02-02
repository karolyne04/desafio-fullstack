import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import CarrinhoForm from './CarrinhoForm';
import api from '../api'; // Certifique-se de que o caminho está correto
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Produto {
    id: number;
    nome: string;
}

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

const CarrinhoList: React.FC = () => {
    const [carrinhos, setCarrinhos] = useState<Carrinho[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [currentCarrinho, setCurrentCarrinho] = useState<Carrinho | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCarrinhos = async () => {
        try {
            const response = await api.get('/carrinhos'); // Requisição GET para buscar carrinhos
            setCarrinhos(response.data);
        } catch (error) {
            console.error('Erro ao buscar carrinhos:', error);
            setSnackbarMessage('Erro ao buscar carrinhos.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
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
        fetchCarrinhos();
        fetchProdutos(); 
    }, []);

    const handleAddCarrinho = () => {
        setCurrentCarrinho(null); 
        setIsFormOpen(true);
    };

    const handleEditCarrinho = (carrinho: Carrinho) => {
        setCurrentCarrinho(carrinho); 
        setIsFormOpen(true);
    };

    const handleDeleteCarrinho = async (id: number) => {
        try {
            await api.delete(`/carrinhos/${id}`); 
            fetchCarrinhos(); 
            setSnackbarMessage('Carrinho excluído com sucesso!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Erro ao excluir carrinho:', error);
            setSnackbarMessage('Erro ao excluir carrinho.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    
    const handleFormSubmit = async (carrinho: Carrinho) => {
        try {
            // Normaliza os itens para garantir que o backend receba o formato correto
            const carrinhoFormatado = {
                id: carrinho.id,  // Apenas o ID do carrinho será atualizado
                itensCarrinho: carrinho.itensCarrinho // Mantemos os itens como estão
            };
    
            console.log("Enviando carrinho formatado:", carrinhoFormatado);
    
            if (currentCarrinho) {
                // Requisição PUT para atualizar o carrinho com o novo ID
                await api.put(`/carrinhos/${carrinho.id}`, carrinhoFormatado);
                setSnackbarMessage('Carrinho atualizado com sucesso!');
            } else {
                await api.post('/carrinhos', carrinhoFormatado); // Criação de um novo carrinho
                setSnackbarMessage('Carrinho criado com sucesso!');
            }
    
            fetchCarrinhos(); // Atualiza a lista de carrinhos após a operação
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            console.error('Erro ao salvar carrinho:');
            setSnackbarMessage('Erro ao salvar carrinho.');
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true); // Exibe a mensagem de feedback
            closeForm(); // Fecha o formulário
        }
    };
    
    
    
    const closeForm = () => {
        setIsFormOpen(false);
        setCurrentCarrinho(null); // Reseta o carrinho atual
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Filtra os carrinhos com base no termo de pesquisa
    const filteredCarrinhos = carrinhos.filter(carrinho => {
        return carrinho.id.toString().includes(searchTerm) ||
            carrinho.itensCarrinho.some(item => item.produto.nome.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    return (
        <div>
            <h2>Lista de Carrinhos</h2>
            <TextField
                label="Pesquisar Carrinho"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '1rem', marginRight: "2rem"}}
            />
            <Button variant="contained" onClick={handleAddCarrinho}>Adicionar Carrinho</Button>
            <Dialog open={isFormOpen} onClose={closeForm}>
                <DialogTitle>{currentCarrinho ? 'Editar Carrinho' : 'Criar Carrinho'}</DialogTitle>
                <DialogContent>
                    <CarrinhoForm
                        onSubmit={handleFormSubmit} // Passa a função de submit para o formulário
                        closeForm={closeForm}
                        itens={produtos} // Passa a lista de produtos para o formulário
                        carrinho={currentCarrinho} // Passa o carrinho atual para edição
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeForm} color="primary">
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCarrinhos.map(carrinho => (
                            <TableRow key={carrinho.id}>

                                    <TableCell>{carrinho.id}</TableCell>
                                    
                                <TableCell>
                                    <Button onClick={() => handleEditCarrinho(carrinho)}>
                                        <EditIcon />
                                    </Button>
                                    <Button onClick={() => handleDeleteCarrinho(carrinho.id)}>
                                        <DeleteIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Snackbar para feedback */}
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

export default CarrinhoList; 