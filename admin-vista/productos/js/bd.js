const listProductos = [
  {
    "codigo": "GA001",
    "categoria": "Guitarras Acústicas",
    "nombre": "Guitarra Acústica Folk",
    "marca": "Yamaha",
    "modelo": "F310",
    "stock": 8,
    "precio": 129990,
    "descripcion": "Tapa de abeto, aros y fondo de meranti. Ideal para iniciantes."
  },
  {
    "codigo": "GA002",
    "categoria": "Guitarras Acústicas",
    "nombre": "Guitarra Acústica Dreadnought",
    "marca": "Fender",
    "modelo": "CD-60S",
    "stock": 5,
    "precio": 189990,
    "descripcion": "Tapa de abeto macizo, brazo de caoba. Sonido cálido y proyectado."
  },
  {
    "codigo": "GA003",
    "categoria": "Guitarras Acústicas",
    "nombre": "Guitarra Acústica Clásica 4/4",
    "marca": "Yamaha",
    "modelo": "C40",
    "stock": 10,
    "precio": 89990,
    "descripcion": "Nailon, tapa de abeto. Ideal para estudio y flamenco."
  },
  {
    "codigo": "GA004",
    "categoria": "Guitarras Acústicas",
    "nombre": "Guitarra Electroacústica",
    "marca": "Takamine",
    "modelo": "GN20CE",
    "stock": 3,
    "precio": 349990,
    "descripcion": "Pickup integrado, afinador incorporado."
  },
  {
    "codigo": "GA005",
    "categoria": "Guitarras Acústicas",
    "nombre": "Guitarra 3/4 Niños",
    "marca": "Yamaha",
    "modelo": "JR1",
    "stock": 6,
    "precio": 79990,
    "descripcion": "Tamaño reducido para niños de 6 a 10 años."
  },
  {
    "codigo": "GE001",
    "categoria": "Guitarras Eléctricas",
    "nombre": "Guitarra Eléctrica Stratocaster",
    "marca": "Squier",
    "modelo": "Affinity Strat",
    "stock": 5,
    "precio": 249990,
    "descripcion": "Cuerpo de álamo, mástil de arce, pastillas SSS."
  }
]

const STORAGE_KEY = "bdProductos";

function cargarBD() {
    let guardado = null;
    try {
        guardado = localStorage.getItem(STORAGE_KEY);
    } catch (error) {
        console.error("Error al acceder a LocalStorage:", error);
    }
    if (guardado !== null) {
        try {
            return new Map(JSON.parse(guardado).map(p => [p.codigo, p]));
        } catch (error) {
            console.error("Error al leer LocalStorage:", error);
        }
    }
    const inicial = new Map(listProductos.map(p => [p.codigo, p]));
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

let bdProductos = cargarBD();
