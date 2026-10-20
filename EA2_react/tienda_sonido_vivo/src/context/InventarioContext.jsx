import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { productos as productosBase } from '../data/productos';

const InventarioContext = createContext(null);

const CLAVE_STOCK = 'sonido_vivo_stock';
const CLAVE_EDICIONES = 'sonido_vivo_ediciones';

const leerObjeto = (clave) => {
    try {
        const guardado = localStorage.getItem(clave);
        const parsed = guardado ? JSON.parse(guardado) : {};
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
        return {};
    }
};

const guardarObjeto = (clave, valor) => {
    try {
        localStorage.setItem(clave, JSON.stringify(valor));
    } catch (e) {
        console.error(`Error al guardar ${clave}`, e);
    }
};

const CAMPOS_EDITABLES = ['nombre', 'marca', 'modelo', 'descripcion', 'precio'];

export function InventarioProvider({ children }) {
    const [stockActual, setStockActual] = useState(() => leerObjeto(CLAVE_STOCK));
    const [ediciones, setEdiciones] = useState(() => leerObjeto(CLAVE_EDICIONES));

    useEffect(() => guardarObjeto(CLAVE_STOCK, stockActual), [stockActual]);
    useEffect(() => guardarObjeto(CLAVE_EDICIONES, ediciones), [ediciones]);

    const productos = useMemo(
        () =>
            productosBase.map((p) => ({
                ...p,
                ...(ediciones[p.codigo] || {}),
                stock: stockActual[p.codigo] ?? p.stock,
            })),
        [stockActual, ediciones]
    );

    const obtenerProducto = (codigo) => productos.find((p) => p.codigo === codigo);

    const obtenerStock = (codigo) => obtenerProducto(codigo)?.stock;

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

    const actualizarProducto = (codigo, cambios) => {
        const base = productosBase.find((p) => p.codigo === codigo);
        if (!base) return { exito: false, mensaje: 'El producto no existe.' };

        const edicion = {};
        CAMPOS_EDITABLES.forEach((campo) => {
            if (cambios[campo] !== undefined) edicion[campo] = cambios[campo];
        });

        setEdiciones((prev) => ({ ...prev, [codigo]: edicion }));
        if (cambios.stock !== undefined) {
            setStockActual((prev) => ({ ...prev, [codigo]: cambios.stock }));
        }
        return { exito: true, mensaje: 'Producto actualizado.' };
    };

    const restablecerProducto = (codigo) => {
        const sinCodigo = (prev) => {
            const resto = { ...prev };
            delete resto[codigo];
            return resto;
        };
        setEdiciones(sinCodigo);
        setStockActual(sinCodigo);
    };

    const estaModificado = useCallback(
        (codigo) => codigo in ediciones || codigo in stockActual,
        [ediciones, stockActual]
    );

    return (
        <InventarioContext.Provider
            value={{
                productos,
                productosBase,
                obtenerProducto,
                obtenerStock,
                descontarStock,
                actualizarProducto,
                restablecerProducto,
                estaModificado,
            }}
        >
            {children}
        </InventarioContext.Provider>
    );
}

export const useInventario = () => useContext(InventarioContext);
