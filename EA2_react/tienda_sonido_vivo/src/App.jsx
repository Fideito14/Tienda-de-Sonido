import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'
import Productos from './pages/Productos'
import DetalleProducto from './pages/DetalleProducto'
import NavbarComponent from './components/Navbar'
import InicioSesion from './pages/InicioSesion'
import RegistroSesion from './pages/RegistroSesion'
import { CartProvider } from './context/CartContext'
import Inicio from './pages/Inicio'
import Carro from './pages/Carro';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:id" element={<DetalleProducto />} />
          <Route path="/iniciosesion" element={<InicioSesion />} />
          <Route path="/registrosesion" element={<RegistroSesion />} />
          <Route path="/carrito" element={<Carro />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App