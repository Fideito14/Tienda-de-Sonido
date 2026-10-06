const formulario = document.getElementById('formulario');
const email = document.getElementById('email');
const password = document.getElementById('password');
const resultadoBoton = document.getElementById('resultado-boton');

const emailUsuario = 'usuario1@usuario.com';
const passwordUsuario = 'Usuario@123';
const emailAdmin = 'admin1@admin.com';
const passwordAdmin = 'Admin@123';

formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    
    if(emailValue === '' || passwordValue === '') {
        resultadoBoton.textContent = 'Por favor, complete todos los campos.';
        resultadoBoton.className = 'alert alert-danger mt-4';
        return;
    }

    if(emailValue.endsWith('@usuario.com')) {
        if(emailValue === emailUsuario && passwordValue === passwordUsuario) {
            resultadoBoton.textContent = 'Inicio de sesión exitoso. Redirigiendo...';
            resultadoBoton.className = 'alert alert-success mt-4';
            setTimeout(function() {
                window.location.href = '../Inicio/Menu.html';
            }, 2000);
            formulario.reset();
        }
    } else if(emailValue.endsWith('@admin.com')) {
        if(emailValue === emailAdmin && passwordValue === passwordAdmin) {
            resultadoBoton.textContent = 'Inicio de sesión exitoso. Redirigiendo...';
            resultadoBoton.className = 'alert alert-success mt-4';
            setTimeout(function() {
                window.location.href = '../Inicio/Menu.html';
            }, 2000);
            formulario.reset();
        }
    } else {
        resultadoBoton.textContent = 'Credenciales incorrectas.';
        resultadoBoton.className = 'alert alert-danger mt-4';
    }
})