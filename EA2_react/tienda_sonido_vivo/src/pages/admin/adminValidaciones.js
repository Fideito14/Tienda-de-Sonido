// Validaciones de los formularios del panel de administración.

import { validarEmail, validarNombre, validarPassword } from '../../utils/validaciones';
import { formatearPrecio } from './adminEstilos';

export const PRECIO_MAXIMO = 99999999;
export const STOCK_MAXIMO = 9999;

export const esEnteroPositivo = (texto) => /^\d+$/.test(String(texto ?? '').trim());

/* ---------- Productos ---------- */

export const aFormularioProducto = (producto = {}) => ({
    nombre: producto.nombre ?? '',
    marca: producto.marca ?? '',
    modelo: producto.modelo ?? '',
    precio: String(producto.precio ?? ''),
    stock: String(producto.stock ?? ''),
    descripcion: producto.descripcion ?? '',
});

export const validarFormularioProducto = (f) => {
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

/* ---------- Usuarios ---------- */

export const aFormularioUsuario = (usuario = {}) => ({
    nombre: usuario.nombre ?? '',
    email: usuario.email ?? '',
    password: '',
    rol: usuario.rol === 'admin' ? 'admin' : 'cliente',
});

export const validarFormularioUsuario = (formulario, opciones = {}) => {
    const { usuarios = [], emailOriginal = '' } = opciones;
    const errores = {};

    if (!validarNombre(formulario.nombre.trim())) {
        errores.nombre = 'El nombre debe tener al menos 3 letras y no contener números ni caracteres especiales.';
    }

    const email = formulario.email.trim();
    if (!validarEmail(email)) {
        errores.email = 'Ingresa un correo electrónico válido (ej. usuario@dominio.com).';
    } else {
        const yaExiste = usuarios.some(
            (u) =>
                u.email.toLowerCase() === email.toLowerCase() &&
                u.email.toLowerCase() !== emailOriginal.toLowerCase()
        );
        if (yaExiste) errores.email = 'Ese correo ya está registrado por otro usuario.';
    }

    // La contraseña solo es obligatoria cuando se está creando el usuario.
    if (formulario.password && !validarPassword(formulario.password)) {
        errores.password = 'La contraseña debe tener al menos 6 caracteres, incluyendo al menos una letra y un número.';
    }

    if (!['admin', 'cliente'].includes(formulario.rol)) {
        errores.rol = 'Selecciona un rol válido.';
    }

    return errores;
};

export const generarPassword = () => {
    const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const numeros = '23456789';
    let password = '';

    for (let i = 0; i < 6; i += 1) {
        password += letras[Math.floor(Math.random() * letras.length)];
    }
    for (let i = 0; i < 2; i += 1) {
        password += numeros[Math.floor(Math.random() * numeros.length)];
    }

    return password;
};
