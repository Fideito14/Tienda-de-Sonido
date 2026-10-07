import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'
import Productos from './pages/Productos'
import DetalleProducto from './pages/DetalleProducto'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/productos"
          element={<Productos/>}
        />
        <Route
          path="/productos/:id"
          element={<DetalleProducto/>}
        />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
