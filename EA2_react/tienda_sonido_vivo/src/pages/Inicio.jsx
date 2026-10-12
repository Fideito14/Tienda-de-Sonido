import { useContext, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { productos, categorias as categoriasData } from '../data/productos';
import { CartContext } from '../context/CartContext';

// Usamos un respaldo seguro si categoriasData no viene definido
const categoriasList = Array.isArray(categoriasData) ? categoriasData : [
    'Guitarras Acústicas', 'Guitarras Eléctricas', 'Bajos Eléctricos',
    'Baterías', 'Teclados y Pianos', 'Amplificadores', 'Micrófonos',
    'Pedales de Efectos', 'Accesorios', 'Estudio y Grabación'
];

const emojisCategorias = {
    'Guitarras Acústicas': '🪕',
    'Guitarras Eléctricas': '🎸',
    'Bajos Eléctricos': '🎸',
    'Baterías': '🥁',
    'Teclados y Pianos': '🎹',
    'Amplificadores': '🔊',
    'Micrófonos': '🎙️',
    'Pedales de Efectos': '🎛️',
    'Accesorios': '🔌',
    'Estudio y Grabación': '🎧'
};

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

const IMAGEN_RESPALDO = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80';

function Inicio() {
    const { agregarAlCarrito } = useContext(CartContext);

    const [mensajeAlerta, setMensajeAlerta] = useState(null);
    const [tipoAlerta, setTipoAlerta] = useState('success');

    const productosDestacados = Array.isArray(productos) ? productos.slice(0, 4) : [];

    const handleAgregarCarrito = (prod) => {
        const resultado = agregarAlCarrito(prod, 1);

        setTipoAlerta(resultado.exito ? 'success' : 'danger');
        setMensajeAlerta(resultado.mensaje);

        setTimeout(() => {
            setMensajeAlerta(null);
        }, 3000);
    };

    return (
        <div style={{ backgroundColor: '#09090B', color: '#F4F4F5', minHeight: '100vh' }}>

            {mensajeAlerta && (
                <div className="position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 1100, width: '90%', maxWidth: '500px' }}>
                    <Alert variant={tipoAlerta} className="shadow-lg text-center fw-semibold rounded-3">
                        {mensajeAlerta}
                    </Alert>
                </div>
            )}

            <section
                className="position-relative py-5 overflow-hidden"
                style={{
                    backgroundColor: '#18181B',
                    backgroundImage: 'linear-gradient(to right, rgba(9, 9, 11, 0.95), rgba(24, 24, 27, 0.75)), url("https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <Container className="py-5">
                    <Row className="align-items-center min-vh-50">
                        <Col lg={8} className="py-4">
                            <span className="text-warning fw-semibold text-uppercase tracking-wider small d-block mb-2">
                                Sonido Vivo • Sin Límites
                            </span>
                            <h1 className="display-3 fw-extrabold text-white mb-4 lh-sm">
                                Encuentra tu <span className="text-warning">sonido ideal</span>
                            </h1>
                            <p className="lead text-secondary mb-5 fs-4" style={{ maxWidth: '600px', color: '#D4D4D8' }}>
                                Equípate con los mejores instrumentos musicales y equipos de audio profesional. Da el siguiente paso en tu carrera musical con nosotros.
                            </p>
                            <div className="d-flex flex-wrap gap-3">
                                <Link to="/productos">
                                    <Button
                                        variant="warning"
                                        size="lg"
                                        className="rounded-pill fw-bold px-4 py-3 shadow-lg"
                                        style={{ backgroundColor: '#F59E0B', borderColor: '#F59E0B', color: '#09090B' }}
                                    >
                                        Ver Catálogo Completo &rarr;
                                    </Button>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="py-5" style={{ backgroundColor: '#09090B' }}>
                <Container className="py-4">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold text-white fs-1 mb-2">Explora nuestras categorías</h2>
                        <div className="mx-auto rounded-pill mb-3" style={{ width: '80px', height: '4px', backgroundColor: '#F59E0B' }}></div>
                        <p className="text-secondary" style={{ color: '#A1A1AA' }}>
                            Encuentra exactamente el equipamiento que necesitas para tu proyecto musical
                        </p>
                    </div>

                    <Row className="g-3 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 justify-content-center">
                        {categoriasList.map((catNombre, idx) => {
                            const emoji = emojisCategorias[catNombre] || '🎵';

                            return (
                                <Col key={idx}>
                                    <Link
                                        to={`/productos?categoria=${encodeURIComponent(catNombre)}`}
                                        className="text-decoration-none"
                                    >
                                        <Card
                                            className="h-100 border rounded-4 text-center overflow-hidden transition-all shadow-sm"
                                            style={{ backgroundColor: '#18181B', borderColor: '#27272A' }}
                                        >
                                            <Card.Body className="p-4 d-flex flex-column align-items-center justify-content-center">
                                                <div className="mb-2" style={{ fontSize: '2.5rem' }}>
                                                    {emoji}
                                                </div>
                                                <Card.Title className="fw-bold text-white small m-0 text-center">
                                                    {catNombre}
                                                </Card.Title>
                                            </Card.Body>
                                        </Card>
                                    </Link>
                                </Col>
                            );
                        })}
                    </Row>
                </Container>
            </section>

            <section className="py-5" style={{ backgroundColor: '#18181B' }}>
                <Container className="py-4">
                    <div className="d-flex justify-content-between align-items-end mb-5">
                        <div>
                            <h2 className="fw-bold text-white fs-1 mb-2">Productos Destacados</h2>
                            <div className="rounded-pill" style={{ width: '80px', height: '4px', backgroundColor: '#F59E0B' }}></div>
                        </div>
                        <Link to="/productos" className="text-warning text-decoration-none fw-bold">
                            Ver todos &rarr;
                        </Link>
                    </div>

                    <Row className="g-4">
                        {productosDestacados.map((prod) => {
                            const imgProd = prod.imagen || imagenesCategorias[prod.categoria] || IMAGEN_RESPALDO;
                            const prodId = prod.codigo || prod.id;

                            return (
                                <Col key={prodId} xs={12} sm={6} lg={3}>
                                    <Card
                                        className="h-100 border rounded-4 overflow-hidden d-flex flex-column shadow-lg"
                                        style={{ backgroundColor: '#09090B', borderColor: '#27272A' }}
                                    >
                                        <Card.Body className="p-4 d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <span className="text-uppercase small fw-bold" style={{ color: '#F59E0B' }}>
                                                    {prod.marca}
                                                </span>
                                                <Badge bg={prod.stock > 0 ? 'success' : 'danger'} className="rounded-pill">
                                                    {prod.stock > 0 ? `Stock: ${prod.stock}` : 'Agotado'}
                                                </Badge>
                                            </div>

                                            <div
                                                className="rounded-3 overflow-hidden d-flex align-items-center justify-content-center mb-3"
                                                style={{ backgroundColor: '#18181B', height: '160px', border: '1px solid #27272A' }}
                                            >
                                                <img
                                                    src={imgProd}
                                                    alt={prod.nombre}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = IMAGEN_RESPALDO;
                                                    }}
                                                />
                                            </div>

                                            <Card.Title className="fw-bold text-white fs-5 mb-2 text-truncate">
                                                {prod.nombre}
                                            </Card.Title>

                                            <p className="small text-muted mb-4">{prod.categoria}</p>

                                            <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center" style={{ borderColor: '#27272A' }}>
                                                <span className="fs-4 fw-bold text-white">
                                                    ${prod.precio ? prod.precio.toLocaleString('es-CL') : prod.precio}
                                                </span>
                                                <div className="d-flex gap-2">
                                                    {/* Aseguramos que la ruta coincida con App.jsx (/producto/ o /productos/) */}
                                                    <Link to={`/productos/${prodId}`}>
                                                        <Button
                                                            variant="outline-light"
                                                            size="sm"
                                                            className="rounded-pill px-3"
                                                        >
                                                            Ver
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="warning"
                                                        className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                                                        style={{ width: '42px', height: '42px', backgroundColor: '#F59E0B', borderColor: '#F59E0B' }}
                                                        onClick={() => handleAgregarCarrito(prod)}
                                                        disabled={prod.stock === 0}
                                                        title="Agregar al Carrito"
                                                    >
                                                        🛒
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </Container>
            </section>

        </div>
    );
}

export default Inicio;