const selectProducto = document.getElementById("selectProducto");
const formProducto = document.getElementById("formProducto");
const mensaje = document.getElementById("mensaje");

let codigoActual = null;

function llenarSelectProductos() {
    selectProducto.innerHTML = '<option value="">-- Seleccione un producto --</option>';
    const productos = [...bdProductos.values()];
    productos.sort((a, b) => a.codigo.localeCompare(b.codigo));
    for (const producto of productos) {
        const option = document.createElement("option");
        option.value = producto.codigo;
        option.textContent = producto.codigo + " - " + producto.nombre;
        selectProducto.appendChild(option);
    }
}

function limpiarFormulario() {
    codigoActual = null;
    selectProducto.value = "";
    document.getElementById("codigo").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("marca").value = "";
    document.getElementById("modelo").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("descripcion").value = "";
}

function cargarProducto(codigo) {
    const producto = bdProductos.get(codigo);
    if (!producto) {
        return;
    }
    codigoActual = codigo;
    document.getElementById("codigo").value = producto.codigo;
    document.getElementById("categoria").value = producto.categoria;
    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("marca").value = producto.marca;
    document.getElementById("modelo").value = producto.modelo;
    document.getElementById("stock").value = producto.stock;
    document.getElementById("precio").value = producto.precio;
    document.getElementById("descripcion").value = producto.descripcion;
    mensaje.textContent = "";
    mensaje.className = "";
}

selectProducto.addEventListener("change", function () {
    if (selectProducto.value === "") {
        limpiarFormulario();
    } else {
        cargarProducto(selectProducto.value);
    }
});

formProducto.addEventListener("reset", function () {
    limpiarFormulario();
    mensaje.textContent = "";
    mensaje.className = "";
});

formProducto.addEventListener("submit", function (event) {
    event.preventDefault();

    if (codigoActual === null) {
        mensaje.textContent = "Debe seleccionar un producto primero.";
        mensaje.className = "alert alert-danger mt-3";
        return;
    }

    const categoria = document.getElementById("categoria").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const marca = document.getElementById("marca").value.trim();
    const modelo = document.getElementById("modelo").value.trim();
    const stock = document.getElementById("stock").value.trim();
    const precio = document.getElementById("precio").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();

    if (categoria === "" || nombre === "" || marca === "" || modelo === "" || stock === "" || precio === "" || descripcion === "") {
        mensaje.textContent = "Todos los campos son obligatorios.";
        mensaje.className = "alert alert-danger mt-3";
        return;
    }

    const producto = bdProductos.get(codigoActual);
    producto.categoria = categoria;
    producto.nombre = nombre;
    producto.marca = marca;
    producto.modelo = modelo;
    producto.stock = Number(stock);
    producto.precio = Number(precio);
    producto.descripcion = descripcion;

    guardarBD(bdProductos);
    llenarSelectProductos();
    selectProducto.value = codigoActual;

    mensaje.textContent = "Producto " + codigoActual + " actualizado correctamente.";
    mensaje.className = "alert alert-success mt-3";
});

llenarSelectProductos();