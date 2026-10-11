import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-registro.jfif';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function NavbarComponent() {
    const { cantidadCarrito } = useContext(CartContext);

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
                    </Nav>

                    <Nav>
                        <Button variant="outline-light" className="d-flex align-items-center">
                            🛒 Carrito <span className="badge bg-danger ms-2">{cantidadCarrito}</span>
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;