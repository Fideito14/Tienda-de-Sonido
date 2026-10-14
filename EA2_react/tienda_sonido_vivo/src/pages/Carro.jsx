import { useContext, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const IMAGEN_RESPALDO = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80';

function Carro() {
    const { carrito, precioTotal, actualizarCantidad, eliminarDelCarrito, vaciarCarrito } = useContext(CartContext);
    const [compraExitosa, setCompraExitosa] = useState(false);

    const handlePagar = () => {
        setCompraExitosa(true);
        vaciarCarrito();
    };

    // Pantalla de confirmación tras realizar el pago
    if (compraExitosa) {
        return (
            <div style={{ backgroundColor: '#09090B', color: '#F4F4F5', minHeight: '100vh' }} className="py-5">
                <Container className="py-5 text-center">
                    <Card
                        className="border-0 rounded-4 p-5 mx-auto shadow-lg"
                        style={{ backgroundColor: '#18181B', maxWidth: '600px', border: '1px solid #27272A' }}
                    >
                        <div className="display-1 mb-3">🎉</div>
                        <h2 className="fw-bold text-white mb-3">¡Compra realizada con éxito!</h2>
                        <p className="text-secondary mb-4">
                            Gracias por confiar en <strong className="text-warning">Sonido Vivo</strong>. Tu pedido está siendo procesado y pronto sonará la música.
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
                    </Card>
                </Container>
            </div>
        );
    }

    // Pantalla cuando el carrito no tiene elementos
    if (!carrito || carrito.length === 0) {
        return (
            <div style={{ backgroundColor: '#09090B', color: '#F4F4F5', minHeight: '100vh' }} className="py-5">
                <Container className="py-5 text-center">
                    <Card
                        className="border-0 rounded-4 p-5 mx-auto shadow-lg"
                        style={{ backgroundColor: '#18181B', maxWidth: '600px', border: '1px solid #27272A' }}
                    >
                        <div className="display-4 text-warning mb-3">🛒</div>
                        <h2 className="fw-bold text-white mb-2">Tu carrito está vacío</h2>
                        <p className="text-secondary mb-4">
                            Explora nuestro catálogo y encuentra el instrumento o equipo perfecto para ti.
                        </p>
                        <Link to="/productos">
                            <Button
                                variant="warning"
                                className="rounded-pill fw-bold px-4 py-2"
                                style={{ backgroundColor: '#F59E0B', borderColor: '#F59E0B', color: '#09090B' }}
                            >
                                Ver catálogo de productos
                            </Button>
                        </Link>
                    </Card>
                </Container>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#09090B', color: '#F4F4F5', minHeight: '100vh' }} className="py-5">
            <Container className="py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="fw-bold text-white display-6 m-0">Tu Carrito de Compras 🛒</h1>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        className="rounded-pill px-3"
                        onClick={vaciarCarrito}
                    >
                        Vaciar carrito
                    </Button>
                </div>

                <Row className="g-4">
                    {/* LISTADO DE PRODUCTOS */}
                    <Col lg={8}>
                        <div className="d-flex flex-column gap-3">
                            {carrito.map((item) => {
                                const idItem = item.codigo || item.id;
                                const subtotal = item.precio * item.cantidad;
                                const imagenProd = item.imagen || IMAGEN_RESPALDO;

                                return(
                                    <Card
                                        key={idItem}
                                        className="border-0 rounded-4 shadow-sm p-3"
                                        style={{ backgroundColor: '#18181B', border: '1px solid #27272A' }}
                                    >
                                        <Row className="align-items-center g-3">
                                            {/* Imagen del producto */}
                                            <Col xs={3} md={2}>
                                                <div
                                                    className="rounded-3 overflow-hidden bg-black"
                                                    style={{ height: '70px', border: '1px solid #27272A' }}
                                                >
                                                    <img
                                                        src={imagenProd}
                                                        alt={item.nombre}
                                                        className="w-100 h-100 object-fit-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = IMAGEN_RESPALDO;
                                                        }}
                                                    />
                                                </div>
                                            </Col>

                                            {/* Información del Producto y Cantidad en Texto */}
                                            <Col xs={9} md={4}>
                                                <span className="small text-warning text-uppercase fw-bold">{item.marca}</span>
                                                <h6 className="fw-bold text-white mb-1 text-truncate">{item.nombre}</h6>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="text-secondary small">
                                                        ${item.precio ? item.precio.toLocaleString('es-CL') : item.precio} c/u
                                                    </span>
                                                    <span className="text-secondary small">•</span>
                                                    <span className="text-warning small fw-semibold">
                                                        Cantidad: {item.cantidad}
                                                    </span>
                                                </div>
                                            </Col>

                                            {/* Selector interactivo de Cantidad */}
                                            <Col xs={6} md={3} className="d-flex align-items-center gap-2">
                                                <Button
                                                    variant="outline-light"
                                                    size="sm"
                                                    className="rounded-circle p-0 d-flex align-items-center justify-content-center"
                                                    style={{ width: '32px', height: '32px', backgroundColor: '#27272A', borderColor: '#3F3F46' }}
                                                    onClick={() => actualizarCantidad(idItem, item.cantidad - 1)}
                                                    disabled={item.cantidad <= 1}
                                                    aria-label="Disminuir cantidad"
                                                >
                                                    −
                                                </Button>
                                                <span className="fw-bold text-white px-1" style={{ minWidth: '2ch', textAlign: 'center' }}>
                                                    {item.cantidad}
                                                </span>
                                                <Button
                                                    variant="outline-light"
                                                    size="sm"
                                                    className="rounded-circle p-0 d-flex align-items-center justify-content-center"
                                                    style={{ width: '32px', height: '32px', backgroundColor: '#27272A', borderColor: '#3F3F46' }}
                                                    onClick={() => actualizarCantidad(idItem, item.cantidad + 1)}
                                                    disabled={item.cantidad >= item.stock}
                                                    aria-label="Aumentar cantidad"
                                                >
                                                    +
                                                </Button>
                                            </Col>

                                            {/* Subtotal por Ítem */}
                                            <Col xs={4} md={2} className="text-end">
                                                <strong className="text-white fs-6">
                                                    ${subtotal ? subtotal.toLocaleString('es-CL') : subtotal}
                                                </strong>
                                            </Col>

                                            {/* Botón de Eliminación */}
                                            <Col xs={2} md={1} className="text-end">
                                                <Button
                                                    variant="link"
                                                    className="text-danger p-0 fs-5 text-decoration-none"
                                                    onClick={() => eliminarDelCarrito(idItem)}
                                                    title="Eliminar producto"
                                                >
                                                    &times;
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card>
                                );
                            })}
                        </div>
                    </Col>

                    {/* RESUMEN DE COMPRA / CHECKOUT */}
                    <Col lg={4}>
                        <Card
                            className="border-0 rounded-4 shadow-lg p-4 sticky-top"
                            style={{ backgroundColor: '#18181B', border: '1px solid #27272A', top: '2rem' }}
                        >
                            <h4 className="fw-bold text-white mb-4">Resumen del pedido</h4>

                            <div className="d-flex justify-content-between mb-2 text-secondary">
                                <span>Subtotal</span>
                                <span className="text-white">${precioTotal ? precioTotal.toLocaleString('es-CL') : 0}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 text-secondary">
                                <span>Envío</span>
                                <span className="text-success fw-semibold">Gratis 🚚</span>
                            </div>

                            <hr style={{ borderColor: '#27272A' }} />

                            <div className="d-flex justify-content-between mb-4">
                                <span className="fw-bold text-white fs-5">Total</span>
                                <span className="fw-bold text-warning fs-4">
                                    ${precioTotal ? precioTotal.toLocaleString('es-CL') : 0}
                                </span>
                            </div>

                            <Button
                                variant="warning"
                                size="lg"
                                className="rounded-pill fw-bold w-100 py-3 shadow-lg"
                                style={{ backgroundColor: '#F59E0B', borderColor: '#F59E0B', color: '#09090B' }}
                                onClick={handlePagar}
                            >
                                Proceder al pago 💳
                            </Button>

                            <Link to="/productos" className="text-center mt-3 text-secondary text-decoration-none small">
                                &larr; Seguir explorando
                            </Link>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Carro;