import { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cantidadCarrito, setCantidadCarrito] = useState(0);
    const agregarAlCarrito = (cantidad) => {
        setCantidadCarrito((prev) => prev + cantidad);
    };

    return (
        <CartContext.Provider value={{ cantidadCarrito, agregarAlCarrito }}>
            {children}
        </CartContext.Provider>
    );
}