import { useMemo, useState } from 'react';
import { Row, Col, Card, Table, Form, Button, Badge, Modal } from 'react-bootstrap';
import { useInventario } from '../../context/InventarioContext';
import { useToast } from '../../context/ToastContext';
import { obtenerImagen } from '../../data/imagenes';
import TarjetasEstadisticas from './TarjetasEstadisticas';
import {
    BORDE,
    ESTILO_BOTON_ACENTO,
    ESTILO_CAMPO,
    ESTILO_TARJETA,
    formatearPrecio,
} from './adminEstilos';
import {
    aFormularioProducto,
    esEnteroPositivo,
    validarFormularioProducto,
} from './adminValidaciones';

function AdminProductos() {
    const { productos, productosBase, actualizarProducto, restablecerProducto, estaModificado } =
        useInventario();
    const { mostrarToast } = useToast();

    const [busqueda, setBusqueda] = useState('');
    const [categoria, setCategoria] = useState('todas');
    const [soloModificados, setSoloModificados] = useState(false);

    const [editando, setEditando] = useState(null);
    const [formulario, setFormulario] = useState(aFormularioProducto({}));
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
            const coincideModificado = !soloModificados || estaModificado(p.codigo);
            return coincideCategoria && coincideTexto && coincideModificado;
        });
    }, [productos, busqueda, categoria, soloModificados, estaModificado]);

    const totalModificados = productos.filter((p) => estaModificado(p.codigo)).length;
    const totalAgotados = productos.filter((p) => p.stock === 0).length;

    const original = editando ? productosBase.find((p) => p.codigo === editando.codigo) : null;

    const abrirEdicion = (producto) => {
        setEditando(producto);
        setFormulario(aFormularioProducto(producto));
        setErrores({});
    };

    const cerrarEdicion = () => setEditando(null);

    const cambiarCampo = (campo) => (e) => {
        setFormulario((prev) => ({ ...prev, [campo]: e.target.value }));
        if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: '' }));
    };

    const guardar = (e) => {
        e.preventDefault();

        const nuevosErrores = validarFormularioProducto(formulario);
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

    return (
        <>
            <TarjetasEstadisticas
                datos={[
                    { titulo: 'Productos', valor: productos.length },
                    { titulo: 'Modificados', valor: totalModificados },
                    { titulo: 'Agotados', valor: totalAgotados },
                ]}
            />

            {/* Filtros */}

            <Card className="rounded-4 mb-4" style={ESTILO_TARJETA}>
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
                                style={ESTILO_CAMPO}
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
                                style={ESTILO_CAMPO}
                            >
                                <option value="todas">Todas las categorías</option>
                                {categorias.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col xs={12}>
                            <Form.Check
                                type="switch"
                                id="soloModificados"
                                label={
                                    <span className="small text-secondary">
                                        Mostrar solo los productos modificados
                                    </span>
                                }
                                checked={soloModificados}
                                onChange={(e) => setSoloModificados(e.target.checked)}
                            />
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Productos */}

            <Card className="rounded-4 overflow-hidden" style={ESTILO_TARJETA}>
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
                                            style={ESTILO_BOTON_ACENTO}
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
                                Editar producto <span className="text-secondary fw-normal">({editando.codigo})</span>
                            </Modal.Title>
                        </Modal.Header>

                        <Modal.Body style={{ backgroundColor: '#18181B' }}>
                            <Row className="g-3">
                                <Col xs={12}>
                                    <Form.Group controlId="admNombre">
                                        <Form.Label className="fw-semibold">Nombre</Form.Label>
                                        <Form.Control
                                            value={formulario.nombre}
                                            onChange={cambiarCampo('nombre')}
                                            isInvalid={!!errores.nombre}
                                            style={ESTILO_CAMPO}
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
                                            style={ESTILO_CAMPO}
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
                                            style={ESTILO_CAMPO}
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
                                            style={ESTILO_CAMPO}
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
                                            style={ESTILO_CAMPO}
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
                                            style={ESTILO_CAMPO}
                                        />
                                        <Form.Control.Feedback type="invalid">{errores.descripcion}</Form.Control.Feedback>
                                        <Form.Text className="text-secondary">{formulario.descripcion.length}/200</Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Modal.Body>

                        <Modal.Footer
                            className="d-flex flex-wrap gap-2 justify-content-between"
                            style={{ borderColor: BORDE, backgroundColor: '#18181B' }}
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
                                    style={ESTILO_BOTON_ACENTO}
                                >
                                    Guardar cambios
                                </Button>
                            </div>
                        </Modal.Footer>
                    </Form>
                )}
            </Modal>
        </>
    );
}

export default AdminProductos;
