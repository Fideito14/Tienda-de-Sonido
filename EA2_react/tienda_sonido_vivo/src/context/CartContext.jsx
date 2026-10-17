import { createContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useInventario } from './InventarioContext';

export const CartContext = createContext();

const PREFIJO_CARRITO = 'sonido_vivo_carrito';

// Cada usuario tiene su propia clave; sin sesión se usa "invitado"
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

export function CartProvider({ children }) {
    const { user } = useAuth();
    const { obtenerStock, descontarStock } = useInventario();
    const clave = obtenerClave(user);

    const [carrito, setCarrito] = useState(() => leerCarrito(clave));
    const [claveActual, setClaveActual] = useState(clave);

    // Si cambió la sesión, cargamos el carrito del nuevo usuario
    if (clave !== claveActual) {
        setClaveActual(clave);
        setCarrito(leerCarrito(clave));
    }

    useEffect(() => {
        try {
            localStorage.setItem(claveActual, JSON.stringify(carrito));
        } catch (e) {
            console.error('Error al guardar en localStorage', e);
        }
    }, [carrito, claveActual]);

    // Stock disponible hoy para un producto (si no se encuentra, usa el guardado en el ítem)
    const stockDisponible = (item) => obtenerStock(item.codigo || item.id) ?? item.stock ?? 999;

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

    // Verifica el stock, lo descuenta y vacía el carrito
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

    // El carrito se expone con el stock actualizado, para que los botones +/- respeten el stock real
    const carritoConStock = carrito.map((item) => ({ ...item, stock: stockDisponible(item) }));

    const cantidadCarrito = carrito.reduce((acc, item) => acc + (item.cantidad || 0), 0);
    const precioTotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

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