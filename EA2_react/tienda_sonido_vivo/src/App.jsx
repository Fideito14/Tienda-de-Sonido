import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'
import Productos from './pages/Productos'
import DetalleProducto from './pages/DetalleProducto'
import NavbarComponent from './components/Navbar'
import InicioSesionpage from './pages/InicioSesion'
import RegistroSesionpage from './pages/RegistroSesion'
import { CartProvider } from './context/CartContext'
import Inicio from './pages/Inicio'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:id" element={<DetalleProducto />} />
          <Route path="/iniciosesion" element={<InicioSesionpage />} />
          <Route path="/registrosesion" element={<RegistroSesionpage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App