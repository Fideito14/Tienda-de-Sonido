import { useState } from 'react'
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { productos } from '../data/productos'

function DetalleProducto() {
  const { id } = useParams()

    /*
    Si productos.find no encuentra el codigo de producto.js, entonces se queda undefined
        Si lo encuentra, entonces obtiene el objeto producto. 
    */
  const producto = productos.find((p) => p.codigo === id)

    /* 
    Si producto existe, pregunta si tiene stock.
        Si tiene stock, entonces parte con 1.
        Si no tiene stock, se mantiene en 0.
    */
  const [cantidad, setCantidad] = useState(producto?.stock > 0 ? 1 : 0)

  const incrementar = () => {
    setCantidad((c) => Math.min(c + 1, producto.stock))
  }

  const decrementar = () => {
    setCantidad((c) => Math.max(c - 1, producto.stock > 0 ? 1 : 0))
  }

  if (!producto) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Producto no encontrado</Alert.Heading>
          <p>
            El producto con código <strong>{id}</strong> no existe en nuestro
            catálogo.
          </p>
          <Link to="/productos">
            <Button variant="primary" className="rounded-pill fw-bold">
              Volver a productos
            </Button>
          </Link>
        </Alert>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Card
            className="shadow-sm border-0 rounded-4"
            style={{ backgroundColor: '#BFE3FA' }}
          >
            <Card.Body className="p-4 p-md-5">
              <div className="mb-3">
                <Badge bg="secondary" className="me-2">
                  {producto.categoria}
                </Badge>
                <Badge bg="dark">Código: {producto.codigo}</Badge>
              </div>

              <Card.Title
                as="h1"
                className="fw-bold mb-3"
                style={{ color: '#1E5A9C' }}
              >
                {producto.nombre}
              </Card.Title>

              <Card.Text className="mb-4 fs-5">
                {producto.descripcion}
              </Card.Text>

              <Row className="mb-4 g-3">
                <Col sm={6}>
                  <Card.Text className="mb-1 small text-uppercase text-muted">
                    Marca
                  </Card.Text>
                  <Card.Text className="fw-bold">{producto.marca}</Card.Text>
                </Col>
                <Col sm={6}>
                  <Card.Text className="mb-1 small text-uppercase text-muted">
                    Modelo
                  </Card.Text>
                  <Card.Text className="fw-bold">{producto.modelo}</Card.Text>
                </Col>
                <Col sm={6}>
                  <Card.Text className="mb-1 small text-uppercase text-muted">
                    Stock
                  </Card.Text>
                  {producto.stock > 0 ? (
                    <Badge bg="success">Stock: {producto.stock}</Badge>
                  ) : (
                    <Badge bg="danger">Agotado</Badge>
                  )}
                </Col>
                <Col sm={6}>
                  <Card.Text className="mb-1 small text-uppercase text-muted">
                    Precio
                  </Card.Text>
                  <Card.Text className="text-success fw-bold fs-4 mb-0">
                    ${producto.precio.toLocaleString('es-CL')}
                  </Card.Text>
                </Col>
              </Row>

              <div className="d-flex align-items-center gap-3 mb-4">
                <span className="text-uppercase small text-muted">
                  Cantidad
                </span>
                <div className="d-flex align-items-center gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="rounded-circle fw-bold"
                    style={{ width: '38px', height: '38px' }}
                    onClick={decrementar}
                    disabled={producto.stock === 0 || cantidad <= 1}
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </Button>
                  <span
                    className="fw-bold fs-5 text-center"
                    style={{ minWidth: '2ch' }}
                  >
                    {cantidad}
                  </span>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="rounded-circle fw-bold"
                    style={{ width: '38px', height: '38px' }}
                    onClick={incrementar}
                    disabled={producto.stock === 0 || cantidad >= producto.stock}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </Button>
                </div>
                <span className="small text-muted">
                  (máx. {producto.stock})
                </span>
              </div>

              <div className="d-flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="rounded-pill fw-bold"
                >
                  Agregar al carrito
                </Button>
                <Link to="/productos">
                  <Button
                    variant="outline-primary"
                    size="lg"
                    className="rounded-pill fw-bold"
                  >
                    Volver a productos
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default DetalleProducto
