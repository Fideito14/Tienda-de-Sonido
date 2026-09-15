const miCarrusel = document.getElementById('carruselGuitarras');
    miCarrusel.addEventListener('slid.bs.carousel', function () {
    document.getElementById('guitarras-titulo').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
    });
});

const miCarrusel2 = document.getElementById('carruselBaterias');
    miCarrusel2.addEventListener('slid.bs.carousel', function () {
    document.getElementById('baterias-titulo').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
    });
});