// src/utils/validaciones.js

export const validarEmail = (email) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email.trim());
};

export const validarPassword = (password) => {
    // Mínimo 6 caracteres, al menos 1 letra y 1 número
    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
    return regexPassword.test(password);
};

export const validarNombre = (nombre) => {
    // Al menos 3 caracteres y solo letras/espacios
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/;
    return regexNombre.test(nombre.trim());
};