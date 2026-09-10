const formulario = document.getElementById('formulario');
const nombre = document.getElementById('nombre');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const resultadoBoton = document.getElementById('resultado-boton');

formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();
    const nombreValue = nombre.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const confirmPasswordValue = confirmPassword.value.trim();

    if(nombreValue === '' || emailValue === '' || passwordValue === '' || confirmPasswordValue === '') {
        resultadoBoton.textContent = 'Por favor, complete todos los campos.';
        resultadoBoton.className = 'alert alert-danger mt-4';
        return;
    }
    
    if(passwordValue !== confirmPasswordValue) {
        resultadoBoton.textContent = 'Las contraseñas no coinciden.';
        resultadoBoton.className = 'alert alert-danger mt-4';
        return;
    }
    if(passwordValue.length < 8) {
        resultadoBoton.textContent = 'La contraseña debe tener al menos 8 caracteres.';
        resultadoBoton.className = 'alert alert-danger mt-4';
        return;
    }
    if(/[A-Z]/.test(passwordValue) === false) {
        resultadoBoton.textContent = 'La contraseña debe contener al menos una letra mayúscula.';
        resultadoBoton.className = 'alert alert-danger mt-4';
        return;
    }
    if(/[a-z]/.test(passwordValue) === false) {
        resultadoBoton.textContent = 'La contraseña debe contener al menos una letra minúscula.';
        resultadoBoton.className = 'alert alert-danger mt-4';
        return;
    }
    if(/[0-9]/.test(passwordValue) === false) {
        resultadoBoton.textContent = 'La contraseña debe contener al menos un número.';
        resultadoBoton.className = 'alert alert-danger mt-4';
        return;
    }
    if(/[@#%$.]/.test(passwordValue) === false) {
        resultadoBoton.textContent = 'La contraseña debe contener al menos un carácter especial (@, #, %, $, .).';
        resultadoBoton.className = 'alert alert-danger mt-4';
        return;
    }
    
    if(email.value.endsWith('@usuario.com')) {
        resultadoBoton.textContent = 'Usuario registrado correctamente. Redirigiendo...';
        resultadoBoton.className = 'alert alert-success mt-4';
        setTimeout(function() {
            window.location.href = '../Inicio/Menu.html';
        }, 2000);
        return;
    } else if(email.value.endsWith('@admin.com')) {
        resultadoBoton.textContent = 'Administrador registrado correctamente. Redirigiendo...';
        resultadoBoton.className = 'alert alert-success mt-4';
        setTimeout(function() {
            window.location.href = '../Inicio/Menu.html';
        }, 2000);
    }else if(email.value.endsWith('@duocuc.cl')) {
        resultadoBoton.textContent = 'Estudiante registrado correctamente. Redirigiendo...';
        resultadoBoton.className = 'alert alert-success mt-4';
        setTimeout(function() {
            window.location.href = '../Inicio/Menu.html';
        }, 2000);
    }else{
        resultadoBoton.textContent = 'Por favor, ingrese un correo válido.';
        resultadoBoton.className = 'alert alert-danger mt-4';
    }
    })