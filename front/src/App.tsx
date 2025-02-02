import { useState, useEffect } from 'react'
import api from './api'
import ProdutoList from './components/ProdutoList'

import ItemList from './components/ItemList'

import CarrinhoList from './components/CarrinhoList'

import Dashboard from './components/Dashboard'
import Menu from './components/Menu'
import './App.css'
import { Carrinho, Item, Produto } from './types'


const App: React.FC = () => {
  const [view, setView] = useState('dashboard')
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [itens, setItens] = useState<any[]>([])
  const [carrinhos, setCarrinhos] = useState<any[]>([])

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodResponse, itemResponse, carrinhoResponse] = await Promise.all([
          api.get('/produtos'),
          api.get('/itens'),
          api.get('/carrinhos'),
        ])
        setProdutos(prodResponse.data)
        setItens(itemResponse.data)
        setCarrinhos(carrinhoResponse.data)
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      }
    }

    fetchData()
  }, [])
 

  const fetchItens = async () => {
    try {
      const response = await api.get('/itens')
      setItens(response.data)
    } catch (error) {
      console.error('Erro ao buscar itens:', error)
    }
  }

  useEffect(() => {
    if (view === 'itens') {
      fetchItens()
    }
  }, [view])

  

  return (
    <div className="app-container">
      <Menu setView={setView} />
      <div className="content">
        {view === 'dashboard' && <Dashboard produtos={produtos} itens={itens} carrinhos={carrinhos} />}

        {view === 'produtos' && (
          <div>
            <h1>Lista de Produtos</h1>
            
            <ProdutoList  />
             
          </div>
        )}
        {view === 'itens' && (
          <div>
            <h1>Lista de itens</h1>
            <ItemList  />
            
          </div>
        )}
        {view === 'carrinhos' && (
          <CarrinhoList />
        )}

        
      </div>
    </div>
  )
}

export default App;
