import { useState, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { productos } from '../data/productos';
import { CartContext } from '../context/CartContext';

const imagenesCategorias = {
  'Guitarras Acústicas': '/imagenes/guitarra_acustica.jpg',
  'Guitarras Eléctricas': '/imagenes/guitarras-electrica.webp',
  'Bajos Eléctricos': '/imagenes/bajo_electrico.webp',
  'Baterías': '/imagenes/bateria.webp',
  'Teclados y Pianos': '/imagenes/teclado.webp',
  'Amplificadores': '/imagenes/amplificador.webp',
  'Micrófonos': '/imagenes/microfono.webp',
  'Pedales de Efectos': '/imagenes/pedal.jpg',
  'Accesorios': '/imagenes/accesorios.jfif',
  'Estudio y Grabación': '/imagenes/grabacion.jpg',
};

const IMAGEN_RESPALDO = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80';

function DetalleProducto() {
  const { id } = useParams();
  const producto = productos.find((p) => p.codigo === id);
  const [cantidad, setCantidad] = useState(producto?.stock > 0 ? 1 : 0);

  const { agregarAlCarrito } = useContext(CartContext);

  const incrementar = () => {
    setCantidad((c) => Math.min(c + 1, producto.stock));
  };

  const decrementar = () => {
    setCantidad((c) => Math.max(c - 1, producto.stock > 0 ? 1 : 0));
  };

  const handleComprar = () => {
    agregarAlCarrito(cantidad);
  };

  // Pantalla cuando el producto no existe
  if (!producto) {
    return (
      <div style={{ backgroundColor: '#09090B', color: '#F4F4F5', minHeight: '100vh' }} className="py-5">
        <Container className="py-5">
          <Alert 
            variant="dark" 
            className="text-center p-5 border rounded-4 shadow-lg mx-auto"
            style={{ backgroundColor: '#18181B', borderColor: '#27272A', color: '#F4F4F5', maxWidth: '600px' }}
          >
            <Alert.Heading className="fw-bold text-warning mb-3">Producto no encontrado</Alert.Heading>
            <p className="text-secondary mb-4">
              El producto con código <strong className="text-white">{id}</strong> no existe en nuestro catálogo.
            </p>
            <Link to="/productos">
              <Button 
                variant="warning" 
                className="rounded-pill fw-bold px-4 py-2"
                style={{ backgroundColor: '#F59E0B', borderColor: '#F59E0B', color: '#09090B' }}
              >
                Volver al catálogo
              </Button>
            </Link>
          </Alert>
        </Container>
      </div>
    );
  }

  const imagenMostrar = producto.imagen || imagenesCategorias[producto.categoria] || IMAGEN_RESPALDO;

  return (
    <div style={{ backgroundColor: '#09090B', color: '#F4F4F5', minHeight: '100vh' }} className="py-5">
      <Container className="py-4">
        <div className="mb-4">
          <Link to="/productos" className="text-warning text-decoration-none fw-semibold">
            &larr; Volver al catálogo
          </Link>
        </div>

        <Card 
          className="border-0 rounded-4 overflow-hidden shadow-lg"
          style={{ backgroundColor: '#18181B', border: '1px solid #27272A' }}
        >
          <Card.Body className="p-4 p-md-5">
            <Row className="g-4 lg:g-5 align-items-center">
              <Col lg={6}>
                <div 
                  className="rounded-4 overflow-hidden d-flex align-items-center justify-content-center position-relative shadow-inner"
                  style={{ backgroundColor: '#09090B', minHeight: '350px', maxHeight: '480px', border: '1px solid #27272A' }}
                >
                  <img 
                    src={imagenMostrar} 
                    alt={producto.nombre} 
                    className="w-full h-full object-cover"
                    style={{ width: '100%', height: '100%', maxHeight: '480px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = IMAGEN_RESPALDO;
                    }}
                  />
                  <Badge 
                    bg="dark" 
                    className="position-absolute top-0 start-0 m-3 border border-secondary text-warning px-3 py-2 rounded-pill fs-6"
                  >
                    {producto.categoria}
                  </Badge>
                </div>
              </Col>

              {/* COLUMNA DERECHA: Información y acciones de compra */}
              <Col lg={6}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="text-uppercase small fw-bold tracking-wider" style={{ color: '#F59E0B' }}>
                    {producto.marca}
                  </span>
                  <span className="text-secondary">•</span>
                  <span className="text-secondary small">Código: {producto.codigo}</span>
                </div>

                <h1 className="fw-bold text-white display-5 mb-3">
                  {producto.nombre}
                </h1>

                <p className="lead fs-5 mb-4" style={{ color: '#A1A1AA' }}>
                  {producto.descripcion}
                </p>

                {/* Grilla de Especificaciones */}
                <Row className="mb-4 g-3 p-3 rounded-3" style={{ backgroundColor: '#09090B', border: '1px solid #27272A' }}>
                  <Col xs={6}>
                    <span className="d-block small text-uppercase text-secondary mb-1">Modelo</span>
                    <strong className="text-white fs-6">{producto.modelo || 'N/A'}</strong>
                  </Col>
                  <Col xs={6}>
                    <span className="d-block small text-uppercase text-secondary mb-1">Disponibilidad</span>
                    {producto.stock > 0 ? (
                      <Badge bg="success" className="rounded-pill px-2 py-1">
                        Stock: {producto.stock} uds.
                      </Badge>
                    ) : (
                      <Badge bg="danger" className="rounded-pill px-2 py-1">
                        Agotado
                      </Badge>
                    )}
                  </Col>
                </Row>

                {/* Precio destacado */}
                <div className="mb-4">
                  <span className="d-block small text-uppercase text-secondary mb-1">Precio Online</span>
                  <span className="display-6 fw-bold text-white">
                    ${producto.precio ? producto.precio.toLocaleString('es-CL') : producto.precio}
                  </span>
                </div>

                {/* Selector de Cantidad */}
                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className="text-uppercase small text-secondary">
                    Cantidad:
                  </span>
                  <div className="d-flex align-items-center gap-2 bg-zinc-900 p-1 rounded-pill" style={{ border: '1px solid #3F3F46' }}>
                    <Button
                      variant="outline-light"
                      size="sm"
                      className="rounded-circle fw-bold border-0"
                      style={{ width: '36px', height: '36px', backgroundColor: '#27272A' }}
                      onClick={decrementar}
                      disabled={producto.stock === 0 || cantidad <= 1}
                      aria-label="Disminuir cantidad"
                    >
                      −
                    </Button>
                    <span 
                      className="fw-bold fs-5 text-center text-white px-2"
                      style={{ minWidth: '2ch' }}
                    >
                      {cantidad}
                    </span>
                    <Button
                      variant="outline-light"
                      size="sm"
                      className="rounded-circle fw-bold border-0"
                      style={{ width: '36px', height: '36px', backgroundColor: '#27272A' }}
                      onClick={incrementar}
                      disabled={producto.stock === 0 || cantidad >= producto.stock}
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </Button>
                  </div>
                  <span className="small text-secondary">
                    (Máx. {producto.stock})
                  </span>
                </div>

                {/* Botones de Acción */}
                <div className="d-flex flex-wrap gap-3 pt-2">
                  <Button
                    variant="warning"
                    size="lg"
                    className="rounded-pill fw-bold px-4 py-3 shadow-lg flex-grow-1"
                    style={{ backgroundColor: '#F59E0B', borderColor: '#F59E0B', color: '#09090B' }}
                    onClick={handleComprar}
                    disabled={producto.stock === 0}
                  >
                    Agregar al Carrito 🛒
                  </Button>
                  <Link to="/productos">
                    <Button
                      variant="outline-light"
                      size="lg"
                      className="rounded-pill fw-bold px-4 py-3"
                      style={{ borderColor: '#3F3F46', color: '#F4F4F5' }}
                    >
                      Seguir explorando
                    </Button>
                  </Link>
                </div>

              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default DetalleProducto;