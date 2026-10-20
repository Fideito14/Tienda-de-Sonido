import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import './App.css'
import Productos from './pages/Productos'
import DetalleProducto from './pages/DetalleProducto'
import NavbarComponent from './components/Navbar'
import InicioSesion from './pages/InicioSesion'
import RegistroSesion from './pages/RegistroSesion'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { InventarioProvider } from './context/InventarioContext'
import { ToastProvider } from './context/ToastContext'
import Inicio from './pages/Inicio'
import Carro from './pages/Carro'
import Admin from './pages/admin/Admin'
import AdminProductos from './pages/admin/AdminProductos'
import AdminUsuarios from './pages/admin/AdminUsuarios'
import RutaAdmin from './pages/admin/RutaAdmin'

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <InventarioProvider>
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
                <Route
                  path="/admin"
                  element={
                    <RutaAdmin>
                      <Admin />
                    </RutaAdmin>
                  }
                >
                  <Route index element={<Navigate to="/admin/productos" replace />} />
                  <Route path="productos" element={<AdminProductos />} />
                  <Route path="usuarios" element={<AdminUsuarios />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </InventarioProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
