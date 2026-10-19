// src/pages/Productos.jsx

import { Container, Row, Col, Button } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import Producto from '../components/Producto';
import { categorias } from '../data/productos';
import { useInventario } from '../context/InventarioContext';


function Productos() {
  const { productos } = useInventario();   // <-- línea nueva, al inicio del componente
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaSeleccionada = searchParams.get('categoria') || '';


  const productosFiltrados = categoriaSeleccionada
    ? productos.filter((p) => p.categoria === categoriaSeleccionada)
    : productos;

  const seleccionarCategoria = (cat) => {
    if (cat === '') {
      setSearchParams({}); 
    } else {
      setSearchParams({ categoria: cat }); 
    }
  };

  return (
    <div style={{ backgroundColor: '#09090B', color: '#F4F4F5', minHeight: '100vh' }} className="py-5">
      <Container>
        {/* Encabezado */}
        <Row className="mb-4">
          <Col className="text-center">
            <span className="text-warning fw-semibold text-uppercase tracking-wider small d-block mb-2">
              Equipamiento Profesional
            </span>
            <h1 className="fw-extrabold text-white display-4 mb-3">
              {categoriaSeleccionada ? categoriaSeleccionada : 'Nuestros Productos'}
            </h1>
            <div className="mx-auto rounded-pill mb-3" style={{ width: '80px', height: '4px', backgroundColor: '#F59E0B' }}></div>
          </Col>
        </Row>

        {/* BARRA DE FILTROS POR CATEGORÍA */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
          <Button
            variant={categoriaSeleccionada === '' ? 'warning' : 'outline-light'}
            size="sm"
            className="rounded-pill px-3 fw-bold"
            style={
              categoriaSeleccionada === ''
                ? { backgroundColor: '#F59E0B', borderColor: '#F59E0B', color: '#09090B' }
                : { borderColor: '#3F3F46', color: '#A1A1AA' }
            }
            onClick={() => seleccionarCategoria('')}
          >
            Todos ({productos.length})
          </Button>

          {categorias.map((cat, idx) => (
            <Button
              key={idx}
              variant={categoriaSeleccionada === cat ? 'warning' : 'outline-light'}
              size="sm"
              className="rounded-pill px-3 fw-semibold"
              style={
                categoriaSeleccionada === cat
                  ? { backgroundColor: '#F59E0B', borderColor: '#F59E0B', color: '#09090B' }
                  : { borderColor: '#3F3F46', color: '#A1A1AA' }
              }
              onClick={() => seleccionarCategoria(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* MENSAJE SI NO HAY PRODUCTOS */}
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-secondary fs-5">No se encontraron productos en esta categoría.</p>
            <Button
              variant="warning"
              className="rounded-pill fw-bold"
              style={{ backgroundColor: '#F59E0B', borderColor: '#F59E0B', color: '#09090B' }}
              onClick={() => seleccionarCategoria('')}
            >
              Ver todos los productos
            </Button>
          </div>
        ) : (

          <Row className="g-4">
            {productosFiltrados.map((producto) => (
              <Col key={producto.codigo} xs={12} sm={6} md={4} lg={3}>
                <Producto
                  id={producto.codigo}
                  nombre={producto.nombre}
                  descripcion={producto.descripcion}
                  precio={producto.precio}
                  stock={producto.stock}
                  marca={producto.marca}
                  modelo={producto.modelo}
                  categoria={producto.categoria}
                  imagen={producto.imagen}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default Productos;