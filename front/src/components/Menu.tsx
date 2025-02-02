import React from 'react';
import './Menu.css'; // Importando o CSS para o menu

interface MenuProps {
    setView: (view: string) => void; // Função para mudar a visualização
}

const Menu: React.FC<MenuProps> = ({ setView }) => {
    return (
        <div className="menu">
            <h2>Lista</h2>
            <button onClick={() => setView('dashboard')}>Dashboard</button>
            <button onClick={() => setView('produtos')}>Produtos</button>
            <button onClick={() => setView('itens')}>Itens</button>
            <button onClick={() => setView('carrinhos')}>Carrinhos</button>
        </div>
    );
};

export default Menu; 