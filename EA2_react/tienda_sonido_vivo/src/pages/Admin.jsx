import { useMemo, useState } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Badge, Modal } from 'react-bootstrap';
import { useInventario } from '../context/InventarioContext';
import { useToast } from '../context/ToastContext';
import { obtenerImagen } from '../data/imagenes';

const COLOR_ACENTO = '#F59E0B';
const FONDO_PAGINA = '#09090B';
const FONDO_TARJETA = '#18181B';
const BORDE = '#27272A';

const PRECIO_MAXIMO = 99999999;
const STOCK_MAXIMO = 9999;

const formatearPrecio = (valor) => `$${Number(valor).toLocaleString('es-CL')}`;

const aFormulario = (producto) => ({
    nombre: producto.nombre ?? '',
    marca: producto.marca ?? '',
    modelo: producto.modelo ?? '',
    precio: String(producto.precio ?? ''),
    stock: String(producto.stock ?? ''),
    descripcion: producto.descripcion ?? '',
});

const esEnteroPositivo = (texto) => /^\d+$/.test(texto.trim());

const validarFormulario = (f) => {
    const errores = {};

    const nombre = f.nombre.trim();
    if (nombre.length < 3) errores.nombre = 'El nombre debe tener al menos 3 caracteres.';
    else if (nombre.length > 80) errores.nombre = 'El nombre no puede superar los 80 caracteres.';

    if (!f.marca.trim()) errores.marca = 'Ingresa la marca del producto.';

    if (!esEnteroPositivo(f.precio)) {
        errores.precio = 'Ingresa el precio en pesos, solo números enteros (sin puntos).';
    } else if (Number(f.precio) < 1) {
        errores.precio = 'El precio debe ser mayor que $0.';
    } else if (Number(f.precio) > PRECIO_MAXIMO) {
        errores.precio = `El precio no puede superar ${formatearPrecio(PRECIO_MAXIMO)}.`;
    }

    if (!esEnteroPositivo(f.stock)) {
        errores.stock = 'Ingresa el stock como número entero (0 o más).';
    } else if (Number(f.stock) > STOCK_MAXIMO) {
        errores.stock = `El stock no puede superar ${STOCK_MAXIMO} unidades.`;
    }

    if (f.descripcion.length > 200) {
        errores.descripcion = 'La descripción no puede superar los 200 caracteres.';
    }

    return errores;
};

