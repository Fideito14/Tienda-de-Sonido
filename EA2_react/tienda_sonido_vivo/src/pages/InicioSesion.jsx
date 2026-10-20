import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validarEmail } from '../utils/validaciones';

function InicioSesionpage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errores, setErrores] = useState({});
    const [errorGeneral, setErrorGeneral] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const { mostrarToast } = useToast();

    const validarFormulario = () => {
        const nuevosErrores = {};

        if (!validarEmail(email)) {
            nuevosErrores.email = 'Ingresa un correo electrónico válido (ej. usuario@dominio.com).';
        }

        if (!password) {
            nuevosErrores.password = 'Por favor ingresa tu contraseña.';
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorGeneral('');

        if (!validarFormulario()) {
            return;
        }

        const resultado = login(email, password);

        if (resultado.exito) {
            mostrarToast(`¡Bienvenido de nuevo, ${resultado.usuario.nombre}!`, 'success');
            // Si venías de otra página vuelves ahí; el admin va a su panel y el resto al inicio
            const destinoPorDefecto = resultado.usuario.rol === 'admin' ? '/admin' : '/';
            navigate(location.state?.from || destinoPorDefecto);
        } else {
            setErrorGeneral(resultado.mensaje);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xs={12} md={6} lg={5}>
                    <Card className="shadow-lg border-0 rounded-4" style={{ backgroundColor: '#F8FBFF' }}>
                        <Card.Body className="p-4 p-md-5">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold" style={{ color: '#1E5A9C' }}>¡Hola de nuevo!</h2>
                                <p className="text-muted">Ingresa a tu cuenta de Sonido Vivo</p>
                            </div>

                            {errorGeneral && <Alert variant="danger">{errorGeneral}</Alert>}

                            <Form onSubmit={handleSubmit} noValidate>
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label className="fw-semibold">Correo Electrónico</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="tucorreo@ejemplo.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (errores.email) setErrores({ ...errores, email: '' });
                                        }}
                                        isInvalid={!!errores.email}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errores.email}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="formPassword">
                                    <Form.Label className="fw-semibold">Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Escribe tu contraseña"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (errores.password) setErrores({ ...errores, password: '' });
                                        }}
                                        isInvalid={!!errores.password}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errores.password}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button variant="primary" type="submit" size="lg" className="w-100 rounded-pill fw-bold shadow-sm">
                                    Iniciar Sesión
                                </Button>
                            </Form>

                            <div className="text-center mt-4">
                                <span className="text-muted">¿No tienes una cuenta? </span>
                                <Link to="/registrosesion" className="text-decoration-none fw-bold" style={{ color: '#1E5A9C' }}>
                                    Regístrate aquí
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default InicioSesionpage;