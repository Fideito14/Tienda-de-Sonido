const USUARIO_DEMO = {
    nombre: 'Usuario Demo',
    email: 'demo@sonidovivo.cl',
    password: 'Demo123Password'
};

const USUARIO_ADMIN = {
    nombre: 'Administrador',
    email: 'admin@sonidovivo.cl',
    password: 'Admin123Password',
    rol: 'admin'
};

const obtenerUsuarios = () => {
    const guardados = localStorage.getItem('app_usuarios');
    let usuarios = guardados ? JSON.parse(guardados) : [USUARIO_DEMO];

    const hayAdmin = usuarios.some(
        (u) => u.email.toLowerCase() === USUARIO_ADMIN.email
    );
    if (!hayAdmin) {
        usuarios = [...usuarios, USUARIO_ADMIN];
    }

    if (!guardados || !hayAdmin) {
        localStorage.setItem('app_usuarios', JSON.stringify(usuarios));
    }
    return usuarios;
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
    usuarios.push({ nombre, email, password });
    localStorage.setItem('app_usuarios', JSON.stringify(usuarios));
    return { exito: true, mensaje: '¡Usuario registrado exitosamente!' };
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