function Admin() {
    const { productos, productosBase, actualizarProducto, restablecerProducto, estaModificado } =
        useInventario();
    const { mostrarToast } = useToast();

    const [busqueda, setBusqueda] = useState('');
    const [categoria, setCategoria] = useState('todas');

    const [editando, setEditando] = useState(null);
    const [formulario, setFormulario] = useState(aFormulario({}));
    const [errores, setErrores] = useState({});

    const categorias = useMemo(
        () => [...new Set(productos.map((p) => p.categoria))],
        [productos]
    );

    const productosFiltrados = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();
        return productos.filter((p) => {
            const coincideCategoria = categoria === 'todas' || p.categoria === categoria;
            const coincideTexto =
                !texto ||
                [p.codigo, p.nombre, p.marca, p.modelo]
                    .filter(Boolean)
                    .some((campo) => campo.toLowerCase().includes(texto));
            return coincideCategoria && coincideTexto;
        });
    }, [productos, busqueda, categoria]);

    const totalModificados = productos.filter((p) => estaModificado(p.codigo)).length;
    const totalAgotados = productos.filter((p) => p.stock === 0).length;

    const original = editando ? productosBase.find((p) => p.codigo === editando.codigo) : null;

    const abrirEdicion = (producto) => {
        setEditando(producto);
        setFormulario(aFormulario(producto));
        setErrores({});
    };

    const cerrarEdicion = () => setEditando(null);

    const cambiarCampo = (campo) => (e) => {
        setFormulario((prev) => ({ ...prev, [campo]: e.target.value }));
        if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: '' }));
    };

    const guardar = (e) => {
        e.preventDefault();

        const nuevosErrores = validarFormulario(formulario);
        setErrores(nuevosErrores);
        if (Object.keys(nuevosErrores).length > 0) return;

        const resultado = actualizarProducto(editando.codigo, {
            nombre: formulario.nombre.trim(),
            marca: formulario.marca.trim(),
            modelo: formulario.modelo.trim(),
            descripcion: formulario.descripcion.trim(),
            precio: Number(formulario.precio),
            stock: Number(formulario.stock),
        });

        if (resultado.exito) {
            mostrarToast(`"${formulario.nombre.trim()}" se actualizó correctamente.`, 'success');
            cerrarEdicion();
        } else {
            mostrarToast(resultado.mensaje, 'danger');
        }
    };

    const restablecer = () => {
        restablecerProducto(editando.codigo);
        mostrarToast(`"${original.nombre}" volvió a sus valores originales.`, 'warning');
        cerrarEdicion();
    };

    const estiloTarjeta = { backgroundColor: FONDO_TARJETA, border: `1px solid ${BORDE}` };
    const estiloCampo = { backgroundColor: '#09090B', borderColor: '#3F3F46', color: '#F4F4F5' };

    return (
        <div style={{ backgroundColor: FONDO_PAGINA, color: '#F4F4F5', minHeight: '100vh' }} className="py-5">
            <Container>
                <div className="mb-4">
                    <h1 className="fw-bold text-white display-6 mb-1">Panel de administración ⚙️</h1>
                    <p className="text-secondary mb-0">
                        Modifica el nombre, el precio y el stock de los productos.
                    </p>
                </div>

                <Row className="g-3 mb-4">
                    {[
                        { titulo: 'Productos', valor: productos.length },
                        { titulo: 'Modificados', valor: totalModificados },
                        { titulo: 'Agotados', valor: totalAgotados },
                    ].map((dato) => (
                        <Col xs={4} key={dato.titulo}>
                            <Card className="rounded-4 text-center h-100" style={estiloTarjeta}>
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

                {/* Filtros */}

                <Card className="rounded-4 mb-4" style={estiloTarjeta}>
                    <Card.Body>
                        <Row className="g-3">
                            <Col xs={12} md={7}>
                                <Form.Label className="small text-secondary mb-1" htmlFor="buscar">
                                    Buscar producto
                                </Form.Label>
                                <Form.Control
                                    id="buscar"
                                    type="search"
                                    placeholder="Nombre, marca, modelo o código (ej. GA001)"
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    style={estiloCampo}
                                />
                            </Col>
                            <Col xs={12} md={5}>
                                <Form.Label className="small text-secondary mb-1" htmlFor="categoria">
                                    Categoría
                                </Form.Label>
                                <Form.Select
                                    id="categoria"
                                    value={categoria}
                                    onChange={(e) => setCategoria(e.target.value)}
                                    style={estiloCampo}
                                >
                                    <option value="todas">Todas las categorías</option>
                                    {categorias.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Productos */}
                <Card className="rounded-4 overflow-hidden" style={estiloTarjeta}>
                    <div style={{ maxHeight: '65vh', overflow: 'auto' }}>
                        <Table variant="dark" hover responsive className="align-middle mb-0">
                            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr>
                                    <th className="d-none d-md-table-cell">Código</th>
                                    <th>Producto</th>
                                    <th className="d-none d-lg-table-cell">Categoría</th>
                                    <th className="text-end">Precio</th>
                                    <th className="text-end">Stock</th>
                                    <th className="text-end">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productosFiltrados.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center text-secondary py-5">
                                            No se encontraron productos con esos filtros.
                                        </td>
                                    </tr>
                                )}

                                {productosFiltrados.map((p) => (
                                    <tr key={p.codigo}>
                                        <td className="d-none d-md-table-cell text-secondary">{p.codigo}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <img
                                                    src={obtenerImagen(p)}
                                                    alt=""
                                                    width="44"
                                                    height="44"
                                                    className="rounded-3 flex-shrink-0"
                                                    style={{ objectFit: 'cover', border: `1px solid ${BORDE}` }}
                                                />
                                                <div>
                                                    <div className="fw-semibold">
                                                        {p.nombre}{' '}
                                                        {estaModificado(p.codigo) && (
                                                            <Badge bg="warning" text="dark" className="rounded-pill ms-1">
                                                                Editado
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="small text-secondary">
                                                        {p.marca} {p.modelo && `• ${p.modelo}`}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="d-none d-lg-table-cell text-secondary">{p.categoria}</td>
                                        <td className="text-end fw-semibold">{formatearPrecio(p.precio)}</td>
                                        <td className="text-end">
                                            <Badge bg={p.stock > 0 ? 'success' : 'danger'} className="rounded-pill px-2">
                                                {p.stock > 0 ? p.stock : 'Agotado'}
                                            </Badge>
                                        </td>
                                        <td className="text-end">
                                            <Button
                                                size="sm"
                                                variant="warning"
                                                className="rounded-pill fw-bold px-3"
                                                style={{ backgroundColor: COLOR_ACENTO, borderColor: COLOR_ACENTO, color: '#09090B' }}
                                                onClick={() => abrirEdicion(p)}
                                                aria-label={`Editar ${p.nombre}`}
                                            >
                                                Editar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card>

                <p className="small text-secondary mt-3 mb-0">
                    Mostrando {productosFiltrados.length} de {productos.length} productos.
                </p>
            </Container>

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
                        <Modal.Header closeButton style={{ borderColor: BORDE, backgroundColor: FONDO_TARJETA }}>
                            <Modal.Title className="fs-5 fw-bold">
                                Editar producto <span className="text-secondary fw-normal">({editando.codigo})</span>
                            </Modal.Title>
                        </Modal.Header>

                        <Modal.Body style={{ backgroundColor: FONDO_TARJETA }}>
                            <Row className="g-3">
                                <Col xs={12}>
                                    <Form.Group controlId="admNombre">
                                        <Form.Label className="fw-semibold">Nombre</Form.Label>
                                        <Form.Control
                                            value={formulario.nombre}
                                            onChange={cambiarCampo('nombre')}
                                            isInvalid={!!errores.nombre}
                                            style={estiloCampo}
                                        />
                                        <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} sm={6}>
                                    <Form.Group controlId="admMarca">
                                        <Form.Label className="fw-semibold">Marca</Form.Label>
                                        <Form.Control
                                            value={formulario.marca}
                                            onChange={cambiarCampo('marca')}
                                            isInvalid={!!errores.marca}
                                            style={estiloCampo}
                                        />
                                        <Form.Control.Feedback type="invalid">{errores.marca}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} sm={6}>
                                    <Form.Group controlId="admModelo">
                                        <Form.Label className="fw-semibold">Modelo</Form.Label>
                                        <Form.Control
                                            value={formulario.modelo}
                                            onChange={cambiarCampo('modelo')}
                                            style={estiloCampo}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col xs={12} sm={6}>
                                    <Form.Group controlId="admPrecio">
                                        <Form.Label className="fw-semibold">Precio (CLP)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            inputMode="numeric"
                                            value={formulario.precio}
                                            onChange={cambiarCampo('precio')}
                                            isInvalid={!!errores.precio}
                                            style={estiloCampo}
                                        />
                                        <Form.Control.Feedback type="invalid">{errores.precio}</Form.Control.Feedback>
                                        <Form.Text className="text-secondary">
                                            {esEnteroPositivo(formulario.precio) && `Se mostrará como ${formatearPrecio(formulario.precio)} · `}
                                            Original: {formatearPrecio(original.precio)}
                                        </Form.Text>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} sm={6}>
                                    <Form.Group controlId="admStock">
                                        <Form.Label className="fw-semibold">Stock (unidades)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            inputMode="numeric"
                                            value={formulario.stock}
                                            onChange={cambiarCampo('stock')}
                                            isInvalid={!!errores.stock}
                                            style={estiloCampo}
                                        />
                                        <Form.Control.Feedback type="invalid">{errores.stock}</Form.Control.Feedback>
                                        <Form.Text className="text-secondary">Original: {original.stock}</Form.Text>
                                    </Form.Group>
                                </Col>

                                <Col xs={12}>
                                    <Form.Group controlId="admDescripcion">
                                        <Form.Label className="fw-semibold">Descripción</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={formulario.descripcion}
                                            onChange={cambiarCampo('descripcion')}
                                            isInvalid={!!errores.descripcion}
                                            style={estiloCampo}
                                        />
                                        <Form.Control.Feedback type="invalid">{errores.descripcion}</Form.Control.Feedback>
                                        <Form.Text className="text-secondary">{formulario.descripcion.length}/200</Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Modal.Body>

                        <Modal.Footer
                            className="d-flex flex-wrap gap-2 justify-content-between"
                            style={{ borderColor: BORDE, backgroundColor: FONDO_TARJETA }}
                        >
                            <div>
                                {estaModificado(editando.codigo) && (
                                    <Button variant="outline-danger" className="rounded-pill" onClick={restablecer}>
                                        Restablecer original
                                    </Button>
                                )}
                            </div>
                            <div className="d-flex gap-2">
                                <Button variant="outline-light" className="rounded-pill" onClick={cerrarEdicion}>
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="warning"
                                    className="rounded-pill fw-bold px-4"
                                    style={{ backgroundColor: COLOR_ACENTO, borderColor: COLOR_ACENTO, color: '#09090B' }}
                                >
                                    Guardar cambios
                                </Button>
                            </div>
                        </Modal.Footer>
                    </Form>
                )}
            </Modal>
        </div>
    );
}

export default Admin;
