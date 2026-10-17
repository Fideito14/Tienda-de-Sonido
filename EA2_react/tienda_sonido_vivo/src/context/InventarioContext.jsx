import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { productos as productosBase } from '../data/productos';

const InventarioContext = createContext(null);

const CLAVE_STOCK = 'sonido_vivo_stock';

// Solo se guarda el stock de los productos que ya se vendieron, ej: { GA004: 1 }
const leerStock = () => {
    try {
        const guardado = localStorage.getItem(CLAVE_STOCK);
        const parsed = guardado ? JSON.parse(guardado) : {};
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
        return {};
    }
};

export function InventarioProvider({ children }) {
    const [stockActual, setStockActual] = useState(leerStock);

    useEffect(() => {
        try {
            localStorage.setItem(CLAVE_STOCK, JSON.stringify(stockActual));
        } catch (e) {
            console.error('Error al guardar el stock', e);
        }
    }, [stockActual]);

    // Catálogo con el stock ya actualizado
    const productos = useMemo(
        () => productosBase.map((p) => ({ ...p, stock: stockActual[p.codigo] ?? p.stock })),
        [stockActual]
    );

    // Devuelve el stock actual de un producto (undefined si no existe)
    const obtenerStock = (codigo) => productos.find((p) => p.codigo === codigo)?.stock;

    // Recibe [{ codigo, cantidad }] y descuenta cada uno sin bajar de 0
    const descontarStock = (items) => {
        setStockActual((prev) => {
            const nuevo = { ...prev };
            items.forEach(({ codigo, cantidad }) => {
                const base = productosBase.find((p) => p.codigo === codigo);
                if (!base) return;
                const actual = nuevo[codigo] ?? base.stock;
                nuevo[codigo] = Math.max(0, actual - cantidad);
            });
            return nuevo;
        });
    };

    return (
        <InventarioContext.Provider value={{ productos, obtenerStock, descontarStock }}>
            {children}
        </InventarioContext.Provider>
    );
}

export const useInventario = () => useContext(InventarioContext);