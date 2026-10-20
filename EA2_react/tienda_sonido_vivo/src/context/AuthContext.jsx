import { createContext, useContext, useState } from 'react';
import { validarUsuario, obtenerRol, obtenerUsuarios } from '../data/users';

const AuthContext = createContext(null);

const CLAVE_SESION = 'loggedUser';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            // La sesión vive en sessionStorage: al cerrar la pestaña se cierra la sesión.
            // Se respeta una sesión antigua guardada en localStorage y se muda a sessionStorage.
            const guardado = sessionStorage.getItem(CLAVE_SESION) ?? localStorage.getItem(CLAVE_SESION);
            if (!guardado) return null;

            if (!sessionStorage.getItem(CLAVE_SESION)) {
                sessionStorage.setItem(CLAVE_SESION, guardado);
                localStorage.removeItem(CLAVE_SESION);
            }

            const { nombre, email } = JSON.parse(guardado);
            return { nombre, email, rol: obtenerRol(email) };
        } catch {
            return null;
        }
    });

    const login = (email, password) => {
        const resultado = validarUsuario(email, password);
        if (!resultado.exito) return resultado;

        const { nombre, email: correo, rol } = resultado.usuario;
        sessionStorage.setItem(CLAVE_SESION, JSON.stringify({ nombre, email: correo }));
        const sesion = { nombre, email: correo, rol: rol === 'admin' ? 'admin' : 'cliente' };
        setUser(sesion);
        return { exito: true, usuario: sesion };
    };

    const logout = () => {
        sessionStorage.removeItem(CLAVE_SESION);
        localStorage.removeItem(CLAVE_SESION); // limpia sesiones guardadas con versiones anteriores
        setUser(null);
    };

    /**
     * Vuelve a leer los datos del usuario conectado desde el almacén de usuarios.
     * Si la cuenta ya no existe, cierra la sesión.
     * @param {{nombre: string, email: string, rol?: string}} [usuarioActualizado]
     */
    const refrescarUsuario = (usuarioActualizado) => {
        if (!user) return null;

        const datos =
            usuarioActualizado ||
            obtenerUsuarios().find((u) => u.email.toLowerCase() === user.email.toLowerCase());

        if (!datos) {
            logout();
            return null;
        }

        const sesion = {
            nombre: datos.nombre,
            email: datos.email,
            rol: datos.rol === 'admin' ? 'admin' : 'cliente'
        };

        sessionStorage.setItem(CLAVE_SESION, JSON.stringify({ nombre: sesion.nombre, email: sesion.email }));
        setUser(sesion);
        return sesion;
    };

    const esAdmin = user?.rol === 'admin';

    return (
        <AuthContext.Provider value={{ user, esAdmin, login, logout, refrescarUsuario }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
