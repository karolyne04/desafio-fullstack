import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Button,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Produto } from "../types"; // Importando a interface
import api from "../api";
import ProdutoForm from "./ProdutoForm";

const ProdutoList: React.FC = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]); // Lista de produtos
    const [loading, setLoading] = useState(true); // Estado para controle de carregamento
    const [searchTerm, setSearchTerm] = useState(""); // Termo de busca para filtragem
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentProduto, setCurrentProduto] = useState<Produto | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
        "success"
    );

    // Função para buscar os produtos
    const fetchProdutos = async () => {
        try {
            const response = await api.get("/produtos");
            setProdutos(response.data);
            setLoading(false); // Para de mostrar o loading
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProdutos();
    }, []); // O useEffect será executado uma vez após o componente ser montado

    // Filtragem dos produtos com base no termo de busca
    const filteredProdutos = produtos.filter((produto) =>
        produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddProduto = () => {
        setCurrentProduto(null); // Para adicionar um novo produto
        setIsFormOpen(true);
    };

    const handleEditProduto = (produto: Produto) => {
        setCurrentProduto(produto); // Para editar um produto existente
        setIsFormOpen(true);
    };

    const handleDeleteProduto = async (id: number) => {
        try {
            await api.delete(`/produtos/${id}`); // Requisição para excluir o produto
            fetchProdutos(); // Atualiza a lista de produtos
            setSnackbarMessage("Produto excluído com sucesso!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Erro ao excluir produto:", error);
            setSnackbarMessage("Erro ao excluir produto.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleFormSubmit = async (produto: Produto) => {
        try {
            if (currentProduto) {
                // Se estamos editando, faça uma requisição PUT
                await api.put(`/produtos/${currentProduto.id}`, produto);
                setSnackbarMessage("Produto atualizado com sucesso!");
            } else {
                // Se estamos adicionando, faça uma requisição POST
                await api.post("/produtos", produto);
                setSnackbarMessage("Produto adicionado com sucesso!");
            }
            fetchProdutos(); // Atualiza a lista de produtos
            setSnackbarSeverity("success");
        } catch (error) {
            console.error("Erro ao salvar produto:", error);
            setSnackbarMessage("Erro ao salvar produto.");
            setSnackbarSeverity("error");
        } finally {
            setSnackbarOpen(true); // Abre o Snackbar para feedback
            closeForm(); // Fecha o formulário
        }
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setCurrentProduto(null); // Limpa o produto atual ao fechar o formulário
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Se estiver carregando, exibe uma mensagem de loading
    if (loading) {
        return <p>Carregando produtos...</p>;
    }

    return (
        <div>
            <Dialog open={isFormOpen} onClose={closeForm}>
                <DialogTitle>{currentProduto ? 'Editar Produto' : 'Adicionar Produto'}</DialogTitle>
                <DialogContent>
                    <ProdutoForm
                        onSubmit={handleFormSubmit} // Passa a função de submit para o formulário
                        closeForm={closeForm}
                        produto={currentProduto} // Passa o produto atual para edição
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeForm} color="primary">
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
            <TableContainer>
                <TextField
                    label="Pesquisar Produto"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    style={{ marginBottom: "1rem", marginRight: "1rem" }} 
                />
            <Button variant="contained" onClick={handleAddProduto}>
                Adicionar Produto
            </Button>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProdutos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3}>Nenhum produto encontrado</TableCell>
                            </TableRow>
                        ) : (
                            filteredProdutos.map((produto) => (
                                <TableRow key={produto.id}>
                                    <TableCell>{produto.id}</TableCell>
                                    <TableCell>{produto.nome}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleEditProduto(produto)}>
                                            <EditIcon />
                                        </Button>
                                        <Button onClick={() => handleDeleteProduto(produto.id)}>
                                            <DeleteIcon />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
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

export default ProdutoList;
