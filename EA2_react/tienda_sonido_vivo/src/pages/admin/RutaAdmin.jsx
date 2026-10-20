import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/* Correo para entrar al panel admin: admin@sonidovivo.cl
   Contraseña para entrar al panel admin: Admin123Password
*/

export default function RutaAdmin({ children }) {
    const { user, esAdmin } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/iniciosesion" replace state={{ from: location.pathname }} />;
    }

    if (!esAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}
