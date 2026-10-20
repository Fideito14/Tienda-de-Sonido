import { PREFIJO_CARRITO } from './clavesAlmacen.js';

const USUARIO_DEMO = {
    nombre: 'Usuario Demo',
    email: 'demo@sonidovivo.cl',
    password: 'Demo123Password',
    rol: 'cliente'
};

const USUARIO_ADMIN = {
    nombre: 'Administrador',
    email: 'admin@sonidovivo.cl',
    password: 'Admin123Password',
    rol: 'admin'
};

const CLAVE_USUARIOS = 'app_usuarios';

/* Al cambiar el correo de un usuario, su carrito no debe quedar huérfano:
   la clave del carrito se deriva del correo, así que se traslada a la clave
   que corresponde al correo nuevo. */
const renombrarCarrito = (emailAnterior, emailNuevo) => {
    const claveAnterior = `${PREFIJO_CARRITO}:${emailAnterior.toLowerCase()}`;
    const claveNueva = `${PREFIJO_CARRITO}:${emailNuevo.toLowerCase()}`;
    if (claveAnterior === claveNueva) return;

    try {
        const carrito = localStorage.getItem(claveAnterior);
        if (carrito === null) return;

        if (localStorage.getItem(claveNueva) === null) {
            localStorage.setItem(claveNueva, carrito);
        }
        localStorage.removeItem(claveAnterior);
    } catch {
        // si el almacenamiento falla, el carrito queda como esté
    }
};

const normalizarRol = (rol) => (rol === 'admin' ? 'admin' : 'cliente');

const guardarUsuarios = (usuarios) => {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
    return usuarios;
};

export const obtenerUsuarios = () => {
    const guardados = localStorage.getItem(CLAVE_USUARIOS);
    let usuarios = guardados ? JSON.parse(guardados) : [USUARIO_DEMO];

    if (!Array.isArray(usuarios)) usuarios = [USUARIO_DEMO];

    const hayAdmin = usuarios.some(
        (u) => u.email.toLowerCase() === USUARIO_ADMIN.email.toLowerCase()
    );
    if (!hayAdmin) {
        usuarios = [...usuarios, USUARIO_ADMIN];
    }

    if (!guardados || !hayAdmin) {
        localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
    }

    return usuarios.map((u) => ({ ...u, rol: normalizarRol(u.rol) }));
};

export const registrarUsuario = (nuevoUsuario) => {
    const usuarios = obtenerUsuarios();

    const existe = usuarios.some(
        (u) => u.email.toLowerCase() === nuevoUsuario.email.toLowerCase()
    );

    if (existe) {
        return { exito: false, mensaje: 'El correo electrónico ya está registrado.' };
    }

    const { nombre, email, password } = nuevoUsuario;
    usuarios.push({
        nombre,
        email,
        password,
        rol: 'cliente',
        registradoEn: new Date().toISOString()
    });
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
    return { exito: true, mensaje: '¡Usuario registrado exitosamente!' };
};

/**
 * Actualiza los datos de un usuario existente.
 * @param {string} emailOriginal correo del usuario a modificar
 * @param {{nombre?: string, email?: string, password?: string, rol?: string}} cambios
 * @param {{emailSesion?: string}} opciones el correo del administrador conectado
 */
export const actualizarUsuario = (emailOriginal, cambios = {}, opciones = {}) => {
    const { emailSesion = '' } = opciones;
    const usuarios = obtenerUsuarios();

    const indice = usuarios.findIndex(
        (u) => u.email.toLowerCase() === emailOriginal.toLowerCase()
    );

    if (indice === -1) {
        return { exito: false, mensaje: 'El usuario no existe.' };
    }

    const anterior = usuarios[indice];
    const email = (cambios.email ?? anterior.email).trim();

    const existeOtro = usuarios.some(
        (u, i) => i !== indice && u.email.toLowerCase() === email.toLowerCase()
    );
    if (existeOtro) {
        return { exito: false, mensaje: 'Ese correo ya está registrado por otro usuario.' };
    }

    const actualizado = {
        ...anterior,
        nombre: (cambios.nombre ?? anterior.nombre).trim(),
        email,
        password: cambios.password ? cambios.password : anterior.password,
        rol: normalizarRol(cambios.rol ?? anterior.rol)
    };

    const esSesionActual = emailOriginal.toLowerCase() === emailSesion.toLowerCase();

    // El administrador conectado no puede degradarse a sí mismo.
    if (esSesionActual && actualizado.rol !== 'admin') {
        return { exito: false, mensaje: 'No puedes quitarte a ti mismo el rol de administrador.' };
    }

    // La tienda debe conservar al menos un administrador.
    if (anterior.rol === 'admin' && actualizado.rol !== 'admin') {
        const administradores = usuarios.filter((u) => normalizarRol(u.rol) === 'admin');
        if (administradores.length <= 1) {
            return { exito: false, mensaje: 'Debe quedar al menos un administrador activo en la tienda.' };
        }
    }

    usuarios[indice] = actualizado;
    guardarUsuarios(usuarios);

    // Si cambió el correo, el carrito pasa a la clave del correo nuevo.
    if (actualizado.email.toLowerCase() !== emailOriginal.toLowerCase()) {
        renombrarCarrito(emailOriginal, actualizado.email);
    }

    return {
        exito: true,
        mensaje: `Los datos de "${actualizado.nombre}" se actualizaron correctamente.`,
        usuario: actualizado
    };
};

/**
 * Elimina un usuario registrado.
 * @param {string} email correo del usuario a eliminar
 * @param {{emailSesion?: string}} opciones el correo del administrador conectado
 */
export const eliminarUsuario = (email, opciones = {}) => {
    const { emailSesion = '' } = opciones;
    const usuarios = obtenerUsuarios();

    const indice = usuarios.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (indice === -1) {
        return { exito: false, mensaje: 'El usuario no existe.' };
    }

    const objetivo = usuarios[indice];

    if (objetivo.email.toLowerCase() === emailSesion.toLowerCase()) {
        return { exito: false, mensaje: 'No puedes eliminar tu propia cuenta desde el panel.' };
    }

    if (normalizarRol(objetivo.rol) === 'admin') {
        const administradores = usuarios.filter((u) => normalizarRol(u.rol) === 'admin');
        if (administradores.length <= 1) {
            return { exito: false, mensaje: 'No puedes eliminar al último administrador de la tienda.' };
        }
    }

    usuarios.splice(indice, 1);
    guardarUsuarios(usuarios);

    return { exito: true, mensaje: `El usuario "${objetivo.nombre}" fue eliminado.` };
};

export const validarUsuario = (email, password) => {
    const usuarios = obtenerUsuarios();

    const usuarioEncontrado = usuarios.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (usuarioEncontrado) {
        return { exito: true, usuario: usuarioEncontrado };
    } else {
        return { exito: false, mensaje: 'Correo o contraseña incorrectos.' };
    }
};

export const obtenerRol = (email) => {
    if (!email) return 'cliente';
    const usuario = obtenerUsuarios().find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    return usuario?.rol === 'admin' ? 'admin' : 'cliente';
};
