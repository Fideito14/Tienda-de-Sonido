function obtenerBDArray() {
    const array = [];
    for (const producto of bdProductos.values()) {
        array.push(producto);
    }
    return array;
}

function productosAleatorios(cantidad) {
    const disponibles = obtenerBDArray();
    const seleccion = [];
    while (seleccion.length < cantidad && disponibles.length > 0) {
        const indice = Math.floor(Math.random() * disponibles.length);
        seleccion.push(disponibles.splice(indice, 1)[0]);
    }
    return seleccion;
}

const tbody = document.getElementsByTagName("tbody")[0];
const filas = tbody.getElementsByTagName("tr");
const seleccion = productosAleatorios(6);

for (let i = 0; i < filas.length && i < seleccion.length; i++) {
    const celdas = filas[i].cells;
    celdas[0].textContent = i + 1;
    celdas[1].textContent = seleccion[i].codigo;
    celdas[2].textContent = seleccion[i].categoria;
    celdas[3].textContent = seleccion[i].nombre;
    celdas[4].textContent = seleccion[i].marca;
    celdas[5].textContent = seleccion[i].modelo;
    celdas[6].textContent = seleccion[i].stock;
    celdas[7].textContent = seleccion[i].precio;
    celdas[8].textContent = seleccion[i].descripcion;
}