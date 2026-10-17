// Las rutas apuntan a public/Imagenes (con I mayúscula, igual que la carpeta)
export const imagenesCategorias = {
    'Guitarras Acústicas': '/Imagenes/guitarra_acustica.jpg',
    'Guitarras Eléctricas': '/Imagenes/guitarra_electrica.webp',
    'Bajos Eléctricos': '/Imagenes/bajo_electrico.webp',
    'Baterías': '/Imagenes/bateria.webp',
    'Teclados y Pianos': '/Imagenes/teclado.webp',
    'Amplificadores': '/Imagenes/amplificador.webp',
    'Micrófonos': '/Imagenes/microfono.webp',
    'Pedales de Efectos': '/Imagenes/pedal.jpg',
    'Accesorios': '/Imagenes/accesorios.jfif',
    'Estudio y Grabación': '/Imagenes/grabacion.jpg',
};

export const IMAGEN_RESPALDO = '/Imagenes/accesorios.jfif';

// Devuelve la imagen del producto, la de su categoría, o el respaldo
export const obtenerImagen = (producto) =>
    producto?.imagen || imagenesCategorias[producto?.categoria] || IMAGEN_RESPALDO;