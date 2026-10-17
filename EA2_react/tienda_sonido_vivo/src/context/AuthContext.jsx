import { createContext, useContext, useState } from 'react';
import { validarUsuario } from '../data/users';

const AuthContext = createContext(null);

const CLAVE_SESION = 'loggedUser';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const guardado = localStorage.getItem(CLAVE_SESION);
            if (!guardado) return null;
            // Solo se conservan nombre y email (nunca la contraseña)
            const { nombre, email } = JSON.parse(guardado);
            return { nombre, email };
        } catch {
            return null;
        }
    });

    const login = (email, password) => {
        const resultado = validarUsuario(email, password);
        if (!resultado.exito) return resultado;

        const sesion = { nombre: resultado.usuario.nombre, email: resultado.usuario.email };
        localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
        setUser(sesion);
        return { exito: true, usuario: sesion };
    };

    const logout = () => {
        localStorage.removeItem(CLAVE_SESION);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);