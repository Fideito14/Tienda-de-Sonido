const formUsuario = document.getElementById("formUsuario");
const mensaje = document.getElementById("mensaje");

function agregarUsuario(usuario) {
    bdUsuarios.set(usuario.id, usuario);
    guardarBD(bdUsuarios);
}

function limpiarFormulario() {
    document.getElementById("id").value = "";
    document.getElementById("usuario").value = "";
    document.getElementById("contraseña").value = "";
    document.getElementById("nombreCompleto").value = "";
    document.getElementById("telefono").value = "";
}

formUsuario.addEventListener("submit", function (event) {
    event.preventDefault();

    const id = document.getElementById("id").value.trim();
    const usuario = document.getElementById("usuario").value.trim();
    const contraseña = document.getElementById("contraseña").value.trim();
    const nombreCompleto = document.getElementById("nombreCompleto").value.trim();
    const telefono = document.getElementById("telefono").value.trim();

    if (id === "" || usuario === "" || contraseña === "" || nombreCompleto === "" || telefono === "") {
        mensaje.textContent = "Todos los campos son obligatorios.";
        mensaje.className = "alert alert-danger mt-3";
        return;
    }

    const idNum = Number(id);

    if (bdUsuarios.has(idNum)) {
        mensaje.textContent = "Ya existe un usuario con el ID " + id + ".";
        mensaje.className = "alert alert-danger mt-3";
        return;
    }

    const nuevoUsuario = {
        id: idNum,
        usuario: usuario,
        contraseña: contraseña,
        nombreCompleto: nombreCompleto,
        telefono: Number(telefono)
    };

    agregarUsuario(nuevoUsuario);
    limpiarFormulario();

    mensaje.textContent = "Usuario con ID " + id + " guardado correctamente.";
    mensaje.className = "alert alert-success mt-3";
});