import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../data/users';
import { validarNombre, validarEmail, validarPassword } from '../utils/validaciones';

function RegistroSesionpage() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errores, setErrores] = useState({});
    const [errorGeneral, setErrorGeneral] = useState('');

    const navigate = useNavigate();

    const validarFormulario = () => {
        const nuevosErrores = {};

        if (!validarNombre(nombre)) {
            nuevosErrores.nombre = 'El nombre debe tener al menos 3 letras y no contener números o caracteres especiales.';
        }

        if (!validarEmail(email)) {
            nuevosErrores.email = 'Ingresa un correo electrónico válido (ej. usuario@dominio.com).';
        }

        if (!validarPassword(password)) {
            nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres, incluyendo al menos una letra y un número.';
        }

        if (password !== confirmPassword) {
            nuevosErrores.confirmPassword = 'Las contraseñas no coinciden.';
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

        const resultado = registrarUsuario({ nombre, email, password });

        if (resultado.exito) {
            alert(resultado.mensaje);
            navigate('/iniciosesion');
        } else {
            setErrorGeneral(resultado.mensaje);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={7}>
                    <Card className="shadow-lg border-0 rounded-4" style={{ backgroundColor: '#F8FBFF' }}>
                        <Card.Body className="p-4 p-md-5">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold" style={{ color: '#1E5A9C' }}>Crea tu cuenta 🎸</h2>
                                <p className="text-muted">Únete a la comunidad de Sonido Vivo</p>
                            </div>

                            {errorGeneral && <Alert variant="danger">{errorGeneral}</Alert>}

                            <Form onSubmit={handleSubmit} noValidate>
                                <Form.Group className="mb-3" controlId="formNombre">
                                    <Form.Label className="fw-semibold">Nombre Completo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ej. Juan Pérez"
                                        value={nombre}
                                        onChange={(e) => {
                                            setNombre(e.target.value);
                                            if (errores.nombre) setErrores({ ...errores, nombre: '' });
                                        }}
                                        isInvalid={!!errores.nombre}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errores.nombre}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formEmailRegistro">
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

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="formPasswordRegistro">
                                            <Form.Label className="fw-semibold">Contraseña</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Mín. 6 chars, letras y números"
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
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-4" controlId="formConfirmPassword">
                                            <Form.Label className="fw-semibold">Confirmar Contraseña</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Repite tu contraseña"
                                                value={confirmPassword}
                                                onChange={(e) => {
                                                    setConfirmPassword(e.target.value);
                                                    if (errores.confirmPassword) setErrores({ ...errores, confirmPassword: '' });
                                                }}
                                                isInvalid={!!errores.confirmPassword}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errores.confirmPassword}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button variant="primary" type="submit" size="lg" className="w-100 rounded-pill fw-bold shadow-sm">
                                    Registrarme
                                </Button>
                            </Form>

                            <div className="text-center mt-4">
                                <span className="text-muted">¿Ya tienes una cuenta? </span>
                                <Link to="/iniciosesion" className="text-decoration-none fw-bold" style={{ color: '#1E5A9C' }}>
                                    Inicia sesión aquí
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default RegistroSesionpage;