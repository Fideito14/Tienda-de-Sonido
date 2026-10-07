import { Container, Row, Col, Carousel, Button } from 'react-bootstrap'
import Producto from '../components/Producto'
import { productos, categorias } from '../data/productos'

function Productos() {
  return (
    <Container>
      <Row>
        <Col>
          <h1
            id="productos-titulo"
            className="text-center m-4"
            style={{ color: '#1E5A9C', fontWeight: 'normal' }}
          >
            Nuestros Productos
          </h1>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        {/* Por cada Producto, generamos un componente <Producto> con sus atributos obtenidos de productos.js */}
        {productos.map((producto) => (
          <Producto
            id={producto.codigo}
            nombre={producto.nombre}
            descripcion={producto.descripcion}
            precio={producto.precio}
            stock={producto.stock}
          />
        ))}
      </Row>
    </Container>
  )
}

export default Productos