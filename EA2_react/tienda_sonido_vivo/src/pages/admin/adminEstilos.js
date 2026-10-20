// Estilos y helpers compartidos por el panel de administración.

export const COLOR_ACENTO = '#F59E0B';
export const FONDO_PAGINA = '#09090B';
export const FONDO_TARJETA = '#18181B';
export const BORDE = '#27272A';
export const COLOR_TEXTO = '#F4F4F5';

export const ESTILO_TARJETA = { backgroundColor: FONDO_TARJETA, border: `1px solid ${BORDE}` };

export const ESTILO_CAMPO = {
    backgroundColor: '#09090B',
    borderColor: '#3F3F46',
    color: COLOR_TEXTO,
};

export const ESTILO_BOTON_ACENTO = {
    backgroundColor: COLOR_ACENTO,
    borderColor: COLOR_ACENTO,
    color: '#09090B',
};

export const formatearPrecio = (valor) => `$${Number(valor).toLocaleString('es-CL')}`;

export const formatearFecha = (iso) => {
    if (!iso) return '—';
    const fecha = new Date(iso);
    if (Number.isNaN(fecha.getTime())) return '—';
    return fecha.toLocaleDateString('es-CL');
};

export const iniciales = (nombre = '') =>
    nombre
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte.charAt(0).toUpperCase())
        .join('') || 'U';
