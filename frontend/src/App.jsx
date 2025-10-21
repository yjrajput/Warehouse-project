import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Shipments from './pages/Shipments'
import Orders from './pages/Orders'
import Alerts from './pages/Alerts'
import Warehouses from './pages/Warehouses'
import Settings from './pages/Settings'
import { InventoryProvider } from './contextAPI/InventoryContext'
import { useState } from 'react'

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () =>{
      switch(currentPage){
        case 'dashboard':{
          return <Dashboard/>
        }
        case 'products':{
          return <Products/>
        }
        case 'shipments':{
          return <Shipments/>
        }
        case 'orders':{
          return <Orders/>
        }
        case 'alerts':{
          return <Alerts/>
        }
        case 'warehouses':{
          return <Warehouses/>
        }
        case 'settings':{
          return <Settings/>
        }
      }
  }
  return (
    <>
        <InventoryProvider>
          <Sidebar currentPage = {currentPage} onNavigate = {setCurrentPage}>
              {renderPage()}
          </Sidebar>
        </InventoryProvider>
    </>
  )
}

export default App