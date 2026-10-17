// Función para obtener los usuarios (si no hay guardados, usa el demo por defecto)
const obtenerUsuarios = () => {
    const guardados = localStorage.getItem('app_usuarios');
    if (guardados) {
        return JSON.parse(guardados);
    }
    const usuariosIniciales = [
        {
            nombre: 'Usuario Demo',
            email: 'demo@sonidovivo.cl',
            password: 'Demo123Password'
        }
    ];
    localStorage.setItem('app_usuarios', JSON.stringify(usuariosIniciales));
    return usuariosIniciales;
};

// Función para registrar un nuevo usuario
export const registrarUsuario = (nuevoUsuario) => {
    const usuarios = obtenerUsuarios();

    const existe = usuarios.some(
        (u) => u.email.toLowerCase() === nuevoUsuario.email.toLowerCase()
    );

    if (existe) {
        return { exito: false, mensaje: 'El correo electrónico ya está registrado.' };
    }

    usuarios.push(nuevoUsuario);
    localStorage.setItem('app_usuarios', JSON.stringify(usuarios));
    return { exito: true, mensaje: '¡Usuario registrado exitosamente!' };
};

// Función para validar credenciales al iniciar sesión
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