const listUsuarios = [
  {
    "id": 1,
    "usuario": "jperez",
    "contraseña": "clave123",
    "nombreCompleto": "Juan Pérez González",
    "telefono": 912345678
  },
  {
    "id": 2,
    "usuario": "mrojas",
    "contraseña": "clave456",
    "nombreCompleto": "María Rojas Salinas",
    "telefono": 987654321
  },
  {
    "id": 3,
    "usuario": "cfuentes",
    "contraseña": "clave789",
    "nombreCompleto": "Carlos Fuentes Díaz",
    "telefono": 965432187
  },
  {
    "id": 4,
    "usuario": "alopez",
    "contraseña": "clave101",
    "nombreCompleto": "Ana López Morales",
    "telefono": 934567812
  },
  {
    "id": 5,
    "usuario": "pnavarro",
    "contraseña": "clave112",
    "nombreCompleto": "Pedro Navarro Vera",
    "telefono": 978654321
  }
]

const STORAGE_KEY = "bdUsuarios";

function cargarBD() {
    let guardado = null;
    try {
        guardado = localStorage.getItem(STORAGE_KEY);
    } catch (error) {
        console.error("Error al acceder a LocalStorage:", error);
    }
    if (guardado !== null) {
        try {
            return new Map(JSON.parse(guardado).map(u => [u.id, u]));
        } catch (error) {
            console.error("Error al leer LocalStorage:", error);
        }
    }
    const inicial = new Map(listUsuarios.map(u => [u.id, u]));
    guardarBD(inicial);
    return inicial;
}

function guardarBD(bd) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...bd.values()]));
    } catch (error) {
        console.error("Error al guardar en LocalStorage:", error);
    }
}

let bdUsuarios = cargarBD();