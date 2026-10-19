import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastContext = createContext(null);

const ACENTOS = {
    success: '#22C55E',
    danger: '#EF4444',
    warning: '#F59E0B',
};

const ICONOS = {
    success: '✓',
    danger: '✕',
    warning: '!',
};

const DURACION_MS = 3500;
const MAXIMO_VISIBLES = 3;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const contadorRef = useRef(0);

    const cerrarToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    // variante: 'success' | 'danger' | 'warning'
    const mostrarToast = useCallback((mensaje, variante = 'success') => {
        contadorRef.current += 1;
        const id = contadorRef.current;
        // Se conservan solo los últimos avisos para no llenar la pantalla
        setToasts((prev) => [...prev.slice(-(MAXIMO_VISIBLES - 1)), { id, mensaje, variante }]);
    }, []);

    return (
        <ToastContext.Provider value={{ mostrarToast }}>
            {children}

            <ToastContainer className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 2000 }}>
                {toasts.map((t) => {
                    const acento = ACENTOS[t.variante] || ACENTOS.success;

                    return (
                        <Toast
                            key={t.id}
                            show
                            autohide
                            delay={DURACION_MS}
                            onClose={() => cerrarToast(t.id)}
                            style={{
                                width: 'min(360px, calc(100vw - 2rem))',
                                backgroundColor: '#18181B',
                                border: '1px solid #27272A',
                                borderLeft: `4px solid ${acento}`,
                                color: '#F4F4F5',
                            }}
                        >
                            <div className="d-flex align-items-center gap-3 px-3 py-3">
                                <span
                                    aria-hidden="true"
                                    className="d-flex align-items-center justify-content-center rounded-circle fw-bold flex-shrink-0"
                                    style={{
                                        width: '26px',
                                        height: '26px',
                                        backgroundColor: acento,
                                        color: '#09090B',
                                        fontSize: '0.85rem',
                                    }}
                                >
                                    {ICONOS[t.variante] || ICONOS.success}
                                </span>

                                <div className="flex-grow-1 small fw-semibold">{t.mensaje}</div>

                                <button
                                    type="button"
                                    className="btn-close btn-close-white flex-shrink-0"
                                    aria-label="Cerrar aviso"
                                    onClick={() => cerrarToast(t.id)}
                                />
                            </div>
                        </Toast>
                    );
                })}
            </ToastContainer>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);