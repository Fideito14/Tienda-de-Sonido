const formProducto = document.getElementById("formProducto");
const mensaje = document.getElementById("mensaje");

function agregarProducto(producto) {
    bdProductos.set(producto.codigo, producto);
    guardarBD(bdProductos);
}

function limpiarFormulario() {
    document.getElementById("codigo").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("marca").value = "";
    document.getElementById("modelo").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("descripcion").value = "";
}

formProducto.addEventListener("submit", function (event) {
    event.preventDefault();

    const codigo = document.getElementById("codigo").value.trim();
    const categoria = document.getElementById("categoria").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const marca = document.getElementById("marca").value.trim();
    const modelo = document.getElementById("modelo").value.trim();
    const stock = document.getElementById("stock").value.trim();
    const precio = document.getElementById("precio").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();

    if (codigo === "" || categoria === "" || nombre === "" || marca === "" || modelo === "" || stock === "" || precio === "" || descripcion === "") {
        mensaje.textContent = "Todos los campos son obligatorios.";
        mensaje.className = "alert alert-danger mt-3";
        return;
    }

    if (bdProductos.has(codigo)) {
        mensaje.textContent = "Ya existe un producto con el código " + codigo + ".";
        mensaje.className = "alert alert-danger mt-3";
        return;
    }

    const nuevoProducto = {
        codigo: codigo,
        categoria: categoria,
        nombre: nombre,
        marca: marca,
        modelo: modelo,
        stock: Number(stock),
        precio: Number(precio),
        descripcion: descripcion
    };

    agregarProducto(nuevoProducto);
    limpiarFormulario();

    mensaje.textContent = "Producto " + codigo + " guardado correctamente.";
    mensaje.className = "alert alert-success mt-3";
});