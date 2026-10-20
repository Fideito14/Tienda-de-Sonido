/**
 * Claves de almacenamiento compartidas por más de un módulo.
 * Viven aquí para que no se desincronicen si se renombran.
 * El resto de claves (sesión, usuarios, inventario) las usa un solo módulo
 * y quedan definidas junto a su lógica.
 */
export const PREFIJO_CARRITO = 'sonido_vivo_carrito';
