import { Card, Button, Col, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'


function Producto({ id, nombre, descripcion, precio, stock }) {
  return (
    <Col xs={12} md={6} lg={3} className="d-flex align-items-stretch">
      <Card
        className="w-100 shadow-sm border-0 rounded-4"
        style={{ backgroundColor: '#BFE3FA' }}
      >
        {/* Descomentar a futuro para ingresar imágen de Card del producto. */}
        {/* <Card.Img /> */}
        <Card.Body className="d-flex flex-column text-center">
          <Card.Title className="fw-bold">{nombre}</Card.Title>
          <Card.Text className="small">{descripcion}</Card.Text>
          <div className="mb-3">
            {/* Si stock es superior a 0, imprime "Stock: ...", de lo contrario muestra "Agotado" */}
            {stock > 0 ? (
              <Badge bg="success">Stock: {stock}</Badge>
            ) : (
              <Badge bg="danger">Agotado</Badge>
            )}
          </div>
          <h6 className="text-success fw-bold fs-5 mt-auto mb-3">
            {/* toLocaleString formatea los numeros al pais esperado. */}
            ${precio.toLocaleString('es-CL')}
          </h6>

          <Link to={`/productos/${id}`}>
            <Button variant="primary" className="rounded-pill fw-bold">
              Ver detalles
            </Button>
          </Link>

        </Card.Body>
      </Card>
    </Col>
  )
}

export default Producto