import { Dropdown, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavbarProfile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div>
            {user ? (
                <Dropdown align="end">
                    <Dropdown.Toggle
                        variant="light"
                        id="dropdown-profile"
                        className="d-flex align-items-center gap-2 bg-transparent border-0 text-dark text-decoration-none shadow-none"
                    >
                        <div
                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                            style={{ width: '38px', height: '38px', fontSize: '0.95rem' }}
                        >
                            {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="fw-medium d-none d-sm-inline">{user.nombre || 'Usuario'}</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="shadow border-0 mt-2 p-2" style={{ minWidth: '200px' }}>
                        <Dropdown.Header className="text-muted text-truncate px-3 py-1" style={{ fontSize: '0.85rem' }}>
                            {user.email}
                        </Dropdown.Header>

                        <Dropdown.Divider />

                        <Dropdown.Item
                            onClick={handleLogout}
                            className="text-danger fw-semibold rounded py-2"
                        >
                            Cerrar sesión
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            ) : (
                <Button
                    as={Link}
                    to="/iniciosesion"
                    variant="outline-primary"
                    className="rounded-pill px-4 fw-medium"
                >
                    Iniciar sesión
                </Button>
            )}
        </div>
    );
}