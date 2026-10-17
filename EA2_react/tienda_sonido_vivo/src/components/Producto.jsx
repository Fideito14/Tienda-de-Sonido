// src/components/Producto.jsx

import { useContext, useState, useRef } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { obtenerImagen } from '../data/imagenes';

function Producto({ id, nombre, descripcion, precio, stock, marca, modelo, categoria, imagen }) {
  const { agregarAlCarrito } = useContext(CartContext);

  const [mensaje, setMensaje] = useState(null);
  const timeoutRef = useRef(null);

  const imagenFinal = obtenerImagen({ imagen, categoria });

  // Objeto con los datos que se guardan en el carrito
  const productoParaCarro = {
    codigo: id,
    id,
    nombre,
    descripcion,
    precio,
    stock,
    marca,
    modelo,
    categoria,
    imagen: imagenFinal,
  };

  const handleAgregar = () => {
    const resultado = agregarAlCarrito(productoParaCarro);
    setMensaje(resultado);

    // Si se hace clic varias veces seguidas, reinicia el temporizador
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setMensaje(null), 3000);
  };

  return (
    <Card
      className="h-100 border rounded-4 overflow-hidden shadow-lg"
      style={{ backgroundColor: '#18181B', borderColor: '#27272A' }}
    >
      <Card.Body className="p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-uppercase small fw-bold" style={{ color: '#F59E0B' }}>
            {marca} {modelo && `• ${modelo}`}
          </span>
          <Badge bg={stock > 0 ? 'success' : 'danger'} className="rounded-pill px-2 py-1">
            {stock > 0 ? `Stock: ${stock}` : 'Agotado'}
          </Badge>
        </div>

        <div
          className="rounded-3 overflow-hidden d-flex align-items-center justify-content-center mb-3 position-relative"
          style={{ backgroundColor: '#09090B', height: '180px', border: '1px solid #27272A' }}
        >
          <img
            src={imagenFinal}
            alt={nombre}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Badge bg="dark" className="position-absolute bottom-0 start-0 m-2 border border-secondary text-light">
            {categoria}
          </Badge>
        </div>

        <Card.Title className="fw-bold text-white fs-5 mb-2 text-truncate" title={nombre}>
          {nombre}
        </Card.Title>

        <Card.Text className="small mb-4 flex-grow-1 text-truncate-2" style={{ color: '#A1A1AA' }}>
          {descripcion}
        </Card.Text>

        <div className="mt-auto pt-3 border-top" style={{ borderColor: '#27272A' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fs-4 fw-bold text-white">
              ${precio ? precio.toLocaleString('es-CL') : precio}
            </span>
          </div>

          {mensaje && (
            <div className={`small fw-semibold text-center mb-2 ${mensaje.exito ? 'text-success' : 'text-danger'}`}>
              {mensaje.mensaje}
            </div>
          )}

          <div className="d-grid gap-2">
            <Link to={`/productos/${id}`}>
              <Button
                variant="outline-light"
                size="sm"
                className="w-100 rounded-pill fw-semibold"
                style={{ borderColor: '#3F3F46', color: '#F4F4F5' }}
              >
                Ver Detalle
              </Button>
            </Link>
            <Button
              variant="warning"
              size="sm"
              className="rounded-pill fw-bold shadow-sm"
              style={{ backgroundColor: '#F59E0B', borderColor: '#F59E0B', color: '#09090B' }}
              onClick={handleAgregar}
              disabled={stock === 0}
            >
              Agregar al Carrito 🛒
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Producto;