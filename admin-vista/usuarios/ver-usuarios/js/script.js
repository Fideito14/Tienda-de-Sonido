function obtenerBDArray() {
    const array = [];
    for (const usuario of bdUsuarios.values()) {
        array.push(usuario);
    }
    return array;
}

const tbody = document.getElementsByTagName("tbody")[0];
const usuarios = obtenerBDArray();
usuarios.sort((a, b) => a.id - b.id);

for (let i = 0; i < usuarios.length; i++) {
    const tr = document.createElement("tr");

    const th = document.createElement("th");
    th.scope = "row";
    th.textContent = i + 1;
    tr.appendChild(th);

    const usuario = usuarios[i];
    const celdas = [usuario.id, usuario.usuario, usuario.contraseña, usuario.nombreCompleto, usuario.telefono];
    for (const valor of celdas) {
        const td = document.createElement("td");
        td.textContent = valor;
        tr.appendChild(td);
    }

    tbody.appendChild(tr);
}