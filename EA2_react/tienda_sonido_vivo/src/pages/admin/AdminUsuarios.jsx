import { useMemo, useState } from 'react';
import { Row, Col, Card, Table, Form, Button, Badge, Modal } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { actualizarUsuario, eliminarUsuario, obtenerUsuarios } from '../../data/users';
import TarjetasEstadisticas from './TarjetasEstadisticas';
import {
    BORDE,
    COLOR_ACENTO,
    ESTILO_BOTON_ACENTO,
    ESTILO_CAMPO,
    ESTILO_TARJETA,
    formatearFecha,
    iniciales,
} from './adminEstilos';
import {
    aFormularioUsuario,
    generarPassword,
    validarFormularioUsuario,
} from './adminValidaciones';

const ROLES = [
    { valor: 'cliente', etiqueta: 'Cliente' },
    { valor: 'admin', etiqueta: 'Administrador' },
];

function AdminUsuarios() {
    const { user, refrescarUsuario } = useAuth();
    const { mostrarToast } = useToast();

    const [usuarios, setUsuarios] = useState(() => obtenerUsuarios());

    const [busqueda, setBusqueda] = useState('');
    const [rolFiltro, setRolFiltro] = useState('todos');

    const [editando, setEditando] = useState(null);
    const [formulario, setFormulario] = useState(aFormularioUsuario({}));
    const [errores, setErrores] = useState({});
    const [verPassword, setVerPassword] = useState(false);

    const [eliminando, setEliminando] = useState(null);

    const refrescarUsuarios = () => setUsuarios(obtenerUsuarios());

    const esSesionActual = (u) =>
        Boolean(user) && u.email.toLowerCase() === user.email.toLowerCase();

    const totalAdmins = usuarios.filter((u) => u.rol === 'admin').length;

    const motivoNoEliminable = (u) => {
        if (esSesionActual(u)) return 'No puedes eliminar tu propia cuenta desde el panel.';
        if (u.rol === 'admin' && totalAdmins <= 1) {
            return 'Debe quedar al menos un administrador activo en la tienda.';
        }
        return '';
    };

    const usuariosFiltrados = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();
        return usuarios.filter((u) => {
            const coincideRol = rolFiltro === 'todos' || u.rol === rolFiltro;
            const coincideTexto =
                !texto ||
                [u.nombre, u.email].filter(Boolean).some((campo) => campo.toLowerCase().includes(texto));
            return coincideRol && coincideTexto;
        });
    }, [usuarios, busqueda, rolFiltro]);

    const abrirEdicion = (usuario) => {
        setEditando(usuario);
        setFormulario(aFormularioUsuario(usuario));
        setErrores({});
        setVerPassword(false);
    };

    const cerrarEdicion = () => {
        setEditando(null);
        setErrores({});
    };

    const cambiarCampo = (campo) => (e) => {
        setFormulario((prev) => ({ ...prev, [campo]: e.target.value }));
        if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: '' }));
    };

    const usarPasswordGenerada = () => {
        setFormulario((prev) => ({ ...prev, password: generarPassword() }));
        if (errores.password) setErrores((prev) => ({ ...prev, password: '' }));
    };

    const guardar = (e) => {
        e.preventDefault();

        const nuevosErrores = validarFormularioUsuario(formulario, {
            usuarios,
            emailOriginal: editando.email,
        });
        setErrores(nuevosErrores);
        if (Object.keys(nuevosErrores).length > 0) return;

        const cambios = {
            nombre: formulario.nombre.trim(),
            email: formulario.email.trim(),
            rol: formulario.rol,
        };
        if (formulario.password) cambios.password = formulario.password;

        const resultado = actualizarUsuario(editando.email, cambios, { emailSesion: user?.email });

        if (resultado.exito) {
            mostrarToast(resultado.mensaje, 'success');
            if (esSesionActual(editando)) refrescarUsuario(resultado.usuario);
            refrescarUsuarios();
            cerrarEdicion();
        } else {
            mostrarToast(resultado.mensaje, 'danger');
        }
    };

    const confirmarEliminar = () => {
        const resultado = eliminarUsuario(eliminando.email, { emailSesion: user?.email });

        if (resultado.exito) {
            mostrarToast(resultado.mensaje, 'success');
            refrescarUsuarios();
        } else {
            mostrarToast(resultado.mensaje, 'danger');
        }

        setEliminando(null);
    };

    return (
        <>
            <TarjetasEstadisticas
                datos={[
                    { titulo: 'Usuarios registrados', valor: usuarios.length },
                    { titulo: 'Administradores', valor: totalAdmins },
                    { titulo: 'Clientes', valor: usuarios.length - totalAdmins },
                ]}
            />

            {/* Filtros */}

            <Card className="rounded-4 mb-4" style={ESTILO_TARJETA}>
                <Card.Body>
                    <Row className="g-3">
                        <Col xs={12} md={7}>
                            <Form.Label className="small text-secondary mb-1" htmlFor="buscarUsuario">
                                Buscar usuario
                            </Form.Label>
                            <Form.Control
                                id="buscarUsuario"
                                type="search"
                                placeholder="Nombre o correo electrónico"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                style={ESTILO_CAMPO}
                            />
                        </Col>
                        <Col xs={12} md={5}>
                            <Form.Label className="small text-secondary mb-1" htmlFor="filtroRol">
                                Rol
                            </Form.Label>
                            <Form.Select
                                id="filtroRol"
                                value={rolFiltro}
                                onChange={(e) => setRolFiltro(e.target.value)}
                                style={ESTILO_CAMPO}
                            >
                                <option value="todos">Todos los roles</option>
                                {ROLES.map((r) => (
                                    <option key={r.valor} value={r.valor}>
                                        {r.etiqueta}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Usuarios */}

            <Card className="rounded-4 overflow-hidden" style={ESTILO_TARJETA}>
                <div style={{ maxHeight: '65vh', overflow: 'auto' }}>
                    <Table variant="dark" hover responsive className="align-middle mb-0">
                        <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                            <tr>
                                <th>Usuario</th>
                                <th className="d-none d-md-table-cell">Correo electrónico</th>
                                <th>Rol</th>
                                <th className="d-none d-lg-table-cell">Alta</th>
                                <th className="text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosFiltrados.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center text-secondary py-5">
                                        No se encontraron usuarios con esos filtros.
                                    </td>
                                </tr>
                            )}

                            {usuariosFiltrados.map((u) => {
                                const motivo = motivoNoEliminable(u);
                                const soyYo = esSesionActual(u);

                                return (
                                    <tr key={u.email}>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <div
                                                    className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                                    style={{ width: '42px', height: '42px', fontSize: '0.9rem' }}
                                                    aria-hidden="true"
                                                >
                                                    {iniciales(u.nombre)}
                                                </div>
                                                <div>
                                                    <div className="fw-semibold">
                                                        {u.nombre}{' '}
                                                        {soyYo && (
                                                            <Badge bg="info" text="dark" className="rounded-pill ms-1">
                                                                Tu cuenta
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="small text-secondary d-md-none">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="d-none d-md-table-cell text-secondary">{u.email}</td>
                                        <td>
                                            <Badge
                                                bg={u.rol === 'admin' ? 'warning' : 'secondary'}
                                                text={u.rol === 'admin' ? 'dark' : undefined}
                                                className="rounded-pill px-2"
                                            >
                                                {u.rol === 'admin' ? 'Administrador' : 'Cliente'}
                                            </Badge>
                                        </td>
                                        <td className="d-none d-lg-table-cell text-secondary">
                                            {formatearFecha(u.registradoEn)}
                                        </td>
                                        <td className="text-end">
                                            <div className="d-inline-flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="warning"
                                                    className="rounded-pill fw-bold px-3"
                                                    style={ESTILO_BOTON_ACENTO}
                                                    onClick={() => abrirEdicion(u)}
                                                    aria-label={`Editar ${u.nombre}`}
                                                >
                                                    Editar
                                                </Button>
                                                <span
                                                    className="d-inline-block"
                                                    title={motivo}
                                                >
                                                    <Button
                                                        size="sm"
                                                        variant="outline-danger"
                                                        className="rounded-pill fw-bold px-3"
                                                        disabled={Boolean(motivo)}
                                                        onClick={() => setEliminando(u)}
                                                        aria-label={`Eliminar ${u.nombre}`}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            </Card>

            <p className="small text-secondary mt-3 mb-0">
                Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios.
            </p>

            {/* Edición */}
            <Modal
                show={!!editando}
                onHide={cerrarEdicion}
                centered
                size="lg"
                data-bs-theme="dark"
                contentClassName="border"
            >
                {editando && (
                    <Form onSubmit={guardar} noValidate>
                        <Modal.Header closeButton style={{ borderColor: BORDE, backgroundColor: '#18181B' }}>
                            <Modal.Title className="fs-5 fw-bold">
                                Editar usuario{' '}
                                <span className="text-secondary fw-normal">({editando.email})</span>
                            </Modal.Title>
                        </Modal.Header>

                        <Modal.Body style={{ backgroundColor: '#18181B' }}>
                            <Row className="g-3">
                                <Col xs={12} md={6}>
                                    <Form.Group controlId="admUsuarioNombre">
                                        <Form.Label className="fw-semibold">Nombre completo</Form.Label>
                                        <Form.Control
                                            value={formulario.nombre}
                                            onChange={cambiarCampo('nombre')}
                                            isInvalid={!!errores.nombre}
                                            style={ESTILO_CAMPO}
                                        />
                                        <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md={6}>
                                    <Form.Group controlId="admUsuarioEmail">
                                        <Form.Label className="fw-semibold">Correo electrónico</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={formulario.email}
                                            onChange={cambiarCampo('email')}
                                            isInvalid={!!errores.email}
                                            style={ESTILO_CAMPO}
                                        />
                                        <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md={6}>
                                    <Form.Group controlId="admUsuarioPassword">
                                        <Form.Label className="fw-semibold">Nueva contraseña</Form.Label>
                                        <div className="d-flex gap-2">
                                            <Form.Control
                                                type={verPassword ? 'text' : 'password'}
                                                autoComplete="new-password"
                                                placeholder="Déjalo vacío para mantenerla"
                                                value={formulario.password}
                                                onChange={cambiarCampo('password')}
                                                isInvalid={!!errores.password}
                                                style={ESTILO_CAMPO}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline-light"
                                                className="rounded-pill flex-shrink-0"
                                                onClick={() => setVerPassword((v) => !v)}
                                            >
                                                {verPassword ? 'Ocultar' : 'Ver'}
                                            </Button>
                                        </div>
                                        <Form.Control.Feedback type="invalid">{errores.password}</Form.Control.Feedback>
                                        <Form.Text className="text-secondary">
                                            Mín. 6 caracteres, con al menos una letra y un número.{' '}
                                            <button
                                                type="button"
                                                className="btn btn-link btn-sm p-0 align-baseline"
                                                style={{ color: COLOR_ACENTO }}
                                                onClick={usarPasswordGenerada}
                                            >
                                                Generar una
                                            </button>
                                        </Form.Text>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md={6}>
                                    <Form.Group controlId="admUsuarioRol">
                                        <Form.Label className="fw-semibold">Rol</Form.Label>
                                        <Form.Select
                                            value={formulario.rol}
                                            onChange={cambiarCampo('rol')}
                                            isInvalid={!!errores.rol}
                                            disabled={esSesionActual(editando)}
                                            style={ESTILO_CAMPO}
                                        >
                                            {ROLES.map((r) => (
                                                <option key={r.valor} value={r.valor}>
                                                    {r.etiqueta}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">{errores.rol}</Form.Control.Feedback>
                                        <Form.Text className="text-secondary">
                                            {esSesionActual(editando)
                                                ? 'No puedes cambiar tu propio rol.'
                                                : 'Los administradores tienen acceso al panel.'}
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Modal.Body>

                        <Modal.Footer
                            className="d-flex flex-wrap gap-2 justify-content-between"
                            style={{ borderColor: BORDE, backgroundColor: '#18181B' }}
                        >
                            <div>
                                <span className="d-inline-block" title={motivoNoEliminable(editando)}>
                                    <Button
                                        type="button"
                                        variant="outline-danger"
                                        className="rounded-pill"
                                        disabled={Boolean(motivoNoEliminable(editando))}
                                        onClick={() => {
                                            setEliminando(editando);
                                            cerrarEdicion();
                                        }}
                                    >
                                        Eliminar usuario
                                    </Button>
                                </span>
                            </div>
                            <div className="d-flex gap-2">
                                <Button variant="outline-light" className="rounded-pill" onClick={cerrarEdicion}>
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="warning"
                                    className="rounded-pill fw-bold px-4"
                                    style={ESTILO_BOTON_ACENTO}
                                >
                                    Guardar cambios
                                </Button>
                            </div>
                        </Modal.Footer>
                    </Form>
                )}
            </Modal>

            {/* Confirmación de eliminación */}
            <Modal
                show={!!eliminando}
                onHide={() => setEliminando(null)}
                centered
                data-bs-theme="dark"
                contentClassName="border"
            >
                {eliminando && (
                    <>
                        <Modal.Header closeButton style={{ borderColor: BORDE, backgroundColor: '#18181B' }}>
                            <Modal.Title className="fs-5 fw-bold">Eliminar usuario</Modal.Title>
                        </Modal.Header>

                        <Modal.Body style={{ backgroundColor: '#18181B' }}>
                            <p className="mb-2">
                                ¿Seguro que deseas eliminar a{' '}
                                <span className="fw-semibold">{eliminando.nombre}</span>?
                            </p>
                            <p className="small text-secondary mb-0">
                                La cuenta <span className="fw-semibold">{eliminando.email}</span> se borrará de forma
                                permanente y el usuario ya podrá iniciar sesión.
                            </p>
                        </Modal.Body>

                        <Modal.Footer style={{ borderColor: BORDE, backgroundColor: '#18181B' }}>
                            <Button variant="outline-light" className="rounded-pill" onClick={() => setEliminando(null)}>
                                Cancelar
                            </Button>
                            <Button variant="danger" className="rounded-pill fw-bold px-4" onClick={confirmarEliminar}>
                                Sí, eliminar
                            </Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </>
    );
}

export default AdminUsuarios;
