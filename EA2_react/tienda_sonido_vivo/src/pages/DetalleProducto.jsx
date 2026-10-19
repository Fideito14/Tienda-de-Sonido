import { useState, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useInventario } from '../context/InventarioContext';
import { CartContext } from '../context/CartContext';
import { obtenerImagen, IMAGEN_RESPALDO } from '../data/imagenes';

function DetalleProducto() {
  const { id } = useParams();
  const { productos } = useInventario(); 

  const listaProductos = Array.isArray(productos) ? productos : [];
  const producto = listaProductos.find(
    (p) => String(p.codigo) === String(id) || String(p.id) === String(id)
  );

  const stockDisponible = producto?.stock ?? 0;
  const [cantidad, setCantidad] = useState(stockDisponible > 0 ? 1 : 0);

  // Estados para alertas visuales limpias
  const [mensajeAlerta, setMensajeAlerta] = useState(null);
  const [tipoAlerta, setTipoAlerta] = useState('success');

  const { agregarAlCarrito } = useContext(CartContext);

  const incrementar = () => {
    setCantidad((c) => Math.min(c + 1, stockDisponible));
  };

  const decrementar = () => {
    setCantidad((c) => Math.max(c - 1, stockDisponible > 0 ? 1 : 0));
  };

  const handleComprar = () => {
    if (!producto) return;
    const resultado = agregarAlCarrito(producto, cantidad);

    setTipoAlerta(resultado.exito ? 'success' : 'danger');
    setMensajeAlerta(resultado.mensaje);

    if (resultado.exito) {
      setCantidad(stockDisponible > 0 ? 1 : 0);
    }

    setTimeout(() => {
      setMensajeAlerta(null);
    }, 3000);
  };

  // Pantalla de respaldo si el producto no existe o hubo un error al cargar
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
              El producto solicitado con identificador <strong className="text-white">{id}</strong> no existe en nuestro catálogo.
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

  const imagenMostrar = obtenerImagen(producto);

  return (
    <div style={{ backgroundColor: '#09090B', color: '#F4F4F5', minHeight: '100vh' }} className="py-5">
      <Container className="py-4">
        <div className="mb-4">
          <Link to="/productos" className="text-warning text-decoration-none fw-semibold">
            &larr; Volver al catálogo
          </Link>
        </div>

        {mensajeAlerta && (
          <Alert variant={tipoAlerta} className="rounded-3 shadow-sm mb-4 text-center fw-semibold">
            {mensajeAlerta}
          </Alert>
        )}

        <Card className="border-0 rounded-4 overflow-hidden shadow-lg" style={{ backgroundColor: '#18181B', border: '1px solid #27272A' }}>
          <Card.Body className="p-4 p-md-5">
            <Row className="g-4 lg:g-5 align-items-center">
              <Col lg={6}>
                <div className="rounded-4 overflow-hidden d-flex align-items-center justify-content-center position-relative shadow-inner" style={{ backgroundColor: '#09090B', minHeight: '350px', maxHeight: '480px', border: '1px solid #27272A' }}>
                  <img
                    src={imagenMostrar}
                    alt={producto.nombre || 'Producto'}
                    className="w-100 h-100 object-cover"
                    style={{ maxHeight: '480px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = IMAGEN_RESPALDO;
                    }}
                  />
                  <Badge bg="dark" className="position-absolute top-0 start-0 m-3 border border-secondary text-warning px-3 py-2 rounded-pill fs-6">
                    {producto.categoria || 'Instrumentos'}
                  </Badge>
                </div>
              </Col>

              <Col lg={6}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="text-uppercase small fw-bold" style={{ color: '#F59E0B' }}>{producto.marca || 'Sonido Vivo'}</span>
                  <span className="text-secondary">•</span>
                  <span className="text-secondary small">Código: {producto.codigo || producto.id}</span>
                </div>

                <h1 className="fw-bold text-white display-5 mb-3">{producto.nombre}</h1>
                <p className="lead fs-5 mb-4" style={{ color: '#A1A1AA' }}>{producto.descripcion}</p>

                <Row className="mb-4 g-3 p-3 rounded-3" style={{ backgroundColor: '#09090B', border: '1px solid #27272A' }}>
                  <Col xs={6}>
                    <span className="d-block small text-uppercase text-secondary mb-1">Modelo</span>
                    <strong className="text-white fs-6">{producto.modelo || 'N/A'}</strong>
                  </Col>
                  <Col xs={6}>
                    <span className="d-block small text-uppercase text-secondary mb-1">Disponibilidad</span>
                    {stockDisponible > 0 ? (
                      <Badge bg="success" className="rounded-pill px-2 py-1">Stock: {stockDisponible} uds.</Badge>
                    ) : (
                      <Badge bg="danger" className="rounded-pill px-2 py-1">Agotado</Badge>
                    )}
                  </Col>
                </Row>

                <div className="mb-4">
                  <span className="d-block small text-uppercase text-secondary mb-1">Precio Online</span>
                  <span className="display-6 fw-bold text-white">
                    ${typeof producto.precio === 'number' ? producto.precio.toLocaleString('es-CL') : producto.precio}
                  </span>
                </div>

                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className="text-uppercase small text-secondary">Cantidad:</span>
                  <div className="d-flex align-items-center gap-2 bg-zinc-900 p-1 rounded-pill" style={{ border: '1px solid #3F3F46' }}>
                    <Button
                      variant="outline-light"
                      size="sm"
                      className="rounded-circle fw-bold border-0"
                      style={{ width: '36px', height: '36px', backgroundColor: '#27272A' }}
                      onClick={decrementar}
                      disabled={stockDisponible === 0 || cantidad <= 1}
                    >
                      −
                    </Button>
                    <span className="fw-bold fs-5 text-center text-white px-2" style={{ minWidth: '2ch' }}>
                      {cantidad}
                    </span>
                    <Button
                      variant="outline-light"
                      size="sm"
                      className="rounded-circle fw-bold border-0"
                      style={{ width: '36px', height: '36px', backgroundColor: '#27272A' }}
                      onClick={incrementar}
                      disabled={stockDisponible === 0 || cantidad >= stockDisponible}
                    >
                      +
                    </Button>
                  </div>
                  <span className="small text-secondary">(Máx. {stockDisponible})</span>
                </div>

                <div className="d-flex flex-wrap gap-3 pt-2">
                  <Button
                    variant="warning"
                    size="lg"
                    className="rounded-pill fw-bold px-4 py-3 shadow-lg flex-grow-1"
                    style={{ backgroundColor: '#F59E0B', borderColor: '#F59E0B', color: '#09090B' }}
                    onClick={handleComprar}
                    disabled={stockDisponible === 0}
                  >
                    Agregar al Carrito 🛒
                  </Button>
                  <Link to="/productos">
                    <Button variant="outline-light" size="lg" className="rounded-pill fw-bold px-4 py-3" style={{ borderColor: '#3F3F46', color: '#F4F4F5' }}>
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