export const usuarios = [
    {
        nombre: 'Usuario Demo',
        email: 'demo@sonidovivo.cl',
        password: 'Demo123Password'
    }
];

// Función para registrar un nuevo usuario
export const registrarUsuario = (nuevoUsuario) => {
    const existe = usuarios.some(
        (u) => u.email.toLowerCase() === nuevoUsuario.email.toLowerCase()
    );

    if (existe) {
        return { exito: false, mensaje: 'El correo electrónico ya está registrado.' };
    }

    usuarios.push(nuevoUsuario);
    return { exito: true, mensaje: '¡Usuario registrado exitosamente!' };
};

// Función para validar credenciales al iniciar sesión
export const validarUsuario = (email, password) => {
    const usuarioEncontrado = usuarios.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (usuarioEncontrado) {
        return { exito: true, usuario: usuarioEncontrado };
    } else {
        return { exito: false, mensaje: 'Correo o contraseña incorrectos.' };
    }
};