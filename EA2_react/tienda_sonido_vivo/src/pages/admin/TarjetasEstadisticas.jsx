import { Row, Col, Card } from 'react-bootstrap';
import { COLOR_ACENTO, ESTILO_TARJETA } from './adminEstilos';

/**
 * Tarjetas de métricas del panel.
 * @param {{ datos: Array<{ titulo: string, valor: number|string }> }} props
 */
export default function TarjetasEstadisticas({ datos }) {
    return (
        <Row className="g-3 mb-4">
            {datos.map((dato) => (
                <Col xs={12} md={4} key={dato.titulo}>
                    <Card className="rounded-4 text-center h-100" style={ESTILO_TARJETA}>
                        <Card.Body className="py-3">
                            <div className="fs-3 fw-bold" style={{ color: COLOR_ACENTO }}>
                                {dato.valor}
                            </div>
                            <div className="small text-secondary">{dato.titulo}</div>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
}
