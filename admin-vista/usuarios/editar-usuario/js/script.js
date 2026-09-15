const selectUsuario = document.getElementById("selectUsuario");
const formUsuario = document.getElementById("formUsuario");
const mensaje = document.getElementById("mensaje");

let idActual = null;

function llenarSelectUsuarios() {
    selectUsuario.innerHTML = '<option value="">-- Seleccione un usuario --</option>';
    const usuarios = [...bdUsuarios.values()];
    usuarios.sort((a, b) => a.id - b.id);
    for (const usuario of usuarios) {
        const option = document.createElement("option");
        option.value = usuario.id;
        option.textContent = usuario.id + " - " + usuario.usuario;
        selectUsuario.appendChild(option);
    }
}

function limpiarFormulario() {
    idActual = null;
    selectUsuario.value = "";
    document.getElementById("id").value = "";
    document.getElementById("usuario").value = "";
    document.getElementById("contraseña").value = "";
    document.getElementById("nombreCompleto").value = "";
    document.getElementById("telefono").value = "";
}

function cargarUsuario(id) {
    const usuario = bdUsuarios.get(id);
    if (!usuario) {
        return;
    }
    idActual = id;
    document.getElementById("id").value = usuario.id;
    document.getElementById("usuario").value = usuario.usuario;
    document.getElementById("contraseña").value = usuario.contraseña;
    document.getElementById("nombreCompleto").value = usuario.nombreCompleto;
    document.getElementById("telefono").value = usuario.telefono;
    mensaje.textContent = "";
    mensaje.className = "";
}

selectUsuario.addEventListener("change", function () {
    if (selectUsuario.value === "") {
        limpiarFormulario();
    } else {
        cargarUsuario(Number(selectUsuario.value));
    }
});

formUsuario.addEventListener("reset", function () {
    limpiarFormulario();
    mensaje.textContent = "";
    mensaje.className = "";
});

formUsuario.addEventListener("submit", function (event) {
    event.preventDefault();

    if (idActual === null) {
        mensaje.textContent = "Debe seleccionar un usuario primero.";
        mensaje.className = "alert alert-danger mt-3";
        return;
    }

    const usuario = document.getElementById("usuario").value.trim();
    const contraseña = document.getElementById("contraseña").value.trim();
    const nombreCompleto = document.getElementById("nombreCompleto").value.trim();
    const telefono = document.getElementById("telefono").value.trim();

    if (usuario === "" || contraseña === "" || nombreCompleto === "" || telefono === "") {
        mensaje.textContent = "Todos los campos son obligatorios.";
        mensaje.className = "alert alert-danger mt-3";
        return;
    }

    const user = bdUsuarios.get(idActual);
    user.usuario = usuario;
    user.contraseña = contraseña;
    user.nombreCompleto = nombreCompleto;
    user.telefono = Number(telefono);

    guardarBD(bdUsuarios);
    llenarSelectUsuarios();
    selectUsuario.value = idActual;

    mensaje.textContent = "Usuario con ID " + idActual + " actualizado correctamente.";
    mensaje.className = "alert alert-success mt-3";
});

llenarSelectUsuarios();