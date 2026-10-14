// src/components/Producto.jsx

import { useContext } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

// Mapeo apuntando a public/imagenes/
const imagenesCategorias = {
  'Guitarras Acústicas': '/Imagenes/guitarra_acustica.jpg',
  'Guitarras Eléctricas': '/Imagenes/guitarra_electrica.webp',
  'Bajos Eléctricos': '/Imagenes/bajo_electrico.webp',
  'Baterías': '/Imagenes/bateria.webp',
  'Teclados y Pianos': '/Imagenes/teclado.webp',
  'Amplificadores': '/Imagenes/amplificador.webp',
  'Micrófonos': '/Imagenes/microfono.webp',
  'Pedales de Efectos': '/Imagenes/pedal.jpg',
  'Accesorios': '/Imagenes/accesorios.jfif',
  'Estudio y Grabación': '/Imagenes/grabacion.jpg',
};

function Producto({ id, nombre, descripcion, precio, stock, marca, modelo, categoria, imagen }) {
  const { agregarAlCarrito } = useContext(CartContext);

  // Si el producto trae imagen en el JS la usa; si no, toma la de su categoría
  const imagenFinal = imagen || imagenesCategorias[categoria] || '/Imagenes/accesorios.jpg';

  /* Exequiel:
      había error en el método onClick agregarAlCarrito.
      Se soluciona creando un objeto para producto a insertar y usar ese producto.
  */
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
    imagen: imagenFinal
  }


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
              onClick={() => agregarAlCarrito(productoParaCarro)}
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