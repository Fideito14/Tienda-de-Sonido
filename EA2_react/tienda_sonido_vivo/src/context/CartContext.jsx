import { createContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useInventario } from './InventarioContext';
import { PREFIJO_CARRITO } from '../data/clavesAlmacen.js';

export const CartContext = createContext();

const CLAVE_INVITADO = `${PREFIJO_CARRITO}:invitado`;

const obtenerClave = (user) =>
    `${PREFIJO_CARRITO}:${user?.email ? user.email.toLowerCase() : 'invitado'}`;

const leerCarrito = (clave) => {
    try {
        const guardado = localStorage.getItem(clave);
        const parsed = guardado ? JSON.parse(guardado) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

/* Une el carrito "extra" (por ejemplo, el de invitado) al carrito de destino,
   sumando las cantidades de los productos repetidos sin superar el stock
   disponible de cada uno. */
const fusionarCarritos = (destino, extra, stockDisponible) => {
    const resultado = destino.map((item) => ({ ...item }));

    extra.forEach((item) => {
        const cantidad = item.cantidad || 0;
        if (cantidad <= 0) return;

        const idItem = item.codigo || item.id;
        const stockMaximo = Math.max(1, stockDisponible(item) || 0);
        const existente = resultado.find((x) => (x.codigo || x.id) === idItem);

        if (existente) {
            existente.cantidad = Math.min(existente.cantidad + cantidad, stockMaximo);
            return;
        }
        resultado.push({ ...item, cantidad: Math.min(cantidad, stockMaximo) });
    });

    return resultado;
};

export function CartProvider({ children }) {
    const { user } = useAuth();
    const { obtenerStock, obtenerProducto, descontarStock } = useInventario();
    const clave = obtenerClave(user);
    const stockDisponible = (item) => obtenerStock(item.codigo || item.id) ?? item.stock ?? 999;

    const [carrito, setCarrito] = useState(() => leerCarrito(clave));
    const [claveActual, setClaveActual] = useState(clave);

    /* Al cambiar de dueño del carrito (iniciar o cerrar sesión) se recupera el
       carrito correspondiente. Si se venía comprando como invitado, lo acumulado
       se hereda al carrito del usuario en lugar de perderse. */
    if (clave !== claveActual) {
        const veniaDeInvitado = claveActual === CLAVE_INVITADO;

        const carritoSiguiente = veniaDeInvitado
            ? fusionarCarritos(leerCarrito(clave), leerCarrito(claveActual), stockDisponible)
            : leerCarrito(clave);

        if (veniaDeInvitado) localStorage.removeItem(claveActual);

        setClaveActual(clave);
        setCarrito(carritoSiguiente);
    }

    useEffect(() => {
        try {
            localStorage.setItem(claveActual, JSON.stringify(carrito));
        } catch (e) {
            console.error('Error al guardar en localStorage', e);
        }
    }, [carrito, claveActual]);

    const agregarAlCarrito = (producto, cantidad = 1) => {
        if (!producto) return { exito: false, mensaje: 'Producto no válido' };

        const idUnico = producto.codigo || producto.id;
        const stockMaximo = obtenerStock(idUnico) ?? producto.stock ?? 999;

        if (stockMaximo <= 0) {
            return { exito: false, mensaje: 'Este producto está agotado.' };
        }

        const itemExistente = carrito.find((item) => (item.codigo || item.id) === idUnico);
        const cantidadActual = itemExistente ? itemExistente.cantidad : 0;
        const totalDeseado = cantidadActual + cantidad;

        if (totalDeseado > stockMaximo) {
            return {
                exito: false,
                mensaje: `¡No puedes agregar más! El stock máximo disponible es de ${stockMaximo} unidades.`
            };
        }

        setCarrito((prevCarrito) => {
            const index = prevCarrito.findIndex((item) => (item.codigo || item.id) === idUnico);

            if (index !== -1) {
                return prevCarrito.map((item, i) =>
                    i === index ? { ...item, cantidad: item.cantidad + cantidad } : item
                );
            }
            return [...prevCarrito, { ...producto, cantidad }];
        });

        return { exito: true, mensaje: `¡Se han agregado ${cantidad} unidad(es) al carrito!` };
    };

    const actualizarCantidad = (identificador, nuevaCantidad) => {
        setCarrito((prevCarrito) =>
            prevCarrito.map((item) => {
                const idItem = item.codigo || item.id;
                if (idItem === identificador) {
                    const stockMaximo = stockDisponible(item);
                    const cantidadValidada = Math.min(Math.max(1, nuevaCantidad), Math.max(1, stockMaximo));
                    return { ...item, cantidad: cantidadValidada };
                }
                return item;
            })
        );
    };

    const eliminarDelCarrito = (identificador) => {
        setCarrito((prevCarrito) =>
            prevCarrito.filter((item) => (item.codigo || item.id) !== identificador)
        );
    };

    const vaciarCarrito = () => {
        setCarrito([]);
    };

    const procesarCompra = () => {
        if (carrito.length === 0) {
            return { exito: false, mensaje: 'Tu carrito está vacío.' };
        }

        const sinStock = carrito.filter((item) => item.cantidad > stockDisponible(item));

        if (sinStock.length > 0) {
            const detalle = sinStock
                .map((item) => `${item.nombre} (disponible: ${stockDisponible(item)})`)
                .join(', ');
            return {
                exito: false,
                mensaje: `No hay stock suficiente para: ${detalle}. Ajusta las cantidades o elimina esos productos.`
            };
        }

        descontarStock(
            carrito.map((item) => ({ codigo: item.codigo || item.id, cantidad: item.cantidad }))
        );
        setCarrito([]);
        return { exito: true, mensaje: '¡Compra realizada con éxito!' };
    };

    const carritoConStock = carrito.map((item) => {
        const actual = obtenerProducto(item.codigo || item.id);
        return {
            ...item,
            nombre: actual?.nombre ?? item.nombre,
            precio: actual?.precio ?? item.precio,
            stock: stockDisponible(item),
        };
    });

    const cantidadCarrito = carrito.reduce((acc, item) => acc + (item.cantidad || 0), 0);
    const precioTotal = carritoConStock.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    return (
        <CartContext.Provider value={{
            carrito: carritoConStock,
            cantidadCarrito,
            precioTotal,
            agregarAlCarrito,
            actualizarCantidad,
            eliminarDelCarrito,
            vaciarCarrito,
            procesarCompra
        }}>
            {children}
        </CartContext.Provider>
    );
}