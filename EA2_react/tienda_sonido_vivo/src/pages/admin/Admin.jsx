import { NavLink, Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { COLOR_ACENTO, FONDO_PAGINA } from './adminEstilos';

const PESTANAS = [
    { to: '/admin/productos', label: 'Productos', icono: '🎸' },
    { to: '/admin/usuarios', label: 'Usuarios', icono: '👥' },
];

/**
 * Shell del panel de administración.
 * Renderiza el encabezado, las pestañas de navegación y la sección activa (Outlet).
 */
function Admin() {
    return (
        <div
            style={{ backgroundColor: FONDO_PAGINA, color: '#F4F4F5', minHeight: '100vh' }}
            className="py-5"
        >
            <Container>
                <div className="mb-4">
                    <h1 className="fw-bold text-white display-6 mb-1">Panel de administración ⚙️</h1>
                    <p className="text-secondary mb-0">
                        Gestiona los productos y los usuarios registrados de la tienda.
                    </p>
                </div>

                <nav className="d-flex flex-wrap gap-2 mb-4" aria-label="Secciones del panel">
                    {PESTANAS.map((pestana) => (
                        <NavLink
                            key={pestana.to}
                            to={pestana.to}
                            className={({ isActive }) =>
                                `btn rounded-pill px-4 fw-semibold ${isActive ? '' : 'btn-outline-light'}`
                            }
                            style={({ isActive }) =>
                                isActive
                                    ? { backgroundColor: COLOR_ACENTO, borderColor: COLOR_ACENTO, color: '#09090B' }
                                    : undefined
                            }
                        >
                            <span aria-hidden="true">{pestana.icono}</span> {pestana.label}
                        </NavLink>
                    ))}
                </nav>

                <Outlet />
            </Container>
        </div>
    );
}

export default Admin;
