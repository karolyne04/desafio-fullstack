import React from 'react';
import { Produto } from '../types'; // Importando a interface Produto

interface DashboardProps {
    produtos: Produto[];
    itens: any[]; // Substitua por Item quando a interface estiver definida
    carrinhos: any[]; // Substitua por Carrinho quando a interface estiver definida
}

const Dashboard: React.FC<DashboardProps> = ({ produtos, itens, carrinhos }) => {
    return (
        <div>
            <h2>Dashboard</h2>
            <p>Produtos cadastrados: {produtos.length}</p>
            <p>Itens cadastrados: {itens.length}</p>
            <p>Carrinhos cadastrados: {carrinhos.length}</p>
            
        </div>
    );
};

export default Dashboard;