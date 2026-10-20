import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-registro.jfif';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import NavbarProfile from './NavbarProfile';
import { useAuth } from '../context/AuthContext';

function NavbarComponent() {
    const { cantidadCarrito } = useContext(CartContext);
    const { esAdmin } = useAuth();

    return (
        <Navbar expand="lg" bg="dark" data-bs-theme="dark" sticky="top">
            <Container fluid>

                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <img
                        src={logo}
                        alt="Logo Sonido Vivo"
                        width="45"
                        height="45"
                        className="d-inline-block align-top me-2"
                        style={{ borderRadius: '8px' }}
                    />
                    <span style={{ fontWeight: 'bold', fontSize: '1.3rem', letterSpacing: '1px' }}>
                        Sonido Vivo
                    </span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto ms-4">
                        <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                        <Nav.Link as={Link} to="/productos">Productos</Nav.Link>
                        {esAdmin && (
                            <Nav.Link as={Link} to="/admin" className="fw-semibold" style={{ color: '#F59E0B' }}>
                                Panel admin
                            </Nav.Link>
                        )}
                    </Nav>

                    <Nav className="me-3">
                        <NavbarProfile />
                    </Nav>

                    <Nav>
                        {/* Conectado con as={Link} y to="/carrito" */}
                        <Button
                            as={Link}
                            to="/carrito"
                            variant="outline-warning"
                            className="d-flex align-items-center fw-semibold px-3 rounded-pill"
                            style={{ borderColor: '#F59E0B', color: '#F59E0B' }}
                        >
                            🛒 Carrito
                            {cantidadCarrito > 0 && (
                                <Badge bg="warning" text="dark" className="ms-2 rounded-pill fw-bold">
                                    {cantidadCarrito}
                                </Badge>
                            )}
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;