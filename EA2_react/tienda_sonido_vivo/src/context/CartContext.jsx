import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [carrito, setCarrito] = useState(() => {
        try {
            const guardado = localStorage.getItem('sonido_vivo_carrito');
            const parsed = guardado ? JSON.parse(guardado) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('sonido_vivo_carrito', JSON.stringify(carrito));
        } catch (e) {
            console.error("Error al guardar en localStorage", e);
        }
    }, [carrito]);

    const agregarAlCarrito = (producto, cantidad = 1) => {
        if (!producto) return { exito: false, mensaje: 'Producto no válido' };

        const idUnico = producto.codigo || producto.id;
        const stockMaximo = producto.stock ?? 999;

        const carritoSeguro = Array.isArray(carrito) ? carrito : [];
        const itemExistente = carritoSeguro.find((item) => (item.codigo || item.id) === idUnico);
        const cantidadActual = itemExistente ? itemExistente.cantidad : 0;
        const totalDeseado = cantidadActual + cantidad;

        if (totalDeseado > stockMaximo) {
            return {
                exito: false,
                mensaje: `¡No puedes agregar más! El stock máximo disponible es de ${stockMaximo} unidades.`
            };
        }

        setCarrito((prevCarrito) => {
            const prevSeguro = Array.isArray(prevCarrito) ? prevCarrito : [];
            const index = prevSeguro.findIndex((item) => (item.codigo || item.id) === idUnico);

            if (index !== -1) {
                return prevSeguro.map((item, i) =>
                    i === index ? { ...item, cantidad: item.cantidad + cantidad } : item
                );
            } else {
                return [...prevSeguro, { ...producto, cantidad }];
            }
        });

        return { exito: true, mensaje: `¡Se han agregado ${cantidad} unidad(es) al carrito!` };
    };

    // Nueva función para actualizar la cantidad exacta desde el carrito
    const actualizarCantidad = (identificador, nuevaCantidad) => {
        setCarrito((prevCarrito) => {
            return prevCarrito.map((item) => {
                const idItem = item.codigo || item.id;
                if (idItem === identificador) {
                    const stockMaximo = item.stock ?? 999;
                    const cantidadValidada = Math.min(Math.max(1, nuevaCantidad), stockMaximo);
                    return { ...item, cantidad: cantidadValidada };
                }
                return item;
            });
        });
    };

    const eliminarDelCarrito = (identificador) => {
        setCarrito((prevCarrito) => {
            const prevSeguro = Array.isArray(prevCarrito) ? prevCarrito : [];
            return prevSeguro.filter((item) => (item.codigo || item.id) !== identificador);
        });
    };

    const vaciarCarrito = () => {
        setCarrito([]);
    };

    const carritoSeguro = Array.isArray(carrito) ? carrito : [];
    const cantidadCarrito = carritoSeguro.reduce((acc, item) => acc + (item.cantidad || 0), 0);
    const precioTotal = carritoSeguro.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    return (
        <CartContext.Provider value={{
            carrito: carritoSeguro,
            cantidadCarrito,
            precioTotal,
            agregarAlCarrito,
            actualizarCantidad,
            eliminarDelCarrito,
            vaciarCarrito
        }}>
            {children}
        </CartContext.Provider>
    );
}