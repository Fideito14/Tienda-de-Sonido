import { createContext, useContext, useState } from 'react';
import { validarUsuario, obtenerRol } from '../data/users';

const AuthContext = createContext(null);

const CLAVE_SESION = 'loggedUser';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const guardado = localStorage.getItem(CLAVE_SESION);
            if (!guardado) return null;
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
        localStorage.setItem(CLAVE_SESION, JSON.stringify({ nombre, email: correo }));
        const sesion = { nombre, email: correo, rol: rol === 'admin' ? 'admin' : 'cliente' };
        setUser(sesion);
        return { exito: true, usuario: sesion };
    };

    const logout = () => {
        localStorage.removeItem(CLAVE_SESION);
        setUser(null);
    };

    const esAdmin = user?.rol === 'admin';

    return (
        <AuthContext.Provider value={{ user, esAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
