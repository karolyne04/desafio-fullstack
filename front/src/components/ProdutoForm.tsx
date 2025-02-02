import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import api from "../api"; // Certifique-se de que o caminho está correto
import { Produto } from "../types";

interface ProdutoFormProps {
    onSubmit: (produto: Produto) => void;
    closeForm: () => void;
    produto?: Produto; // Para edição
}

const ProdutoForm: React.FC<ProdutoFormProps> = ({ onSubmit, closeForm, produto }) => {
    const [nome, setNome] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (produto) {
            setNome(produto.nome); // Preenche o campo com o nome do produto para edição
        }
    }, [produto]);

    

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ id: produto?.id, nome }); // Envia o produto para o componente pai
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Nome do Produto"
                variant="outlined"
                value={nome}
                onChange={(e) => {
                    setNome(e.target.value);
                    setError(""); // Limpa o erro ao digitar
                }}
                required
                error={!!error}
                helperText={error}
                fullWidth
                style={{ marginBottom: "1rem" }}
            />
            <div style={{ display: "flex", gap: "1rem" }}>
                <Button type="submit" variant="contained" style={{ marginRight: '1rem' }}>
                    {produto ? 'Atualizar' : 'Criar'}
                </Button>
                <Button onClick={closeForm} variant="outlined">
                    Cancelar
                </Button>
            </div>
        </form>
    );
};

export default ProdutoForm;
